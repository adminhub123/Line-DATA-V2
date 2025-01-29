// controllers/collectionController.js
const Collection = require('../models/Collection');
const logger = require('../utils/logger');

exports.getCollections = async (req, res) => {
  try {
    const collections = await Collection.find()
      .sort({ createdAt: -1 });

    logger.info('Retrieved collections');
    res.json(collections);
    
  } catch (error) {
    logger.error('Get collections error:', {
      error: error.message,
      stack: error.stack 
    });
    res.status(500).json({ message: error.message });
  }
};

exports.getCollectionByType = async (req, res) => {
  try {
    const { type } = req.params;
    const collection = await Collection.find({ type });

    res.json(collection);

  } catch (error) {
    logger.error('Get collection by type error:', {
      error: error.message,
      stack: error.stack,
      type: req.params.type 
    });
    res.status(500).json({ message: error.message });
  }
};