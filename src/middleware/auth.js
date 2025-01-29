const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const auth = async (req, res, next) => {
  try {
    logger.info('Incoming request:', {
      method: req.method,
      path: req.path,
      headers: req.headers,
      query: req.query,
      body: req.body
    });

    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('Auth failed - invalid auth header:', {
        authHeader,
        path: req.path
      });
      return res.status(401).json({ 
        code: 401,
        message: 'Invalid authorization header format. Expected: Bearer <token>',
        data: {}
      });
    }

    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) {
      logger.warn('Auth failed - empty token');
      return res.status(401).json({ 
        code: 401,
        message: 'Token is required',
        data: {}
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    logger.error('Auth middleware error:', {
      error: error.message,
      stack: error.stack,
      headers: req.headers
    });
    res.status(401).json({ 
      code: 401,
      message: error.message || 'Authentication failed',
      data: {}
    });
  }
};

module.exports = auth;