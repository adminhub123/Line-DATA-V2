// src/controllers/fileController.js
const path = require('path');
const logger = require('../utils/logger');

exports.uploadFile = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      logger.warn('No files were uploaded');
      return res.status(400).json({ message: 'No files were uploaded' });
    }

    const file = req.files.file; // 'file' is the name of the file field in form data
    const uploadDir = path.join(__dirname, '../uploads');

    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Validate file type (only allow .txt)
    if (path.extname(file.name).toLowerCase() !== '.txt') {
      logger.warn('Invalid file type', { filename: file.name });
      return res.status(400).json({ message: 'Only .txt files are allowed' });
    }

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);

    await file.mv(filePath);

    logger.info('File uploaded successfully', {
      originalName: file.name,
      savedAs: fileName,
      size: file.size
    });

    res.json({ 
      message: 'File uploaded successfully',
      fileName: fileName
    });

  } catch (error) {
    logger.error('File upload error:', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ message: 'Error uploading file' });
  }
};