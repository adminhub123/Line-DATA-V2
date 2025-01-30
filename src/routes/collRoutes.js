const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collController');
const auth = require('../middleware/auth');

// CreateGroupConfig collection routes
router.get('/collections/CreateGroupConfig/records', auth, collectionController.getCreateGroupConfig);
router.post('/collections/CreateGroupConfig/records', auth, collectionController.createCreateGroupConfig); 

module.exports = router;