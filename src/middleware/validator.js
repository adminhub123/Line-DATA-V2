const logger = require('../utils/logger');

const validateLogin = (req, res, next) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        logger.warn('Invalid login attempt - missing credentials');
        return res.status(400).json({
            message: 'Username and password are required'
        });
    }
    
    if (typeof username !== 'string' || typeof password !== 'string') {
        logger.warn('Invalid login attempt - invalid data types');
        return res.status(400).json({
            message: 'Invalid credentials format'
        });
    }
    
    next();
};

const validateMessageRecord = (req, res, next) => {
    const { mid, flex, displayName } = req.body;
    
    if (!mid) {
        logger.warn('Invalid message record - missing MID');
        return res.status(400).json({
            message: 'MID is required'
        });
    }
    
    next();
};

module.exports = {
    validateLogin,
    validateMessageRecord
};