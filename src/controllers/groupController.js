// src/controllers/groupController.js
const logger = require('../utils/logger');

exports.getGroups = async (req, res) => {
   try {
       // Log request
       logger.info('Get groups request:', {
           headers: req.headers,
           query: req.query
       });

       // TODO: Implement get groups logic
       res.json({
           message: 'Get groups successfully',
           data: [] // ส่งข้อมูลกลุ่มกลับไป
       });

   } catch (error) {
       logger.error('Get groups error:', {
           error: {
               message: error.message,
               stack: error.stack
           }
       });
       res.status(500).json({ message: error.message });
   }
};

exports.createGroup = async (req, res) => {
   try {
       // Log incoming request details
       logger.info('Incoming request:', {
           body: req.body,
           headers: req.headers,
           method: req.method,
           path: req.path,
           query: req.query
       });

       // Log specific request data
       logger.info('Create group request received:', {
           body: req.body,
           headers: req.headers,
           path: req.path
       });

       const {
           nameGroup,
           linkGroup,
           numberOfPeople, 
           chatUid,
           listKai,
           status
       } = req.body;

       // Log extracted data
       logger.info('Extracted group data:', {
           nameGroup,
           numberOfPeople,
           chatUid,
           hasListKai: !!listKai,
           status
       });

       // Attempt to save group
       logger.info('Attempting to save group:', {
           record: {
               nameGroup,
               numberOfPeople,
               chatUid,
               status
           }
       });

       res.status(200).json({
           message: 'Group created successfully',
           data: {
               nameGroup,
               linkGroup,
               numberOfPeople,
               chatUid,
               status
           }
       });

   } catch (error) {
       // Log error details
       logger.error('Create group error:', {
           error: {
               message: error.message,
               stack: error.stack,
               name: error.name
           },
           body: req.body
       });

       res.status(500).json({ 
           message: error.message,
           errorType: error.name
       });
   }
};

// เพิ่ม function สำหรับบันทึกประวัติการสร้างกลุ่ม
exports.recordGroupHistory = async (req, res) => {
   try {
       // Log incoming request
       logger.info('Record group history request:', {
           body: req.body,
           headers: req.headers,
           path: req.path
       });

       const {
           nameGroup,
           linkGroup, 
           numberOfPeople,
           chatUid,
           listKai,
           status
       } = req.body;

       // TODO: บันทึกลง database

       logger.info('Group history recorded:', {
           nameGroup,
           numberOfPeople,
           chatUid,
           status
       });

       res.status(201).json({
           message: 'Group history recorded successfully',
           data: {
               nameGroup,
               linkGroup,
               numberOfPeople,
               chatUid,
               status
           }
       });

   } catch (error) {
       logger.error('Record group history error:', {
           error: {
               message: error.message,
               stack: error.stack
           },
           body: req.body
       });

       res.status(500).json({ message: error.message });
   }
};

// เพิ่ม function สำหรับดึงประวัติการสร้างกลุ่ม
exports.getGroupHistory = async (req, res) => {
   try {
       const { userId } = req.params;
       
       logger.info('Get group history request:', {
           userId,
           headers: req.headers
       });

       // TODO: ดึงข้อมูลจาก database

       res.json({
           message: 'Get group history successfully',
           data: [] 
       });

   } catch (error) {
       logger.error('Get group history error:', {
           error: {
               message: error.message,
               stack: error.stack
           },
           userId: req.params.userId
       });

       res.status(500).json({ message: error.message });
   }
};