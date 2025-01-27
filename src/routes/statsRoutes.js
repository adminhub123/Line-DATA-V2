const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const auth = require('../middleware/auth');

router.get('/daily', auth, statsController.getDailyStats);
router.get('/range', auth, statsController.getDateRangeStats);
router.get('/user/:userId', auth, statsController.getUserStats);

module.exports = router;