const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  logger.info('Incoming Request:', {
    method: req.method,
    path: req.path,
    headers: req.headers,
    body: req.body,
    query: req.query,
    ip: req.ip
  });
  next();
};

module.exports = requestLogger;