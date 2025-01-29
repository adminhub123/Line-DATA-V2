// controllers/fileDataController.js
const File = require('../models/File');
const logger = require('../utils/logger');

exports.getFileRecords = async (req, res) => {
  try {
    const files = await File.find()
      .sort({ createdAt: -1 });

    logger.info('Retrieved file records');
    res.json(files);

  } catch (error) {
    logger.error('Get file records error:', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ message: error.message });
  }
};

exports.getFileById = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.json(file);

  } catch (error) {
    logger.error('Get file by id error:', {
      error: error.message,
      stack: error.stack,
      fileId: req.params.id
    });
    res.status(500).json({ message: error.message });
  }
};