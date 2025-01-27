const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

// Login สำหรับ web
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      logger.warn(`Login attempt failed: User not found - ${username}`);
      return res.status(401).json({ 
        message: 'Authentication failed: User not found',
        username: '',
        role: '',
        team: '',
        token: '',
        expiration: null,
        name: ''
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.warn(`Login attempt failed: Invalid password - ${username}`);
      return res.status(401).json({ 
        message: 'Authentication failed: Invalid password',
        username: '',
        role: '',
        team: '',
        token: '',
        expiration: null,
        name: ''
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 24);

    user.lastLogin = new Date();
    await user.save();

    res.json({
      username: user.username,
      name: user.username,
      role: user.role,
      team: user.team,
      token: token,
      expiration: expiration,
      message: 'Login successful'
    });

  } catch (error) {
    logger.error('Login error', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      message: 'Internal server error',
      username: '',
      role: '',
      team: '',
      token: '',
      expiration: null,
      name: ''
    });
  }
};

// Login สำหรับ program
exports.loginProgram = async (req, res) => {
  console.log('Request Body:', req.body);
  console.log('Request Headers:', req.headers);
  try {
    // Log incoming request
    logger.info('Login Program Request:', {
      headers: req.headers,
      body: req.body,
      query: req.query,
      method: req.method,
      path: req.path
    });

    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      logger.warn(`Program login attempt failed: User not found - ${username}`);
      return res.status(401).json({ 
        username: '',
        name: '',
        role: '',
        team: '',
        token: '',
        expiration: null,
        message: 'Invalid username, password, or hwid',
        brandid: null
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.warn(`Program login attempt failed: Invalid password - ${username}`);
      return res.status(401).json({ 
        username: '',
        name: '',
        role: '',
        team: '',
        token: '',
        expiration: null,
        message: 'Invalid username, password, or hwid',
        brandid: null
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    // Calculate expiration
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 24);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    logger.info(`Program login successful: ${username}`);

    // ส่ง response ในรูปแบบที่โปรแกรมต้องการ
    res.json({
      id: user._id,
      username: user.username,
      name: user.username,
      role: user.role,
      team: user.team,
      token: token,
      expiration: expiration,
      message: 'Login successful',
      brandid: 1
    });

  } catch (error) {
    logger.error('Login Program Error:', {
      error: error.message,
      stack: error.stack,
      headers: req.headers,
      body: req.body
    });
    res.status(500).json({ 
      username: '',
      name: '',
      role: '',
      team: '',
      token: '',
      expiration: null,
      message: 'An error occurred during login please try again',
      brandid: null
    });
  }
};