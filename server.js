// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const ImageKit = require('imagekit');
const app = express();

// Verify environment variables are loaded
console.log('Checking ImageKit config:', {
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY ? 'exists' : 'missing',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT ? 'exists' : 'missing'
});

// Initialize ImageKit with proper error handling
let imagekit;
try {
  imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
  });
} catch (err) {
  console.error('ImageKit initialization failed:', err.message);
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'OK', service: 'ImageKit Auth Service' });
});

// Auth endpoint
app.post('/imagekit/auth', (req, res) => {
  try {
    // Add your authentication logic here if needed
    const authParams = imagekit.getAuthenticationParameters();
    res.json(authParams);
  } catch (err) {
    console.error('Auth error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('ImageKit configured with endpoint:', process.env.IMAGEKIT_URL_ENDPOINT);
});
