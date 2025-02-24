// src/controllers/machineKeyController.js
const MachineKey = require('../models/MachineKey');
const User = require('../models/User');
const logger = require('../utils/logger');

// ตรวจสอบ key
exports.validateKey = async (req, res) => {
  try {
    const { Username, MachineKey } = req.body;

    logger.info('Validate machine key request:', {
      username: Username,
      keyLength: MachineKey ? MachineKey.length : 0
    });

    if (!Username || !MachineKey) {
      return res.status(400).json({
        IsValid: false,
        Message: 'Username and MachineKey are required',
        Status: 2 // Invalid
      });
    }

    // ตรวจสอบว่ามีผู้ใช้นี้หรือไม่
    const user = await User.findOne({ username: Username });
    if (!user) {
      logger.warn('User not found for key validation:', { username: Username });
      return res.status(404).json({
        IsValid: false,
        Message: 'User not found',
        Status: 5 // NotFound
      });
    }

    // ตรวจสอบว่า MachineKey มีฟังก์ชัน findOne หรือไม่
    if (typeof MachineKey.findOne !== 'function') {
      logger.error('MachineKey model is not properly defined or imported');
      
      // ทดลองโหลดโมเดลอีกครั้ง
      try {
        const mongoose = require('mongoose');
        const machineKeySchema = new mongoose.Schema({
          username: {
            type: String,
            required: true,
            index: true
          },
          machineKey: {
            type: String,
            required: true,
            unique: true
          },
          isActive: {
            type: Boolean,
            default: true
          },
          createdAt: {
            type: Date,
            default: Date.now
          },
          lastUsed: {
            type: Date,
            default: Date.now
          }
        }, {
          timestamps: true
        });

        // ตรวจสอบว่ามีการลงทะเบียนโมเดลนี้ไปแล้วหรือไม่
        let machineKeyModel;
        try {
          machineKeyModel = mongoose.model('MachineKey');
        } catch (e) {
          machineKeyModel = mongoose.model('MachineKey', machineKeySchema);
        }
        
        // ใช้โมเดลที่โหลดใหม่
        const keyRecord = await machineKeyModel.findOne({ 
          username: Username,
          machineKey: MachineKey
        });
        
        if (!keyRecord) {
          // ตรวจสอบว่าผู้ใช้มี key อื่นอยู่แล้วหรือไม่
          const existingKey = await machineKeyModel.findOne({ username: Username });
          
          if (existingKey) {
            logger.warn('User already has another machine key:', { 
              username: Username
            });
            
            return res.status(200).json({
              IsValid: false,
              Message: 'This user already has a registered machine key',
              Status: 4 // AlreadyUsed
            });
          }
          
          // ถ้าไม่มี key ใดๆ - แสดงว่าเป็นการใช้ครั้งแรก
          logger.info('No key found for user - first login:', { username: Username });
          return res.status(200).json({
            IsValid: false,
            Message: 'No key found for this user',
            Status: 5 // NotFound
          });
        }

        // ตรวจสอบว่า key ยังใช้งานได้หรือไม่
        if (!keyRecord.isActive) {
          logger.warn('Machine key is deactivated:', { 
            username: Username
          });
          
          return res.status(200).json({
            IsValid: false,
            Message: 'This machine key has been deactivated',
            Status: 3 // Expired
          });
        }

        // อัพเดทเวลาใช้งานล่าสุด
        keyRecord.lastUsed = new Date();
        await keyRecord.save();

        logger.info('Machine key validated successfully:', { 
          username: Username
        });

        return res.status(200).json({
          IsValid: true,
          Message: 'Key validated successfully',
          Status: 1 // Valid
        });
        
      } catch (err) {
        logger.error('Failed to recreate MachineKey model:', {
          error: err.message,
          stack: err.stack
        });
        
        return res.status(500).json({
          IsValid: false,
          Message: 'Database error with MachineKey model',
          Status: 2 // Invalid
        });
      }
    }

    // ตรวจสอบว่ามี key นี้สำหรับผู้ใช้นี้หรือไม่
    const keyRecord = await MachineKey.findOne({ 
      username: Username,
      machineKey: MachineKey
    });

    // ถ้าไม่พบ key
    if (!keyRecord) {
      // ตรวจสอบว่าผู้ใช้มี key อื่นอยู่แล้วหรือไม่
      const existingKey = await MachineKey.findOne({ username: Username });
      
      if (existingKey) {
        logger.warn('User already has another machine key:', { 
          username: Username,
          existingKey: existingKey.machineKey
        });
        
        return res.status(200).json({
          IsValid: false,
          Message: 'This user already has a registered machine key',
          Status: 4 // AlreadyUsed
        });
      }
      
      // ถ้าไม่มี key ใดๆ - แสดงว่าเป็นการใช้ครั้งแรก
      logger.info('No key found for user - first login:', { username: Username });
      return res.status(200).json({
        IsValid: false,
        Message: 'No key found for this user',
        Status: 5 // NotFound
      });
    }

    // ตรวจสอบว่า key ยังใช้งานได้หรือไม่
    if (!keyRecord.isActive) {
      logger.warn('Machine key is deactivated:', { 
        username: Username,
        key: MachineKey
      });
      
      return res.status(200).json({
        IsValid: false,
        Message: 'This machine key has been deactivated',
        Status: 3 // Expired
      });
    }

    // อัพเดทเวลาใช้งานล่าสุด
    keyRecord.lastUsed = new Date();
    await keyRecord.save();

    logger.info('Machine key validated successfully:', { 
      username: Username,
      key: MachineKey
    });

    return res.status(200).json({
      IsValid: true,
      Message: 'Key validated successfully',
      Status: 1 // Valid
    });

  } catch (error) {
    logger.error('Machine key validation error:', {
      error: error.message,
      stack: error.stack
    });
    
    res.status(500).json({
      IsValid: false,
      Message: 'Error validating machine key',
      Status: 2 // Invalid
    });
  }
};

