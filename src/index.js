require('dotenv').config()
const { httpServer } = require('./app')
const connectDB = require('./config/database')
const config = require('./config')

const start = async () => {
    await connectDB()
    httpServer.listen(config.port, () => {
        console.log(`Servidor corriendo en puerto ${config.port}`)
    })
}

process.on('SIGTERM', async () => {
    const mongoose = require('mongoose')
    const { httpServer } = require('./app')
    await mongoose.connection.close()
    httpServer.close(() => {
        process.exit(0)
    })
})

process.on('SIGINT', async () => {
    const mongoose = require('mongoose')
    await mongoose.connection.close()
    httpServer.close(() => {
        process.exit(0)
    })
})

start()