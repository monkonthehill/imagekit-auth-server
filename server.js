// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ImageKit from 'imagekit';

dotenv.config(); // Load env vars

const app = express();

// Middleware
app.use(cors());            // Handle CORS
app.use(express.json());    // Parse JSON bodies

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Root route
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'ImageKit Auth Server is Running 🚀' });
});

// Auth endpoint
app.post('/imagekit/auth', (req, res) => {
  try {
    const authParams = imagekit.getAuthenticationParameters();
    res.status(200).json(authParams);
  } catch (error) {
    console.error("Auth generation failed:", error);
    res.status(500).json({ error: 'Failed to generate ImageKit auth params' });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
