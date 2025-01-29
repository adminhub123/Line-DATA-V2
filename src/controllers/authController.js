const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

// Login สำหรับเว็บ
exports.login = async (req, res) => {
 try {
   logger.info('Web login request:', {
     body: req.body,
     headers: req.headers,
     ip: req.ip
   });

   const { username, password } = req.body;

   // Find user
   const user = await User.findOne({ username, isWebAdmin: true });
   if (!user) {
     logger.warn('Web login failed - user not found:', { username });
     return res.status(401).json({
       code: 401,
       message: 'Authentication failed: User not found',
       data: {}
     });
   }

   // Check password
   const isMatch = await user.comparePassword(password);
   if (!isMatch) {
     logger.warn('Web login failed - invalid password:', { username });
     return res.status(401).json({
       code: 401,
       message: 'Authentication failed: Invalid password',
       data: {}
     });
   }

   // ใช้เวลาที่เหลือจนถึงวันหมดอายุจริง
   const token = jwt.sign(
     { userId: user._id },
     process.env.JWT_SECRET,
     { expiresIn: Math.floor((user.expiration - new Date()) / 1000) }
   );

   // Update last login
   user.lastLogin = new Date();
   await user.save();

   logger.info('Web login successful:', {
     username,
     role: user.role,
     team: user.team,
     expiration: user.expiration
   });

   res.json({
     token: token,
     user: {
       id: user._id,
       username: user.username,
       role: user.role,
       team: user.team,
       expiration: user.expiration
     }
   });

 } catch (error) {
   logger.error('Web login error:', {
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

// Login สำหรับโปรแกรม
exports.loginProgram = async (req, res) => {
 try {
   const { username, password } = req.body;
   logger.info('Program login request:', { username });

   // Find user
   const user = await User.findOne({ username });
   if (!user) {
     logger.warn('Program login failed - user not found:', { username });
     return res.status(401).json({
       code: 401,
       message: 'Invalid username or password',
       data: {
         token: '',
         user: null
       }
     });
   }

   // Check password
   const isMatch = await user.comparePassword(password);
   if (!isMatch) {
     logger.warn('Program login failed - invalid password:', { username });
     return res.status(401).json({
       code: 401,
       message: 'Invalid username or password',
       data: {
         token: '',
         user: null
       }
     });
   }

   // Generate PocketBase style token
   const token = jwt.sign(
     { 
       userId: user._id,
       type: 'authRecord',
       collectionId: 'users',
       collectionName: 'users'
     },
     process.env.JWT_SECRET,
     { 
       expiresIn: Math.floor((user.expiration - new Date()) / 1000) 
     }
   );

   // Update last login
   user.lastLogin = new Date();
   await user.save();

   // Log success
   logger.info('Program login successful:', {
     username: user.username,
     role: user.role,
     team: user.team,
     expiration: user.expiration
   });

   // Return PocketBase style response
   res.json({
     code: 200,
     message: '',
     data: {
       token: token,
       record: {
         id: user._id,
         collectionId: 'users',
         collectionName: 'users', 
         username: user.username,
         verified: true,
         emailVisibility: true,
         created: user.createdAt,
         updated: user.updatedAt,
         role: user.role,
         team: user.team,
         expiration: user.expiration
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
     data: {
       token: '',
       user: null
     }
   });
 }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
 try {
   const user = await User.findById(req.userId).select('-password');
   if (!user) {
     return res.status(404).json({
       code: 404,
       message: 'User not found',
       data: null
     });
   }

   res.json({
     code: 200,
     message: '',
     data: {
       id: user._id,
       username: user.username,
       role: user.role,
       team: user.team,
       expiration: user.expiration,
       lastLogin: user.lastLogin
     }
   });
 } catch (error) {
   logger.error('Get current user error:', error);
   res.status(500).json({
     code: 500,
     message: 'Error getting user data',
     data: null  
   });
 }
};

// Refresh token
exports.refreshToken = async (req, res) => {
 try {
   const user = await User.findById(req.userId);
   if (!user) {
     return res.status(404).json({
       code: 404,
       message: 'User not found',
       data: null
     });
   }

   // Generate new token
   const token = jwt.sign(
     { userId: user._id },
     process.env.JWT_SECRET,  
     { expiresIn: Math.floor((user.expiration - new Date()) / 1000) }
   );

   res.json({
     code: 200,
     message: '',
     data: {
       token: token,
       user: {
         id: user._id,
         username: user.username,
         role: user.role,
         team: user.team,
         expiration: user.expiration
       }
     }
   });

 } catch (error) {
   logger.error('Token refresh error:', error);
   res.status(500).json({
     code: 500,
     message: 'Error refreshing token',
     data: null
   });
 }
};

// Logout
exports.logout = async (req, res) => {
 try {
   // Clear token cookie if exists
   res.clearCookie('token');
   
   res.json({
     code: 200,
     message: 'Logged out successfully',
     data: null
   });
 } catch (error) {
   logger.error('Logout error:', error);
   res.status(500).json({
     code: 500,
     message: 'Error logging out',
     data: null
   }); 
 }
};

module.exports = exports;