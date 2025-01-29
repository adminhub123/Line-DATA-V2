// src/routes/fileDataRoutes.js
const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController');
const auth = require('../middleware/auth');

router.get('/collections', auth, collectionController.getCollections);
router.get('/collections/:type', auth, collectionController.getCollectionByType);

module.exports = router;