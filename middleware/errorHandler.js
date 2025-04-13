const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    logger.error(`Error: ${err.message}`);
    logger.error(err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        error: {
            message,
            statusCode
        }
    });
};

module.exports = {
    errorHandler,
    logger
}; 