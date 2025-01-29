// src/routes/fileRoutes.js
const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const auth = require('../middleware/auth');

router.post('/upload', auth, fileController.uploadFile);

module.exports = router;