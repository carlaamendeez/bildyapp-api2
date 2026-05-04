const cloudinary = require('cloudinary').v2
const config = require('../config')

cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
})

const uploadToCloudinary = (file, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder, resource_type: 'auto' },
            (error, result) => {
                if (error) return reject(error)
                resolve(result.secure_url)
            }
        )
        uploadStream.end(file.buffer)
    })
}

module.exports = { uploadToCloudinary }