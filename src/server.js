const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet'); // เพิ่ม helmet
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');
const securityHeaders = require('./middleware/security'); // เพิ่ม security headers
const { authLimiter, apiLimiter } = require('./middleware/rateLimiter');
const User = require('./models/User');

// Import routes
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const friendRoutes = require('./routes/friendRoutes');
const contactRoutes = require('./routes/contactRoutes');
const registerRoutes = require('./routes/registerRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();

app.set('trust proxy', 1);

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(helmet()); // เพิ่ม helmet middleware
app.use(securityHeaders); // เพิ่ม security headers middleware

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Line API is running' });
});

// Apply rate limiters to routes
app.use('/api/Auth', authLimiter, authRoutes);
app.use('/messages', apiLimiter, messageRoutes);
app.use('/friends', apiLimiter, friendRoutes);
app.use('/contacts', apiLimiter, contactRoutes);
app.use('/register', apiLimiter, registerRoutes);
app.use('/stats', apiLimiter, statsRoutes);

// Error handler (ต้องอยู่หลัง routes ทั้งหมด)
app.use(errorHandler);

// Create test user if not exists
async function createTestUser() {
  try {
    const testUser = await User.findOne({ username: 'test' });
    if (!testUser) {
      await User.create({
        username: 'test',
        password: 'test123',
        role: 'admin',
        team: 'admin'
      });
      console.log('Test user created');
    }
  } catch (error) {
    console.error('Error creating test user:', error);
  }
}

createTestUser();

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});