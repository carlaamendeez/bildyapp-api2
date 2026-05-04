const multer = require('multer')
const AppError = require('../utils/AppError')

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
        cb(null, true)
    } else {
        cb(new AppError('Solo se permiten imágenes y PDFs', 400), false)
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
})

module.exports = upload