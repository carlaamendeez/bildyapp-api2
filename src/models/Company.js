const mongoose = require('mongoose')

const companySchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        cif: {
            type: String,
            required: true,
            unique: true,
        },
        address: {
            street: String,
            number: String,
            postal: String,
            city: String,
            province: String,
        },
        email: {
            type: String,
        },
        phone: {
            type: String,
        },
        logoUrl: {
            type: String,
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('Company', companySchema)