//src/routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

router.post('/record', auth, messageController.recordSend);
router.get('/history/:mid', auth, messageController.getSendHistory);

module.exports = router;