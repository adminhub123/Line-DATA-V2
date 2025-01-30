const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const auth = require('../middleware/auth');

// Root path จะใช้ GET
router.get('/', auth, groupController.getGroups);
// เพิ่ม route อื่นๆ
router.post('/', auth, groupController.createGroup);
router.get('/history/:userId', auth, groupController.getGroupHistory);
router.post('/history', auth, groupController.recordGroupHistory);

module.exports = router;