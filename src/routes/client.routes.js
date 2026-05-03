const express = require('express')
const router = express.Router()
const { createClient, getClients, getClient, updateClient, deleteClient, getArchivedClients, restoreClient } = require('../controllers/client.controller')
const { protect } = require('../middleware/auth.middleware')
const validate = require('../middleware/validate')
const { clientSchema, updateClientSchema } = require('../validators/client.validator')

router.use(protect)

router.get('/archived', getArchivedClients)
router.patch('/:id/restore', restoreClient)
router.post('/', validate(clientSchema), createClient)
router.get('/', getClients)
router.get('/:id', getClient)
router.put('/:id', validate(updateClientSchema), updateClient)
router.delete('/:id', deleteClient)

module.exports = router