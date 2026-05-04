const nodemailer = require('nodemailer')
const config = require('../config')

const transporter = nodemailer.createTransport({
    host: config.emailHost,
    port: config.emailPort,
    auth: {
        user: config.emailUser,
        pass: config.emailPass,
    },
})

const sendVerificationEmail = async (email, code) => {
    await transporter.sendMail({
        from: config.emailFrom,
        to: email,
        subject: 'Verifica tu cuenta en BildyApp',
        html: `
            <h1>Bienvenido a BildyApp</h1>
            <p>Tu código de verificación es:</p>
            <h2>${code}</h2>
            <p>Introduce este código en la aplicación para verificar tu cuenta.</p>
        `,
    })
}

module.exports = { sendVerificationEmail }