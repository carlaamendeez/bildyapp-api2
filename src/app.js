const express = require('express')
const helmet = require('helmet')
const { createServer } = require('http')
const { Server } = require('socket.io')
const jwt = require('jsonwebtoken')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./config/swagger')
const limiter = require('./middleware/rate-limit')
const sanitize = require('./middleware/sanitize')
const errorHandler = require('./middleware/error-handler')
const routes = require('./routes')
const config = require('./config')

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: '*',
    },
})

io.use((socket, next) => {
    const token = socket.handshake.auth.token
    if (!token) {
        return next(new Error('Token no proporcionado'))
    }
    try {
        const decoded = jwt.verify(token, config.jwtSecret)
        socket.user = decoded
        next()
    } catch (err) {
        return next(new Error('Token no válido'))
    }
})

app.use(helmet())
app.use(limiter)
app.use(express.json())
app.use(sanitize)
app.set('io', io)

app.get('/health', (req, res) => {
    const mongoose = require('mongoose')
    res.status(200).json({
        status: 'ok',
        db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    })
})

app.use('/api', routes)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use(errorHandler)

io.on('connection', (socket) => {
    socket.on('join', (companyId) => {
        socket.join(companyId)
    })
})

module.exports = { app, httpServer, io }