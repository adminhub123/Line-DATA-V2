//src/routes/friendRoutes.js
const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');
const auth = require('../middleware/auth');

router.post('/record', auth, friendController.recordFriendAction);
router.get('/history/:mid', auth, friendController.getFriendHistory);

module.exports = router;