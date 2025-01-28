const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const auth = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.use(auth);

// Upload file
router.post('/upload', upload.single('file'), fileController.uploadFile);

// Get all files
router.get('/', fileController.getFiles);

// Update download count
router.put('/:id/download', fileController.updateFileDownloadCount);

module.exports = router;