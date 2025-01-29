// src/controllers/adminController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

exports.authWithPassword = async (req, res) => {
  try {
    logger.info('Admin login attempt:', {
      username: req.body.username,
      path: req.path
    });

    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      logger.warn('Admin auth - missing credentials');
      return res.status(400).json({
        status: 'error',
        message: 'Username and password are required'
      });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      logger.warn('Admin auth - user not found:', { username });
      return res.status(401).json({
        status: 'error', 
        message: 'Authentication failed'
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.warn('Admin auth - invalid password:', { username });
      return res.status(401).json({
        status: 'error',
        message: 'Authentication failed'
      }); 
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: Math.floor((user.expiration - new Date()) / 1000) }
    );

    logger.info('Admin auth successful:', {
      username: user.username,
      role: user.role
    });

    res.json({
      status: 'success',
      token,
      user: {
        username: user.username,
        role: user.role,
        team: user.team,
        expiration: user.expiration
      }
    });

  } catch(error) {
    logger.error('Admin auth error:', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};