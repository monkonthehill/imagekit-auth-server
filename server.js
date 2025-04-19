// server.js
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import ImageKit from 'imagekit';

// Configure environment variables
dotenv.config();

// Verify required environment variables
const requiredEnvVars = [
  'IMAGEKIT_PRIVATE_KEY',
  'IMAGEKIT_PUBLIC_KEY', 
  'IMAGEKIT_URL_ENDPOINT'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Initialize Express app
const app = express();

// Initialize ImageKit
const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    service: 'ImageKit Authentication Service',
    timestamp: new Date().toISOString()
  });
});

// Authentication endpoint
app.post('/imagekit/auth', (req, res) => {
  try {
    const authParams = imagekit.getAuthenticationParameters();
    console.log('Generated auth parameters');
    res.json(authParams);
  } catch (error) {
    console.error('Error generating auth parameters:', error);
    res.status(500).json({
      error: 'Failed to generate authentication parameters',
      details: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`ImageKit URL Endpoint: ${process.env.IMAGEKIT_URL_ENDPOINT}`);
});

// Handle uncaught exceptions
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
