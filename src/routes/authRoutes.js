const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateLogin } = require('../middleware/validator');

// Route สำหรับ web login
router.post('/login', validateLogin, authController.login);

// Route สำหรับ program login
router.post('/login/program', validateLogin, authController.loginProgram);

module.exports = router;