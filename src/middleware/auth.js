const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const auth = async (req, res, next) => {
  try {
    // ดึง token จาก header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      logger.warn('No token provided');
      return res.status(401).json({ 
        code: 401,
        message: 'Authentication failed', 
        data: {}
      });
    }

    try {
      // ตรวจสอบ token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.userId;
      next();
    } catch (error) {
      logger.error('Token verification failed:', error);
      return res.status(401).json({
        code: 401,
        message: 'Authentication failed',
        data: {}
      });
    }

  } catch (error) {
    logger.error('Auth middleware error:', error);
    res.status(401).json({
      code: 401,
      message: 'Authentication failed',
      data: {}
    });
  }
};

module.exports = auth;