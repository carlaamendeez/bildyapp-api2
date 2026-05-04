const DeliveryNote = require('../models/DeliveryNote')
const Client = require('../models/Client')
const Project = require('../models/Project')
const AppError = require('../utils/AppError')
const { uploadToCloudinary } = require('../services/storage.service')
const { generatePDF } = require('../services/pdf.service')

const createDeliveryNote = async (req, res, next) => {
    try {
        const { user } = req
        if (!user.company) {
            return next(new AppError('El usuario no tiene compañía asociada', 400))
        }
        const client = await Client.findOne({ _id: req.body.client, company: user.company._id, deleted: false })
        if (!client) {
            return next(new AppError('Cliente no encontrado en tu compañía', 404))
        }
        const project = await Project.findOne({ _id: req.body.project, company: user.company._id, deleted: false })
        if (!project) {
            return next(new AppError('Proyecto no encontrado en tu compañía', 404))
        }
        const deliveryNote = await DeliveryNote.create({ ...req.body, user: user._id, company: user.company._id })
        res.status(201).json({ status: 'success', data: deliveryNote })
    } catch (err) {
        next(err)
    }
}

const getDeliveryNotes = async (req, res, next) => {
    try {
        const { user } = req
        const { page = 1, limit = 10, sort = 'createdAt' } = req.query
        const filter = { company: user.company._id, deleted: false }
        const total = await DeliveryNote.countDocuments(filter)
        const deliveryNotes = await DeliveryNote.find(filter)
            .populate('client project')
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(Number(limit))
        res.status(200).json({
            status: 'success',
            totalItems: total,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page),
            data: deliveryNotes,
        })
    } catch (err) {
        next(err)
    }
}

const getDeliveryNote = async (req, res, next) => {
    try {
        const deliveryNote = await DeliveryNote.findOne({ _id: req.params.id, company: req.user.company._id, deleted: false }).populate('client project')
        if (!deliveryNote) {
            return next(new AppError('Albarán no encontrado', 404))
        }
        res.status(200).json({ status: 'success', data: deliveryNote })
    } catch (err) {
        next(err)
    }
}

const updateDeliveryNote = async (req, res, next) => {
    try {
        const deliveryNote = await DeliveryNote.findOne({ _id: req.params.id, company: req.user.company._id, deleted: false })
        if (!deliveryNote) {
            return next(new AppError('Albarán no encontrado', 404))
        }
        if (deliveryNote.signed) {
            return next(new AppError('No se puede editar un albarán firmado', 400))
        }
        const updated = await DeliveryNote.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.status(200).json({ status: 'success', data: updated })
    } catch (err) {
        next(err)
    }
}

const deleteDeliveryNote = async (req, res, next) => {
    try {
        const deliveryNote = await DeliveryNote.findOne({ _id: req.params.id, company: req.user.company._id, deleted: false })
        if (!deliveryNote) {
            return next(new AppError('Albarán no encontrado', 404))
        }
        if (deliveryNote.signed) {
            return next(new AppError('No se puede eliminar un albarán firmado', 400))
        }
        const { soft } = req.query
        if (soft === 'true') {
            await DeliveryNote.findByIdAndUpdate(req.params.id, { deleted: true })
            return res.status(200).json({ status: 'success', message: 'Albarán archivado' })
        }
        await DeliveryNote.findByIdAndDelete(req.params.id)
        res.status(200).json({ status: 'success', message: 'Albarán eliminado' })
    } catch (err) {
        next(err)
    }
}

const signDeliveryNote = async (req, res, next) => {
    try {
        const deliveryNote = await DeliveryNote.findOne({ _id: req.params.id, company: req.user.company._id, deleted: false })
        if (!deliveryNote) {
            return next(new AppError('Albarán no encontrado', 404))
        }
        if (deliveryNote.signed) {
            return next(new AppError('El albarán ya está firmado', 400))
        }
        if (!req.file) {
            return next(new AppError('No se ha subido ninguna firma', 400))
        }
        const signatureUrl = await uploadToCloudinary(req.file, 'signatures')
        const pdfBuffer = await generatePDF(deliveryNote)
        const pdfUrl = await uploadToCloudinary({ buffer: pdfBuffer, mimetype: 'application/pdf' }, 'pdfs')
        const updated = await DeliveryNote.findByIdAndUpdate(
            req.params.id,
            { signed: true, signedAt: new Date(), signatureUrl, pdfUrl },
            { new: true }
        )
        res.status(200).json({ status: 'success', data: updated })
    } catch (err) {
        next(err)
    }
}

const getDeliveryNotePDF = async (req, res, next) => {
    try {
        const deliveryNote = await DeliveryNote.findOne({ _id: req.params.id, company: req.user.company._id, deleted: false }).populate('client project')
        if (!deliveryNote) {
            return next(new AppError('Albarán no encontrado', 404))
        }
        const pdfBuffer = await generatePDF(deliveryNote)
        res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename=albaran-${deliveryNote._id}.pdf` })
        res.send(pdfBuffer)
    } catch (err) {
        next(err)
    }
}

module.exports = { createDeliveryNote, getDeliveryNotes, getDeliveryNote, updateDeliveryNote, deleteDeliveryNote, signDeliveryNote, getDeliveryNotePDF }