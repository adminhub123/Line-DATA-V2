const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// เพิ่ม route นี้
router.post('/login/program', authController.loginProgram);

// routes อื่นๆ
router.post('/login', authController.login);

module.exports = router;