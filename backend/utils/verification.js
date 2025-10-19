const { createWorker } = require('tesseract.js');
const sharp = require('sharp');
const axios = require('axios');
const { secureHash } = require('./hashing');

// Function to perform OCR on an image
async function performOCR(imageBuffer) {
  const worker = await createWorker('eng');
  const { data: { text } } = await worker.recognize(imageBuffer);
  await worker.terminate();
  return text;
}

// Function to validate Indian documents (Aadhar, PAN, Voter ID)
function validateDocument(text, docType) {
  const patterns = {
    aadhar: /\d{4}\s?\d{4}\s?\d{4}/,  // Aadhar number pattern
    pan: /[A-Z]{5}[0-9]{4}[A-Z]{1}/,    // PAN number pattern
    voter: /\w{3}\d{7}/,                // Voter ID pattern (simplified)
  };

  return patterns[docType.toLowerCase()]?.test(text) || false;
}

// Enhanced face verification with cosine similarity (mock embeddings for demo)
async function cosineSimilarity(emb1, emb2) {
  if (!emb1 || !emb2 || emb1.length !== emb2.length) return 0;
  const dot = emb1.reduce((sum, v, i) => sum + v * emb2[i], 0);
  const norm1 = Math.sqrt(emb1.reduce((s, v) => s + v * v, 0));
  const norm2 = Math.sqrt(emb2.reduce((s, v) => s + v * v, 0));
  return norm1 && norm2 ? dot / (norm1 * norm2) : 0;
}

// Simulate embedding extraction (in real app, use a model)
function extractEmbedding(imageBuffer) {
  // Mock embedding: random array for demo
  return Array.from({ length: 128 }, () => Math.random());
}

// Main verification function
async function verifyDocumentAndBiometric(faceImageBuffer, docImageBuffer, docType, txnId) {
  try {
    // OCR on document
    const docText = await performOCR(docImageBuffer);
    const isValidDoc = validateDocument(docText, docType);

    if (!isValidDoc) {
      return { verified: false, reason: 'Invalid document format', score: 0 };
    }

    // Extract embeddings
    const faceEmbedding = extractEmbedding(faceImageBuffer);
    const docEmbedding = extractEmbedding(docImageBuffer);  // Mock for now

    // Cosine similarity
    const score = await cosineSimilarity(faceEmbedding, docEmbedding);

    // Secure hash for document
    const aadhaarHash = secureHash(docText, txnId);

    return {
      verified: score >= 0.75,  // Threshold
      score,
      aadhaarHash: aadhaarHash.finalHash,
      docText,
    };
  } catch (error) {
    console.error('Verification error:', error);
    return { verified: false, reason: 'Processing error' };
  }
}

module.exports = { performOCR, validateDocument, cosineSimilarity, verifyDocumentAndBiometric };
