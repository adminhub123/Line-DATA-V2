// src/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');
const { authLimiter, apiLimiter } = require('./middleware/rateLimiter');
const logger = require('./utils/logger');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes')
const fileRoutes = require('./routes/fileRoutes');
const contactRoutes = require('./routes/contactRoutes');
const friendRoutes = require('./routes/friendRoutes');
const messageRoutes = require('./routes/messageRoutes');
const registerRoutes = require('./routes/registerRoutes');
const statsRoutes = require('./routes/statsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const groupRoutes = require('./routes/groupRoutes');
const fileDataRoutes = require('./routes/fileDataRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const collRoutes = require('./routes/collRoutes');

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

// Request parsers
app.use(express.json());
app.use(fileUpload({
  limits: { 
    fileSize: 500 * 1024 * 1024 // 500MB
  },
  abortOnLimit: true, // จะส่ง error ทันทีถ้าไฟล์ใหญ่เกิน
  useTempFiles: true, // ใช้ temp files แทน memory
  tempFileDir: '/tmp/', // directory สำหรับ temp files
  debug: process.env.NODE_ENV !== 'production'
}));

// Set trust proxy for Railway
app.set('trust proxy', 1);

// Create uploads directory if it doesn't exist
const fs = require('fs');
const path = require('path');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Base path for API
const basePath = '/api';

// Add to routes
app.use('/api', fileDataRoutes);
app.use('/api', collectionRoutes);
app.use('/api', collRoutes);

// Routes with base path
app.use(`${basePath}/auth`, authLimiter, authRoutes);
app.use(`${basePath}/users`, apiLimiter, userRoutes);
app.use(`${basePath}/File`, apiLimiter, fileRoutes);
app.use(`${basePath}/contacts`, apiLimiter, contactRoutes);
app.use(`${basePath}/friends`, apiLimiter, friendRoutes);
app.use(`${basePath}/messages`, apiLimiter, messageRoutes);
app.use(`${basePath}/HistoryRegister`, apiLimiter, registerRoutes);
app.use(`${basePath}/stats`, apiLimiter, statsRoutes);
app.use(`${basePath}/admins`, apiLimiter, adminRoutes);
app.use(`${basePath}/CreateGroup`, apiLimiter, groupRoutes);

// Also support routes without base path for backward compatibility
app.use('/auth', authLimiter, authRoutes);
app.use('/users', apiLimiter, userRoutes);
app.use('/File', apiLimiter, fileRoutes);
app.use('/contacts', apiLimiter, contactRoutes);
app.use('/friends', apiLimiter, friendRoutes);
app.use('/messages', apiLimiter, messageRoutes);
app.use('/HistoryRegister', apiLimiter, registerRoutes);
app.use('/stats', apiLimiter, statsRoutes);
app.use('/admins', apiLimiter, adminRoutes);
app.use('/CreateGroup', apiLimiter, groupRoutes);
app.use('/', collRoutes);

// Static file serving
app.use('/uploads', express.static('uploads'));

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