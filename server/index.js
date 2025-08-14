require('dotenv').config();
const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth');
const vaultRoutes = require('./routes/vault');
const userRoutes = require('./routes/user');
const importRoutes = require('./routes/import');
const paymentRoutes = require('./routes/payments');
const { errorHandler } = require('./middleware/errorHandler');
const { verifyJWT } = require('./middleware/auth');

const app = express();

// Security Middlewares
app.use(helmet());

// CORS configuration for multiple origins
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://client-ol029p464-musas-projects-0c653b67.vercel.app',
  'http://localhost:3000',
  'https://localhost:3000'
];

app.use(cors({ 
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins for now
    }
  },
  credentials: true 
}));

app.use(express.json());
app.use(cookieParser());

// Session configuration for Passport
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Rate Limiting - DISABLED FOR DEVELOPMENT
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: 'Too many requests from this IP, please try again later.'
// });
// app.use(limiter);

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'CipherVault API is running! 🚀', 
    version: '1.0.1',
    status: 'OAuth Fixed - Ready for Production',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      vault: '/api/vault',
      user: '/api/user',
      payments: '/api/payments'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/vault', verifyJWT, vaultRoutes);
app.use('/api/user', verifyJWT, userRoutes);
app.use('/api/import', verifyJWT, importRoutes);
app.use('/api/payments', paymentRoutes);

// Error Handler
app.use(errorHandler);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('✅ MongoDB connected successfully');
  
  // Start HTTP server for development
  app.listen(process.env.PORT || 5000, () => {
    console.log(`� HTTP Server running on port ${process.env.PORT || 5000}`);
    console.log(`🌐 API available at: http://localhost:${process.env.PORT || 5000}/api`);
  });
}).catch((err) => {
  console.error('❌ MongoDB connection failed:', err.message);
  console.log('🔄 Starting server anyway - some features may not work');
  
  // Start server even without MongoDB for frontend testing
  app.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 HTTP Server running on port ${process.env.PORT || 5000} (NO DATABASE)`);
  });
});
