const Client = require('../models/Client')
const AppError = require('../utils/AppError')

const createClient = async (req, res, next) => {
    try {
        const { user } = req
        if (!user.company) {
            return next(new AppError('El usuario no tiene compañía asociada', 400))
        }
        const existing = await Client.findOne({ cif: req.body.cif, company: user.company._id })
        if (existing) {
            return next(new AppError('Ya existe un cliente con ese CIF en tu compañía', 400))
        }
        const client = await Client.create({ ...req.body, user: user._id, company: user.company._id })

        const io = req.app.get('io')
        io.to(user.company._id.toString()).emit('client:new', client)

        res.status(201).json({ status: 'success', data: client })
    } catch (err) {
        next(err)
    }
}

const getClients = async (req, res, next) => {
    try {
        const { user } = req
        const { page = 1, limit = 10, name, sort = 'createdAt' } = req.query
        const filter = { company: user.company._id, deleted: false }
        if (name) {
            filter.name = { $regex: name, $options: 'i' }
        }
        const total = await Client.countDocuments(filter)
        const clients = await Client.find(filter)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(Number(limit))
        res.status(200).json({
            status: 'success',
            totalItems: total,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page),
            data: clients,
        })
    } catch (err) {
        next(err)
    }
}

const getClient = async (req, res, next) => {
    try {
        const client = await Client.findOne({ _id: req.params.id, company: req.user.company._id, deleted: false })
        if (!client) {
            return next(new AppError('Cliente no encontrado', 404))
        }
        res.status(200).json({ status: 'success', data: client })
    } catch (err) {
        next(err)
    }
}

const updateClient = async (req, res, next) => {
    try {
        const client = await Client.findOneAndUpdate(
            { _id: req.params.id, company: req.user.company._id, deleted: false },
            req.body,
            { new: true }
        )
        if (!client) {
            return next(new AppError('Cliente no encontrado', 404))
        }
        res.status(200).json({ status: 'success', data: client })
    } catch (err) {
        next(err)
    }
}

const deleteClient = async (req, res, next) => {
    try {
        const { soft } = req.query
        if (soft === 'true') {
            const client = await Client.findOneAndUpdate(
                { _id: req.params.id, company: req.user.company._id },
                { deleted: true },
                { new: true }
            )
            if (!client) {
                return next(new AppError('Cliente no encontrado', 404))
            }
            return res.status(200).json({ status: 'success', message: 'Cliente archivado' })
        }
        const client = await Client.findOneAndDelete({ _id: req.params.id, company: req.user.company._id })
        if (!client) {
            return next(new AppError('Cliente no encontrado', 404))
        }
        res.status(200).json({ status: 'success', message: 'Cliente eliminado' })
    } catch (err) {
        next(err)
    }
}

const getArchivedClients = async (req, res, next) => {
    try {
        const clients = await Client.find({ company: req.user.company._id, deleted: true })
        res.status(200).json({ status: 'success', data: clients })
    } catch (err) {
        next(err)
    }
}

const restoreClient = async (req, res, next) => {
    try {
        const client = await Client.findOneAndUpdate(
            { _id: req.params.id, company: req.user.company._id, deleted: true },
            { deleted: false },
            { new: true }
        )
        if (!client) {
            return next(new AppError('Cliente no encontrado', 404))
        }
        res.status(200).json({ status: 'success', data: client })
    } catch (err) {
        next(err)
    }
}

module.exports = { createClient, getClients, getClient, updateClient, deleteClient, getArchivedClients, restoreClient }