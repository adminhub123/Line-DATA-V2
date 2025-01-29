// src/routes/adminRoutes.js
const express = require('express');
const router = express.Router(); 
const adminController = require('../controllers/adminController');
const { authLimiter } = require('../middleware/rateLimiter');

// Match endpoint path กับที่ client เรียก
router.post('/auth-with-password', authLimiter, adminController.authWithPassword);

module.exports = router;