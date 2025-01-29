//src/utils/logger.js
const winston = require('winston');
const path = require('path');

// กำหนด format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// สร้าง logger
const logger = winston.createLogger({
  format: logFormat,
  transports: [
    // บันทึก error ลงไฟล์
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/error.log'),
      level: 'error'
    }),
    // บันทึก info ลงไฟล์
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/combined.log')
    }),
    // แสดงใน console เมื่อ development
    ...(process.env.NODE_ENV !== 'production' ? [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      })
    ] : [])
  ]
});

module.exports = logger;