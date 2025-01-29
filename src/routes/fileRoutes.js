const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const auth = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.use(auth);

// เพิ่ม route นี้
router.get('/collections/getFileData/records', fileController.getFileDataRecords);

router.post('/upload', upload.single('file'), fileController.uploadFile);
router.get('/', fileController.getFiles);
router.put('/:id/download', fileController.updateFileDownloadCount);

module.exports = router;