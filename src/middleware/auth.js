const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const auth = async (req, res, next) => {
  try {
    // ลอง log ดู header ที่ส่งมา
    logger.info('Auth headers:', req.headers);

    // รับ token จาก header แบบ PocketBase format
    const token = req.header('Authorization')?.replace('Bearer ', '') || 
                 req.cookies?.token || 
                 req.query?.token;
    
    if (!token) {
      logger.warn('No token provided');
      return res.status(401).json({
        code: 401,
        message: 'Authentication is required to access this endpoint',
        data: {}
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.userId;
      req.token = token;

      // Log successful auth
      logger.info('Auth successful:', {
        userId: req.userId,
        path: req.path
      });

      next();
    } catch (error) {
      logger.error('Token verification failed:', error);
      return res.status(401).json({
        code: 401,
        message: 'Invalid or expired token',
        data: {}
      });
    }

  } catch (error) {
    logger.error('Auth middleware error:', {
      error: error.message,
      stack: error.stack
    });
    res.status(401).json({
      code: 401,
      message: 'Authentication failed',
      data: {}
    });
  }
};

module.exports = auth;