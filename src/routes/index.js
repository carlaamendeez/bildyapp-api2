const express = require('express')
const router = express.Router()

const userRoutes = require('./user.routes')
const clientRoutes = require('./client.routes')
const projectRoutes = require('./project.routes')
const deliveryNoteRoutes = require('./deliverynote.routes')

router.use('/user', userRoutes)
router.use('/client', clientRoutes)
router.use('/project', projectRoutes)
router.use('/deliverynote', deliveryNoteRoutes)

module.exports = router