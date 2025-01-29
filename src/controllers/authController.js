//src/controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

const validateLoginInput = (username, password) => {  
 if (!username || !password) {
   return 'Username and password are required';
 }
 if (typeof username !== 'string' || typeof password !== 'string') {
   return 'Invalid username or password format'; 
 }
 return null;
};

// Login สำหรับเว็บ
exports.login = async (req, res) => {
 try {
   logger.info('Web login request:', {
     body: req.body,
     headers: req.headers,
     ip: req.ip
   });

   const username = req.body.username || req.body.userName;
   const { password } = req.body;
   
   const validationError = validateLoginInput(username, password);
   if (validationError) {
     logger.warn('Web login validation failed:', {
       error: validationError,
       username
     });
     return res.status(400).json({
       message: validationError,
       username: '',
       role: '',
       team: '',
       token: '',
       expiration: null,
       name: ''
     });
   }

   // Find user with isWebAdmin true
   const user = await User.findOne({ username, isWebAdmin: true });
   if (!user) {
     logger.warn('Web login failed - user not found:', { username });
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
     logger.warn('Web login failed - invalid password:', { username });
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

   // ใช้เวลาที่เหลือจนถึงวันหมดอายุจริง
   const token = jwt.sign(
     { userId: user._id },
     process.env.JWT_SECRET,
     { 
       expiresIn: Math.floor((user.expiration - new Date()) / 1000)
     }
   );

   // ใช้ expiration จากฐานข้อมูล
   const expiration = user.expiration;

   // Update last login
   user.lastLogin = new Date();
   await user.save();

   logger.info('Web login successful:', {
     username,
     role: user.role,
     team: user.team,
     expiration: expiration
   });

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
   logger.error('Web login error:', {
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

// Login สำหรับโปรแกรม
exports.loginProgram = async (req, res) => {
 try {
   logger.info('Program login request:', {
     body: req.body,
     headers: req.headers,
     ip: req.ip
   });

   const username = req.body.username || req.body.userName;
   const { password, hwid } = req.body;

   logger.info('Program login fields:', {
     receivedFields: Object.keys(req.body),
     username: username,
     hasPassword: !!password,
     hwid: hwid || 'not provided',
     unexpectedFields: Object.keys(req.body).filter(key => 
       !['username', 'userName', 'password', 'hwid'].includes(key)
     )
   });

   const validationError = validateLoginInput(username, password);
   if (validationError) {
     logger.warn('Program login validation failed:', {
       error: validationError,
       username
     });
     return res.status(401).json({
       message: 'Invalid username, password, or hwid',
       username: '',
       role: '',
       team: '',
       token: '',
       expiration: null,
       name: ''
     });
   }

   const user = await User.findOne({ username });
   if (!user) {
     logger.warn('Program login failed - user not found:', { username });
     return res.status(401).json({ 
       message: 'Invalid username, password, or hwid',
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
     logger.warn('Program login failed - invalid password:', { username });
     return res.status(401).json({ 
       message: 'Invalid username, password, or hwid',
       username: '',
       role: '',
       team: '',
       token: '',
       expiration: null,
       name: ''
     });
   }

   // ใช้เวลาที่เหลือจนถึงวันหมดอายุจริง
   const token = jwt.sign(
     { userId: user._id },
     process.env.JWT_SECRET,
     { 
       expiresIn: Math.floor((user.expiration - new Date()) / 1000)
     }
   );

   // ใช้ expiration จากฐานข้อมูล
   const expiration = user.expiration;

   // Update last login
   user.lastLogin = new Date();
   await user.save();

   logger.info('Program login successful:', {
     username,
     role: user.role,
     team: user.team,
     hwid: hwid || 'not provided',
     expiration: expiration
   });

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
   logger.error('Program login error:', {
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