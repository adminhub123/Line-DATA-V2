// src/routes/messageSyncRoutes.js
const express = require('express');
const router = express.Router();
const messageSyncController = require('../controllers/messageSyncController');

// อัปเดตหรือสร้างข้อมูลการซิงค์
router.post('/messageSync', messageSyncController.saveMessageSync);

// ดึงข้อมูลการซิงค์ล่าสุด
router.get('/messageSync', messageSyncController.getMessageSync);

module.exports = router;
