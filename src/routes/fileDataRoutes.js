// src/routes/fileDataRoutes.js
const express = require('express');
const router = express.Router();
const fileDataController = require('../controllers/fileDataController');
const auth = require('../middleware/auth');

router.get('/collections/GetFileData/records', auth, fileDataController.getFileRecords);
router.get('/collections/GetFileData/records/:id', auth, fileDataController.getFileById);

module.exports = router;