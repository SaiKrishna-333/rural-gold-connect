const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const multer = require('multer');
const { secureHash } = require('../utils/hashing');
const { verifyDocumentAndBiometric } = require('../utils/verification');
const User = require('../models/User');
const router = express.Router();

let otpStore = {};  // Temporary OTP storage (in-memory for now)

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

const upload = multer({ storage: multer.memoryStorage() });

async function sendOTP(phoneNumber) {
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[phoneNumber] = { otp, expires: Date.now() + 5 * 60 * 1000 };

  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) {
    console.error('FAST2SMS_API_KEY not set');
    return { success: false, error: 'SMS service not configured' };
  }

  try {
    const response = await axios.post('https://www.fast2sms.com/dev/bulkV2', {
      route: 'otp',
      numbers: phoneNumber,
      message: `Your OTP is ${otp}. Valid for 5 minutes.`,
      sender_id: 'TXTIND',
      language: 'english',
    }, {
      headers: {
        'authorization': apiKey,
        'Content-Type': 'application/json',
      },
    });
    return { success: true };
  } catch (error) {
    console.error('SMS error:', error.response?.data || error.message);
    return { success: false, error: 'Failed to send OTP' };
  }
}

router.post('/register', upload.fields([{ name: 'faceImage' }, { name: 'aadharImage' }]), async (req, res) => {
  const { fullName, email, password, phone, role, aadharNumber } = req.body;
  const faceImage = req.files?.faceImage?.[0]?.buffer;
  const aadharImage = req.files?.aadharImage?.[0]?.buffer;

  if (!fullName || !email || !password || !phone || !role || !faceImage || !aadharImage || !aadharNumber) {
    return res.status(400).json({ success: false, error: 'All fields are required' });
  }

  if (!['Lender', 'Borrower'].includes(role)) {
    return res.status(400).json({ success: false, error: 'Invalid role' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, error: 'User already exists' });
  }

  const txnId = `TXN-${Date.now()}`;
  const verification = await verifyDocumentAndBiometric(faceImage, aadharImage, 'aadhar', txnId);
  if (!verification.verified) {
    return res.status(400).json({ success: false, error: verification.reason || 'Verification failed' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    fullName,
    email,
    password: hashedPassword,
    phone,
    role,
    walletAddress: `WALLET-${Date.now()}`,  // Auto-generate
    kycVerified: verification.verified,
    faceVerified: verification.verified,
    aadharHash: verification.aadhaarHash,
  });

  await newUser.save();

  const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    success: true,
    data: {
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
        walletAddress: newUser.walletAddress,
        kycVerified: newUser.kycVerified,
        faceVerified: newUser.faceVerified,
      },
    },
  });
});

router.post('/send-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ success: false, error: 'Phone number required' });
  }

  const result = await sendOTP(phone);
  res.json(result);
});

router.post('/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;
  const stored = otpStore[phone];

  if (!stored || stored.otp !== otp || stored.expires < Date.now()) {
    return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
  }

  delete otpStore[phone];
  const user = await User.findOne({ phone });
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({
    success: true,
    data: { token, user: { id: user._id, email: user.email, role: user.role } },
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        walletAddress: user.walletAddress,
        kycVerified: user.kycVerified,
        faceVerified: user.faceVerified,
      },
    },
  });
});

router.get('/verify', authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(401).json({ success: false, error: 'User not found' });
  }

  res.json({
    success: true,
    data: {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      walletAddress: user.walletAddress,
      kycVerified: user.kycVerified,
      faceVerified: user.faceVerified,
    },
  });
});

router.post('/logout', (req, res) => {
  res.json({ success: true });
});

module.exports = router;
