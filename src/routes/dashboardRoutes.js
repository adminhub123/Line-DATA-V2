const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

// ต้อง login ก่อนถึงจะใช้ได้
router.use(auth);

router.get('/summary', dashboardController.getDashboardSummary);
router.get('/history', dashboardController.getHistory);
router.post('/history', dashboardController.createHistory);

module.exports = router;