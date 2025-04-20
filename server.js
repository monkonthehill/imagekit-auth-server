import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import ImageKit from 'imagekit';

// Initialize environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'IMAGEKIT_PUBLIC_KEY',
  'IMAGEKIT_PRIVATE_KEY',
  'IMAGEKIT_URL_ENDPOINT',
  'PORT'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Initialize Express
const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// Rate Limiting (100 requests per 15 minutes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later.'
});

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Health Check Endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'ImageKit Authentication Service',
    timestamp: new Date().toISOString()
  });
});

// Authentication Endpoint
app.post('/imagekit/auth', apiLimiter, express.json(), (req, res) => {
  try {
    // Generate authentication parameters
    const authParams = imagekit.getAuthenticationParameters();
    
    res.json({
      success: true,
      ...authParams,
      timestamp: new Date().getTime()
    });
  } catch (error) {
    console.error('Authentication Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate authentication parameters',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔑 ImageKit Public Key: ${process.env.IMAGEKIT_PUBLIC_KEY}`);
  console.log(`🌐 URL Endpoint: ${process.env.IMAGEKIT_URL_ENDPOINT}`);
});
