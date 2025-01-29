// src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/auth-with-password', authLimiter, adminController.authWithPassword);

module.exports = router;