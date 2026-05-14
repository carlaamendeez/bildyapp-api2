const Project = require('../models/Project')
const Client = require('../models/Client')
const AppError = require('../utils/AppError')

const createProject = async (req, res, next) => {
    try {
        const { user } = req
        if (!user.company) {
            return next(new AppError('El usuario no tiene compañía asociada', 400))
        }
        const client = await Client.findOne({ _id: req.body.client, company: user.company._id, deleted: false })
        if (!client) {
            return next(new AppError('Cliente no encontrado en tu compañía', 404))
        }
        const existing = await Project.findOne({ projectCode: req.body.projectCode, company: user.company._id })
        if (existing) {
            return next(new AppError('Ya existe un proyecto con ese código en tu compañía', 400))
        }
        const project = await Project.create({ ...req.body, user: user._id, company: user.company._id })

        const io = req.app.get('io')
        io.to(user.company._id.toString()).emit('project:new', project)

        res.status(201).json({ status: 'success', data: project })
    } catch (err) {
        next(err)
    }
}

const getProjects = async (req, res, next) => {
    try {
        const { user } = req
        const { page = 1, limit = 10, name, sort = 'createdAt' } = req.query
        const filter = { company: user.company._id, deleted: false }
        if (name) {
            filter.name = { $regex: name, $options: 'i' }
        }
        const total = await Project.countDocuments(filter)
        const projects = await Project.find(filter)
            .populate('client')
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(Number(limit))
        res.status(200).json({
            status: 'success',
            totalItems: total,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page),
            data: projects,
        })
    } catch (err) {
        next(err)
    }
}

const getProject = async (req, res, next) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, company: req.user.company._id, deleted: false }).populate('client')
        if (!project) {
            return next(new AppError('Proyecto no encontrado', 404))
        }
        res.status(200).json({ status: 'success', data: project })
    } catch (err) {
        next(err)
    }
}

const updateProject = async (req, res, next) => {
    try {
        const project = await Project.findOneAndUpdate(
            { _id: req.params.id, company: req.user.company._id, deleted: false },
            req.body,
            { new: true }
        )
        if (!project) {
            return next(new AppError('Proyecto no encontrado', 404))
        }
        res.status(200).json({ status: 'success', data: project })
    } catch (err) {
        next(err)
    }
}

const deleteProject = async (req, res, next) => {
    try {
        const { soft } = req.query
        if (soft === 'true') {
            const project = await Project.findOneAndUpdate(
                { _id: req.params.id, company: req.user.company._id },
                { deleted: true },
                { new: true }
            )
            if (!project) {
                return next(new AppError('Proyecto no encontrado', 404))
            }
            return res.status(200).json({ status: 'success', message: 'Proyecto archivado' })
        }
        const project = await Project.findOneAndDelete({ _id: req.params.id, company: req.user.company._id })
        if (!project) {
            return next(new AppError('Proyecto no encontrado', 404))
        }
        res.status(200).json({ status: 'success', message: 'Proyecto eliminado' })
    } catch (err) {
        next(err)
    }
}

const getArchivedProjects = async (req, res, next) => {
    try {
        const projects = await Project.find({ company: req.user.company._id, deleted: true }).populate('client')
        res.status(200).json({ status: 'success', data: projects })
    } catch (err) {
        next(err)
    }
}

const restoreProject = async (req, res, next) => {
    try {
        const project = await Project.findOneAndUpdate(
            { _id: req.params.id, company: req.user.company._id, deleted: true },
            { deleted: false },
            { new: true }
        )
        if (!project) {
            return next(new AppError('Proyecto no encontrado', 404))
        }
        res.status(200).json({ status: 'success', data: project })
    } catch (err) {
        next(err)
    }
}

module.exports = { createProject, getProjects, getProject, updateProject, deleteProject, getArchivedProjects, restoreProject }