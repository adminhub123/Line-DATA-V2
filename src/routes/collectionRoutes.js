const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

// Get all collections
router.get('/', async (req, res) => {
  try {
    res.json({
      code: 200,
      message: "",
      data: [
        {
          id: "users",
          name: "users",
          type: "base",
        },
        {
          id: "messages",
          name: "messages", 
          type: "base",
        },
        {
          id: "GetFileData",
          name: "GetFileData",
          type: "base"
        }
      ]
    });
  } catch (error) {
    logger.error('Get collections error:', error);
    res.status(500).json({
      code: 500,
      message: error.message,
      data: []
    });
  }
});

// Get records from GetFileData collection
router.get('/GetFileData/records', async (req, res) => {
  try {
    res.json({
      code: 200,
      message: "",
      data: {
        page: 1,
        perPage: 30,
        totalItems: 0,
        totalPages: 0,
        items: [] // ส่ง empty array เพื่อให้โปรแกรมทำงานต่อได้
      }
    });
  } catch (error) {
    logger.error('Get FileData records error:', error);
    res.status(500).json({
      code: 500,
      message: error.message,
      data: {
        items: []
      }
    });
  }
});

// Get single record from GetFileData collection
router.get('/GetFileData/records/:id', async (req, res) => {
  try {
    res.json({
      code: 200,
      message: "",
      data: {
        id: req.params.id,
        collectionId: "GetFileData",
        collectionName: "GetFileData",
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        nameFile: "example.txt",
        urlDownload: "https://example.com/file.txt",
        countDownload: 0
      }
    });
  } catch (error) {
    logger.error('Get FileData record error:', error);
    res.status(404).json({
      code: 404,
      message: "Record not found",
      data: {}
    });
  }
});

// Create record in GetFileData collection
router.post('/GetFileData/records', async (req, res) => {
  try {
    const record = {
      id: Date.now().toString(),
      collectionId: "GetFileData",
      collectionName: "GetFileData",
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      ...req.body
    };

    res.status(201).json({
      code: 201,
      message: "",
      data: record
    });
  } catch (error) {
    logger.error('Create FileData record error:', error);
    res.status(500).json({
      code: 500,
      message: error.message,
      data: {}
    });
  }
});

// Update record in GetFileData collection
router.patch('/GetFileData/records/:id', async (req, res) => {
  try {
    const record = {
      id: req.params.id,
      collectionId: "GetFileData",
      collectionName: "GetFileData",
      updated: new Date().toISOString(),
      ...req.body
    };

    res.json({
      code: 200,
      message: "",
      data: record
    });
  } catch (error) {
    logger.error('Update FileData record error:', error);
    res.status(500).json({
      code: 500,
      message: error.message,
      data: {}
    });
  }
});

// Delete record from GetFileData collection
router.delete('/GetFileData/records/:id', async (req, res) => {
  try {
    res.json({
      code: 200,
      message: "",
      data: {}
    });
  } catch (error) {
    logger.error('Delete FileData record error:', error);
    res.status(500).json({
      code: 500,
      message: error.message,
      data: {}
    });
  }
});

module.exports = router;