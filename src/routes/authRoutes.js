const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/login/program', authController.loginProgram);
router.post('/admin-auth', authController.adminAuth);

module.exports = router;