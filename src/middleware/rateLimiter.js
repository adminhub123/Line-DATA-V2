const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
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

const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
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