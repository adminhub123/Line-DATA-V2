const FileData = require('../models/FileData');
const logger = require('../utils/logger');

// Get all records
exports.getRecords = async (req, res) => {
  try {
    const records = await FileData.find();
    
    res.json({
      code: 200,
      message: "",
      data: {
        page: 1,
        perPage: 30,
        totalItems: records.length,
        totalPages: 1,
        items: records.map(record => ({
          id: record._id,
          collectionId: "GetFileData",
          collectionName: "GetFileData", 
          created: record.createdAt,
          updated: record.updatedAt,
          nameFile: record.nameFile,
          urlDownload: record.urlDownload,
          countDownload: record.countDownload
        }))
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
};

// Get single record
exports.getRecord = async (req, res) => {
  try {
    const record = await FileData.findById(req.params.id);
    if (!record) {
      return res.status(404).json({
        code: 404,
        message: "Record not found",
        data: {}
      });
    }
    
    res.json({
      code: 200,
      message: "",
      data: {
        id: record._id,
        collectionId: "GetFileData",
        collectionName: "GetFileData",
        created: record.createdAt,
        updated: record.updatedAt,
        nameFile: record.nameFile,
        urlDownload: record.urlDownload,
        countDownload: record.countDownload
      }
    });
  } catch (error) {
    logger.error('Get FileData record error:', error);
    res.status(500).json({
      code: 500, 
      message: error.message,
      data: {}
    });
  }
};

// Create record
exports.createRecord = async (req, res) => {
  try {
    const { nameFile, urlDownload } = req.body;
    
    const record = new FileData({
      nameFile,
      urlDownload,
      countDownload: 0
    });
    
    await record.save();
    
    res.status(201).json({
      code: 201,
      message: "",
      data: {
        id: record._id,
        collectionId: "GetFileData",
        collectionName: "GetFileData",
        created: record.createdAt,
        updated: record.updatedAt,
        nameFile: record.nameFile,
        urlDownload: record.urlDownload,
        countDownload: record.countDownload
      }
    });
  } catch (error) {
    logger.error('Create FileData record error:', error);
    res.status(500).json({
      code: 500,
      message: error.message,
      data: {}  
    });
  }
};

// Update record
exports.updateRecord = async (req, res) => {
  try {
    const record = await FileData.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!record) {
      return res.status(404).json({
        code: 404,
        message: "Record not found",
        data: {}
      });
    }
    
    res.json({
      code: 200,
      message: "",
      data: {
        id: record._id,
        collectionId: "GetFileData", 
        collectionName: "GetFileData",
        created: record.createdAt,
        updated: record.updatedAt,
        nameFile: record.nameFile,
        urlDownload: record.urlDownload,
        countDownload: record.countDownload
      }
    });
  } catch (error) {
    logger.error('Update FileData record error:', error);
    res.status(500).json({
      code: 500,
      message: error.message,
      data: {}
    });
  }
};

// Delete record
exports.deleteRecord = async (req, res) => {
  try {
    const record = await FileData.findByIdAndDelete(req.params.id);
    
    if (!record) {
      return res.status(404).json({
        code: 404,
        message: "Record not found",
        data: {}
      }); 
    }
    
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
};