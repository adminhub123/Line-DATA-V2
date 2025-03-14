// src/controllers/messageSyncController.js
const MessageSync = require('../models/MessageSync');
const logger = require('../utils/logger');

exports.saveMessageSync = async (req, res) => {
  try {
    const { Username, Team, SyncTime, Messages } = req.body;

    logger.info('Message sync request received:', {
      username: Username,
      team: Team,
      messageCount: Messages?.length || 0
    });

    // ค้นหาและอัปเดตข้อมูลเดิม หรือสร้างใหม่ถ้าไม่มี (upsert)
    const result = await MessageSync.findOneAndUpdate(
      { username: Username },
      {
        $set: {
          team: Team,
          lastSyncTime: SyncTime || new Date(),
          messages: Messages || [],
          messageCount: Messages?.length || 0
        }
      },
      { 
        new: true,      // return the updated document
        upsert: true,   // create if not exists
        setDefaultsOnInsert: true
      }
    );

    logger.info('Message sync updated successfully:', {
      id: result._id,
      username: Username,
      messageCount: Messages?.length || 0
    });

    res.status(200).json({
      status: 'success',
      message: 'Message sync updated successfully',
      data: {
        id: result._id,
        lastSyncTime: result.lastSyncTime,
        messageCount: result.messageCount,
        isNewRecord: result.createdAt.getTime() === result.updatedAt.getTime()
      }
    });
  } catch (error) {
    logger.error('Message sync error:', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      status: 'error',
      message: error.message || 'Error updating message sync data'
    });
  }
};

exports.getMessageSync = async (req, res) => {
  try {
    const { username } = req.query;
    
    if (!username) {
      return res.status(400).json({
        status: 'error',
        message: 'Username parameter is required'
      });
    }
    
    const messageSync = await MessageSync.findOne({ username });
    
    if (!messageSync) {
      return res.status(404).json({
        status: 'error',
        message: 'No message sync data found for this user'
      });
    }
    
    res.json({
      status: 'success',
      data: messageSync
    });
  } catch (error) {
    logger.error('Get message sync error:', {
      error: error.message,
      stack: error.stack
    });
    
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error fetching message sync data'
    });
  }
};