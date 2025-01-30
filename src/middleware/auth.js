// src/middleware/auth.js 
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const auth = async (req, res, next) => {
  try {
      const authHeader = req.header('Authorization');
      
      logger.info('Auth check:', {
          authHeader,
          path: req.path,
          method: req.method
      });

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
          logger.warn('Invalid auth header format', {
              path: req.path,
              authHeader
          });
          return res.status(401).json({ 
              message: 'Authorization header must start with Bearer' 
          });
      }

      const token = authHeader.slice(7); // ตัด "Bearer " ออก
      if (!token) {
          logger.warn('Empty token', {
              path: req.path,
              authHeader 
          });
          return res.status(401).json({ message: 'Token is required' });
      }

      try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.userId = decoded.userId;

          logger.info('Auth successful:', {
              userId: decoded.userId,
              path: req.path
          });

          next();
      } catch (tokenError) {
          logger.error('Token verification failed:', {
              error: tokenError.message,
              path: req.path
          });
          res.status(401).json({ message: 'Invalid token' });
      }
      
  } catch (error) {
      logger.error('Auth middleware error:', {
          error: error.message,
          stack: error.stack,
          path: req.path
      });
      res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = auth;