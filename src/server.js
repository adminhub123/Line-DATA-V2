const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');
const { authLimiter, apiLimiter } = require('./middleware/rateLimiter');
const securityHeaders = require('./middleware/security');
const logger = require('./utils/logger');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const friendRoutes = require('./routes/friendRoutes');
const contactRoutes = require('./routes/contactRoutes');
const registerRoutes = require('./routes/registerRoutes');
const statsRoutes = require('./routes/statsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const collectionRoutes = require('./routes/collectionRoutes');

const app = express();

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 86400
}));

// Security headers
app.use(helmet());
app.use(express.json());
app.use(securityHeaders);

// Set trust proxy for Railway
app.set('trust proxy', 1);

// Base path for API
const basePath = '/api';

// PocketBase compatibility routes
app.use(`${basePath}/admins`, adminRoutes);
app.use(`${basePath}/collections`, collectionRoutes); 

// Main application routes with rate limiting
app.use(`${basePath}/auth`, authLimiter, authRoutes);
app.use(`${basePath}/users`, apiLimiter, userRoutes);
app.use(`${basePath}/messages`, apiLimiter, messageRoutes);
app.use(`${basePath}/friends`, apiLimiter, friendRoutes);
app.use(`${basePath}/contacts`, apiLimiter, contactRoutes);
app.use(`${basePath}/register`, apiLimiter, registerRoutes);
app.use(`${basePath}/stats`, apiLimiter, statsRoutes);

// Also support routes without base path for compatibility
app.use('/auth', authLimiter, authRoutes);
app.use('/users', apiLimiter, userRoutes);
app.use('/messages', apiLimiter, messageRoutes);
app.use('/friends', apiLimiter, friendRoutes);
app.use('/contacts', apiLimiter, contactRoutes);
app.use('/register', apiLimiter, registerRoutes);
app.use('/stats', apiLimiter, statsRoutes);
app.use('/admins', adminRoutes);
app.use('/collections', collectionRoutes);

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    logger.error('MongoDB connection error:', err);
    console.error('MongoDB connection error:', err);
  });

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Line API is running',
    version: '1.0.0',
    status: 'OK'
  });
});

// Global response formatter middleware
app.use((req, res, next) => {
  const oldJson = res.json;
  res.json = function(data) {
    // Format success response like PocketBase
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return oldJson.call(this, {
        code: res.statusCode,
        message: "",
        data: data
      });
    }
    // Keep error response as is
    return oldJson.call(this, data);
  };
  next();
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Global error:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  res.status(err.status || 500).json({
    code: err.status || 500,
    message: process.env.NODE_ENV === 'production' ? 
      'Internal server error' : err.message,
    data: {}
  });
});

// Handle 404
app.use((req, res) => {
  logger.warn('404 Not Found:', {
    path: req.path,
    method: req.method
  });

  res.status(404).json({
    code: 404,
    message: 'Not Found',
    data: {}
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server is running on port ${PORT}`);
  console.log(`Server is running on port ${PORT}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', reason);
});