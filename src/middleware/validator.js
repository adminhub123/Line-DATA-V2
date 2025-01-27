const logger = require('../utils/logger');

exports.validateLogin = (req, res, next) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        logger.warn('Invalid login attempt - missing credentials');
        return res.status(400).json({
            username: '',
            name: '',
            role: '',
            team: '',
            token: '',
            expiration: null,
            message: 'Username and password are required',
            brandid: null
        });
    }
    
    if (typeof username !== 'string' || typeof password !== 'string') {
        logger.warn('Invalid login attempt - invalid data types');
        return res.status(400).json({
            username: '',
            name: '',
            role: '',
            team: '',
            token: '',
            expiration: null,
            message: 'Invalid credentials format',
            brandid: null
        });
    }
    
    next();
};