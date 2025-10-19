const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['Lender', 'Borrower'], required: true },
  walletAddress: { type: String, required: false },
  kycVerified: { type: Boolean, default: false },
  faceVerified: { type: Boolean, default: false },
  aadharHash: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
