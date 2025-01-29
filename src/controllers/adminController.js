// src/controllers/adminController.js
const jwt = require('jsonwebtoken'); 
const User = require('../models/User');
const logger = require('../utils/logger');

exports.authWithPassword = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      logger.warn('Admin auth attempt missing credentials');
      return res.status(400).json({
        message: 'Username and password are required'
      });
    }

    // Find admin user
    const user = await User.findOne({ 
      username,
      role: { $in: ['admin', 'superadmin'] }  // Check for admin roles
    });

    if (!user) {
      logger.warn('Admin auth failed - user not found:', { username });
      return res.status(401).json({
        message: 'Authentication failed'
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.warn('Admin auth failed - invalid password:', { username });
      return res.status(401).json({
        message: 'Authentication failed' 
      });
    }

    // Create token that expires when user expires
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: Math.floor((user.expiration - new Date()) / 1000) }
    );

    logger.info('Admin auth successful:', {
      username,
      role: user.role,
      team: user.team
    });

    res.json({
      username: user.username,
      role: user.role, 
      team: user.team,
      token: token,
      expiration: user.expiration,
      message: 'Login successful'
    });

  } catch (error) {
    logger.error('Admin auth error:', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};