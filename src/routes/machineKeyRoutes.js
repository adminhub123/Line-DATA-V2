// src/routes/machineKeyRoutes.js
const express = require('express');
const router = express.Router();
const machineKeyController = require('../controllers/machineKeyController');

router.post('/validate-key', machineKeyController.validateKey);
router.post('/register-key', machineKeyController.registerKey);

module.exports = router;