// src/routes/registerRoutes.js
const express = require('express');
const router = express.Router(); 
const registerController = require('../controllers/registerController');
const auth = require('../middleware/auth');

// ใช้ POST / แทน /record เพราะเป็น root path จาก /api/HistoryRegister แล้ว
router.post('/', auth, registerController.recordRegister);

// Export router
module.exports = router;