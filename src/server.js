const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');
const securityHeaders = require('./middleware/security');
const { authLimiter, apiLimiter } = require('./middleware/rateLimiter');
const auth = require('./middleware/auth');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const friendRoutes = require('./routes/friendRoutes');
const contactRoutes = require('./routes/contactRoutes');
const registerRoutes = require('./routes/registerRoutes');
const statsRoutes = require('./routes/statsRoutes');
const fileRoutes = require('./routes/fileRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const User = require('./models/User');
const logger = require('./utils/logger');

const app = express();

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Global Middleware
app.use(express.json());
app.use(helmet()); 
app.use(securityHeaders);

// Set trust proxy for rate limiter
app.set('trust proxy', 1);

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
app.use(`${basePath}/files`, apiLimiter, fileRoutes);
app.use(`${basePath}/dashboard`, apiLimiter, dashboardRoutes);

// Also support routes without base path
app.use('/auth', authLimiter, authRoutes);
app.use('/users', apiLimiter, userRoutes);
app.use('/messages', apiLimiter, messageRoutes);
app.use('/friends', apiLimiter, friendRoutes);
app.use('/contacts', apiLimiter, contactRoutes);
app.use('/register', apiLimiter, registerRoutes);
app.use('/stats', apiLimiter, statsRoutes);
app.use('/files', apiLimiter, fileRoutes);
app.use('/dashboard', apiLimiter, dashboardRoutes);

// Static files
app.use('/uploads', express.static('uploads'));

// Error handler
app.use(errorHandler);

// Create test users if not exists
async function createTestUsers() {
  try {
    // สร้าง user สำหรับเว็บ
    const webAdmin = await User.findOne({ username: 'admin' });
    if (!webAdmin) {
      await User.create({
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        team: 'admin',
        isWebAdmin: true,
        expiration: new Date(Date.now() + (1000 * 24 * 60 * 60 * 1000))
      });
      logger.info('Web admin user created');
    }

    // สร้าง user สำหรับโปรแกรม
    const programUser = await User.findOne({ username: 'test' });
    if (!programUser) {
      await User.create({
        username: 'test',
        password: 'test123',
        role: 'admin',
        team: 'admin',
        isWebAdmin: false,
        expiration: new Date(Date.now() + (1000 * 24 * 60 * 60 * 1000))
      });
      logger.info('Program test user created');
    }
  } catch (error) {
    logger.error('Error creating test users:', error);
  }
}

createTestUsers();

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server is running on port ${PORT}`);
  console.log(`Server is running on port ${PORT}`);
});