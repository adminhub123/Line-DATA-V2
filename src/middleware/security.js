//src/middleware/security.js
const helmet = require('helmet');

const securityHeaders = (req, res, next) => {
    // Set security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    
    // Remove sensitive headers
    res.removeHeader('X-Powered-By');
    
    next();
};

module.exports = securityHeaders;