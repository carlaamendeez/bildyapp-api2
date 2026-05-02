const jwt = require('jsonwebtoken')
const config = require('../config')
const AppError = require('../utils/AppError')
const User = require('../models/User')

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(new AppError('No token provided', 401))
        }

        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token, config.jwtSecret)
        const user = await User.findById(decoded.id).populate('company')

        if (!user) {
            return next(new AppError('User not found', 401))
        }

        req.user = user
        next()
    } catch (err) {
        return next(new AppError('Invalid token', 401))
    }
}

module.exports = { protect }