// ลงทะเบียน key
exports.registerKey = async (req, res) => {
  try {
    const { Username, MachineKey } = req.body;

    logger.info('Register machine key request:', {
      username: Username,
      keyLength: MachineKey ? MachineKey.length : 0
    });

    if (!Username || !MachineKey) {
      return res.status(400).json({
        IsSuccess: false,
        Message: 'Username and MachineKey are required'
      });
    }

    // ตรวจสอบว่ามีผู้ใช้นี้หรือไม่
    const user = await User.findOne({ username: Username });
    if (!user) {
      logger.warn('User not found for key registration:', { username: Username });
      return res.status(404).json({
        IsSuccess: false,
        Message: 'User not found'
      });
    }

    // ตรวจสอบว่า MachineKey มีฟังก์ชัน findOne หรือไม่
    if (typeof MachineKey.findOne !== 'function') {
      logger.error('MachineKey model is not properly defined or imported');
      
      // ทดลองโหลดโมเดลอีกครั้ง
      try {
        const mongoose = require('mongoose');
        const machineKeySchema = new mongoose.Schema({
          username: {
            type: String,
            required: true,
            index: true
          },
          machineKey: {
            type: String,
            required: true,
            unique: true
          },
          isActive: {
            type: Boolean,
            default: true
          },
          createdAt: {
            type: Date,
            default: Date.now
          },
          lastUsed: {
            type: Date,
            default: Date.now
          }
        }, {
          timestamps: true
        });

        // ตรวจสอบว่ามีการลงทะเบียนโมเดลนี้ไปแล้วหรือไม่
        let machineKeyModel;
        try {
          machineKeyModel = mongoose.model('MachineKey');
        } catch (e) {
          machineKeyModel = mongoose.model('MachineKey', machineKeySchema);
        }
        
        // ตรวจสอบว่าผู้ใช้มี key อยู่แล้วหรือไม่
        const existingKey = await machineKeyModel.findOne({ username: Username });
        if (existingKey) {
          logger.warn('User already has a machine key:', { 
            username: Username
          });
          
          return res.status(400).json({
            IsSuccess: false,
            Message: 'This user already has a registered machine key'
          });
        }

        // สร้าง key ใหม่
        const newKey = new machineKeyModel({
          username: Username,
          machineKey: MachineKey,
          isActive: true,
          lastUsed: new Date()
        });

        await newKey.save();

        logger.info('Machine key registered successfully:', { 
          username: Username
        });

        return res.status(201).json({
          IsSuccess: true,
          Message: 'Machine key registered successfully',
          RegisteredKey: MachineKey
        });
        
      } catch (err) {
        logger.error('Failed to recreate MachineKey model:', {
          error: err.message,
          stack: err.stack
        });
        
        return res.status(500).json({
          IsSuccess: false,
          Message: 'Database error with MachineKey model'
        });
      }
    }

    // ตรวจสอบว่าผู้ใช้มี key อยู่แล้วหรือไม่
    const existingKey = await MachineKey.findOne({ username: Username });
    if (existingKey) {
      logger.warn('User already has a machine key:', { 
        username: Username,
        existingKey: existingKey.machineKey
      });
      
      return res.status(400).json({
        IsSuccess: false,
        Message: 'This user already has a registered machine key'
      });
    }

    // สร้าง key ใหม่
    const newKey = new MachineKey({
      username: Username,
      machineKey: MachineKey,
      isActive: true,
      lastUsed: new Date()
    });

    await newKey.save();

    logger.info('Machine key registered successfully:', { 
      username: Username,
      key: MachineKey
    });

    return res.status(201).json({
      IsSuccess: true,
      Message: 'Machine key registered successfully',
      RegisteredKey: MachineKey
    });

  } catch (error) {
    logger.error('Machine key registration error:', {
      error: error.message,
      stack: error.stack
    });
    
    res.status(500).json({
      IsSuccess: false,
      Message: 'Error registering machine key'
    });
  }
};