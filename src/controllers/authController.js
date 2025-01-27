const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger'); // เพิ่มบรรทัดนี้

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
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

    // Check password
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

    logger.info(`User logged in successfully: ${username}`);

    // Send response ตรงตามที่โปรแกรมต้องการ
    res.json({
      username: user.username,
      name: user.username, // เพิ่ม name field
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

exports.loginProgram = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      logger.warn(`Program login attempt failed: User not found - ${username}`);
      return res.status(401).json({ 
        status: false,
        message: 'Authentication failed: User not found'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.warn(`Program login attempt failed: Invalid password - ${username}`);
      return res.status(401).json({ 
        status: false,
        message: 'Authentication failed: Invalid password'
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
      status: true,
      message: "Login Success",
      data: {
        username: user.username,
        name: user.username,
        role: user.role,
        team: user.team,
        token: token,
        expiration: expiration
      }
    });

  } catch (error) {
    logger.error('Program login error', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      status: false,
      message: 'An error occurred during login please try again'
    });
  }
};