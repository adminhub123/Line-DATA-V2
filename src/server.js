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
const dashboardRoutes = require('./routes/dashboardRoutes');
const fileRoutes = require('./routes/fileRoutes');

const User = require('./models/User');
const logger = require('./utils/logger');

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(helmet()); 
app.use(securityHeaders);

// Set trust proxy for rate limiter behind reverse proxy
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

// แก้ไข server.js
// รองรับทั้งแบบมี /api และไม่มี
app.use('/api/auth', authLimiter, authRoutes);  // สำหรับโปรแกรม
app.use('/auth', authLimiter, authRoutes);      // สำหรับ web

app.use('/api/users', apiLimiter, userRoutes);  
app.use('/users', apiLimiter, userRoutes);

app.use('/api/messages', apiLimiter, messageRoutes);
app.use('/messages', apiLimiter, messageRoutes);

app.use('/api/friends', apiLimiter, friendRoutes);
app.use('/friends', apiLimiter, friendRoutes);

app.use('/api/contacts', apiLimiter, contactRoutes);
app.use('/contacts', apiLimiter, contactRoutes);

app.use('/api/register', apiLimiter, registerRoutes);
app.use('/register', apiLimiter, registerRoutes);

app.use('/api/stats', apiLimiter, statsRoutes);
app.use('/stats', apiLimiter, statsRoutes);

app.use('/api/dashboard', apiLimiter, dashboardRoutes);
app.use('/dashboard', apiLimiter, dashboardRoutes);

app.use('/api/files', apiLimiter, fileRoutes);
app.use('/files', apiLimiter, fileRoutes);

// เพิ่ม static path สำหรับไฟล์ที่อัพโหลด
app.use('/uploads', express.static('uploads'));

// Error handler (ต้องอยู่หลัง routes ทั้งหมด)
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
        expiration: new Date(Date.now() + (1000 * 24 * 60 * 60 * 1000)) // 1000 วัน
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
        expiration: new Date(Date.now() + (1000 * 24 * 60 * 60 * 1000)) // 1000 วัน
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