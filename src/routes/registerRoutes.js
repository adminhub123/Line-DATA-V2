const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');
const auth = require('../middleware/auth');

router.post('/', auth, registerController.recordRegister);
router.get('/:userId', auth, registerController.getRegisterHistory);

module.exports = router;