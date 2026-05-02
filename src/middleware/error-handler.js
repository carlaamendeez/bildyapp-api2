const AppError = require('../utils/AppError')
const config = require('../config')
const { sendSlackAlert } = require('../services/logger.service')

const errorHandler = async (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if (err.statusCode >= 500) {
        await sendSlackAlert(err, req)
    }

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    })
}

module.exports = errorHandler