const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

// เพิ่มฟังก์ชั่นนี้ที่ต้น file
const validateLoginInput = (username, password) => {  
 if (!username || !password) {
   return 'Username and password are required';
 }
 if (typeof username !== 'string' || typeof password !== 'string') {
   return 'Invalid username or password format'; 
 }
 return null;
};

exports.login = async (req, res) => {
 try {
   const { username, password } = req.body;
   
   const validationError = validateLoginInput(username, password);
   if (validationError) {
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
   const { username, password, hwid } = req.body;

   const validationError = validateLoginInput(username, password);
   if (validationError) {
     return res.status(401).json({
       status: false,
       message: 'Invalid username, password, or hwid'
     });
   }

   // Find user
   const user = await User.findOne({ username });
   if (!user) {
     logger.warn(`Program login attempt failed: User not found - ${username}`);
     return res.status(401).json({ 
       status: false,
       message: 'Invalid username, password, or hwid'
     });
   }

   // Check password
   const isMatch = await user.comparePassword(password);
   if (!isMatch) {
     logger.warn(`Program login attempt failed: Invalid password - ${username}`);
     return res.status(401).json({ 
       status: false,
       message: 'Invalid username, password, or hwid'
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
     message: 'Invalid username, password, or hwid'
   });
 }
};