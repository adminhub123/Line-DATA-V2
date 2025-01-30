// src/controllers/groupController.js
const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const auth = require('../middleware/auth');

// รับทั้ง GET และ POST ที่ root path
router.get('/', auth, groupController.getGroups); 
router.post('/', auth, groupController.createGroup); // แก้เป็น root path แทน /create

module.exports = router;