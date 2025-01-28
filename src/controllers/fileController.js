const FileData = require('../models/FileData');
const logger = require('../utils/logger');
const multer = require('multer');
const path = require('path');

// กำหนดที่เก็บไฟล์
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

exports.uploadFile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileData = new FileData({
      NameFile: file.originalname,
      UrlDownload: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
      UpdatedBy: req.body.username || 'unknown'
    });

    await fileData.save();
    
    logger.info('File uploaded:', {
      filename: file.originalname,
      uploadedBy: req.body.username
    });

    res.status(201).json(fileData);

  } catch (error) {
    logger.error('File upload error:', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ message: 'Error uploading file' });
  }
};

exports.getFiles = async (req, res) => {
  try {
    const files = await FileData.find().sort({ Created: -1 });
    res.json(files);
  } catch (error) {
    logger.error('Get files error:', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ message: 'Error getting files' });
  }
};

exports.updateFileDownloadCount = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await FileData.findById(id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    file.CountDownload += 1;
    await file.save();

    res.json(file);
  } catch (error) {
    logger.error('Update download count error:', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ message: 'Error updating download count' });
  }
};