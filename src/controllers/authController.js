const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    logger.info('Login attempt:', { username });

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      logger.warn('Login failed - user not found:', { username });
      return res.status(401).json({
        code: 401,
        message: 'Authentication failed: User not found',
        data: {}
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.warn('Login failed - invalid password:', { username });
      return res.status(401).json({
        code: 401,
        message: 'Authentication failed: Invalid password',
        data: {}
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Generated token:', token); // Debug log

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    logger.info('Login successful:', { username, role: user.role });

    res.json({
      code: 200,
      message: "",
      data: {
        token,
        user: {
          username: user.username,
          role: user.role,
          team: user.team,
          expiration: user.expiration
        }
      }
    });

  } catch (error) {
    logger.error('Login error:', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({
      code: 500,
      message: 'Internal server error',
      data: {}
    });
  }
};

// Program login (สำหรับโปรแกรม)
exports.loginProgram = async (req, res) => {
  try {
    const { username, password } = req.body;

    logger.info('Program login attempt:', { username });

    // Generate token for program
    const token = jwt.sign(
      { 
        userId: 'program-user',
        type: 'program'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Generated program token:', token); // Debug log

    res.json({
      code: 200,
      message: "",
      data: {
        token,
        user: {
          username,
          role: 'program',
          team: 'program',
          expiration: new Date(Date.now() + 24*60*60*1000)
        }
      }
    });

  } catch (error) {
    logger.error('Program login error:', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({
      code: 500,
      message: 'Internal server error',
      data: {}
    });
  }
};

// Admin auth
exports.adminAuth = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Generate admin token
    const token = jwt.sign(
      { 
        userId: 'admin',
        type: 'admin'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Generated admin token:', token); // Debug log

    res.json({
      code: 200,
      message: "",
      data: {
        token,
        admin: {
          id: "admin",
          username,
          email: "admin@example.com"
        }
      }
    });

  } catch (error) {
    logger.error('Admin auth error:', error);
    res.status(401).json({
      code: 401,
      message: "Authentication failed",
      data: {}
    });
  }
};