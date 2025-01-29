//src/routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const auth = require('../middleware/auth');

router.post('/bulk', auth, contactController.createContacts);
router.get('/:userId/:targetUserMid', auth, contactController.getContact);
router.put('/:userId/:targetUserMid', auth, contactController.updateContact);
router.delete('/:userId/:targetUserMid', auth, contactController.deleteContact);
router.get('/:userId', auth, contactController.getAllContacts);

module.exports = router;