const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Company = require('../models/Company')
const AppError = require('../utils/AppError')
const config = require('../config')
const { sendVerificationEmail } = require('../services/mail.service')

const generateToken = (id) => {
    return jwt.sign({ id }, config.jwtSecret, { expiresIn: config.jwtExpiresIn })
}

const register = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return next(new AppError('El email ya está registrado', 400))
        }
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
        const user = await User.create({ email, password, verificationCode })
        await sendVerificationEmail(email, verificationCode)
        const token = generateToken(user._id)
        res.status(201).json({ status: 'success', token })
    } catch (err) {
        next(err)
    }
}

const validateEmail = async (req, res, next) => {
    try {
        const { code } = req.body
        const user = await User.findById(req.user._id)
        if (user.verificationCode !== code) {
            return next(new AppError('Código incorrecto', 400))
        }
        user.emailVerified = true
        user.verificationCode = undefined
        await user.save()
        res.status(200).json({ status: 'success', message: 'Email verificado' })
    } catch (err) {
        next(err)
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email }).populate('company')
        if (!user || !(await user.comparePassword(password))) {
            return next(new AppError('Email o contraseña incorrectos', 401))
        }
        const token = generateToken(user._id)
        res.status(200).json({ status: 'success', token })
    } catch (err) {
        next(err)
    }
}

const updateUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true })
        res.status(200).json({ status: 'success', data: user })
    } catch (err) {
        next(err)
    }
}

const updateCompany = async (req, res, next) => {
    try {
        let company = await Company.findOne({ owner: req.user._id })
        if (company) {
            company = await Company.findByIdAndUpdate(company._id, req.body, { new: true })
        } else {
            company = await Company.create({ ...req.body, owner: req.user._id })
            await User.findByIdAndUpdate(req.user._id, { company: company._id })
        }
        res.status(200).json({ status: 'success', data: company })
    } catch (err) {
        next(err)
    }
}

const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate('company')
        res.status(200).json({ status: 'success', data: user })
    } catch (err) {
        next(err)
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const { soft } = req.query
        if (soft === 'true') {
            await User.findByIdAndUpdate(req.user._id, { deleted: true })
        } else {
            await User.findByIdAndDelete(req.user._id)
        }
        res.status(200).json({ status: 'success', message: 'Usuario eliminado' })
    } catch (err) {
        next(err)
    }
}

module.exports = { register, validateEmail, login, updateUser, updateCompany, getUser, deleteUser }