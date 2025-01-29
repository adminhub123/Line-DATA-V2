const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');
const { authLimiter, apiLimiter } = require('./middleware/rateLimiter');
const logger = require('./utils/logger');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const friendRoutes = require('./routes/friendRoutes');
const contactRoutes = require('./routes/contactRoutes');
const registerRoutes = require('./routes/registerRoutes');
const statsRoutes = require('./routes/statsRoutes');

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

// Set trust proxy for Railway
app.set('trust proxy', 1);

// Base path for API
const basePath = '/api';

// Routes with base path
app.use(`${basePath}/auth`, authLimiter, authRoutes);
app.use(`${basePath}/users`, apiLimiter, userRoutes);
app.use(`${basePath}/messages`, apiLimiter, messageRoutes);
app.use(`${basePath}/friends`, apiLimiter, friendRoutes);
app.use(`${basePath}/contacts`, apiLimiter, contactRoutes);
app.use(`${basePath}/register`, apiLimiter, registerRoutes);
app.use(`${basePath}/stats`, apiLimiter, statsRoutes);

// Also support routes without base path
app.use('/auth', authLimiter, authRoutes);
app.use('/users', apiLimiter, userRoutes);
app.use('/messages', apiLimiter, messageRoutes);
app.use('/friends', apiLimiter, friendRoutes);
app.use('/contacts', apiLimiter, contactRoutes);
app.use('/register', apiLimiter, registerRoutes);
app.use('/stats', apiLimiter, statsRoutes);

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
  res.json({ message: 'Line API is running' });
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
    status: 'error',
    message: err.message || 'Internal server error'
  });
});

// Handle 404
app.use((req, res) => {
  logger.warn('404 Not Found:', {
    path: req.path,
    method: req.method
  });
  res.status(404).json({
    status: 'error',
    message: 'Not Found'
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server is running on port ${PORT}`);
  console.log(`Server is running on port ${PORT}`);
});