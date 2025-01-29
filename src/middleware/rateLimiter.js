//src/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

// Rate limiter สำหรับ auth routes - เพิ่มจำนวนครั้งและเวลา
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 นาที
    max: 100, // เพิ่มจาก 5 เป็น 100 ครั้งต่อ IP
    message: 'Too many login attempts, please try again after 15 minutes',
    handler: (req, res) => {
        logger.warn('Rate limit exceeded for auth', {
            ip: req.ip,
            path: req.path
        });
        res.status(429).json({
            message: 'Too many login attempts, please try again after 15 minutes'
        });
    }
});

// Rate limiter สำหรับ API ทั่วไป - เพิ่มจำนวนครั้ง
const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 นาที
    max: 200, // เพิ่มจาก 100 เป็น 200 requests ต่อนาทีต่อ IP
    message: 'Too many requests, please try again after a minute',
    handler: (req, res) => {
        logger.warn('Rate limit exceeded for API', {
            ip: req.ip,
            path: req.path
        });
        res.status(429).json({
            message: 'Too many requests, please try again after a minute'
        });
    }
});

module.exports = {
    authLimiter,
    apiLimiter
};