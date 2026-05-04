const express = require('express')
const router = express.Router()
const { createDeliveryNote, getDeliveryNotes, getDeliveryNote, updateDeliveryNote, deleteDeliveryNote, signDeliveryNote, getDeliveryNotePDF } = require('../controllers/deliverynote.controller')
const { protect } = require('../middleware/auth.middleware')
const validate = require('../middleware/validate')
const { deliveryNoteSchema, updateDeliveryNoteSchema } = require('../validators/deliverynote.validator')
const upload = require('../middleware/upload')

router.use(protect)

router.post('/', validate(deliveryNoteSchema), createDeliveryNote)
router.get('/', getDeliveryNotes)
router.get('/:id', getDeliveryNote)
router.put('/:id', validate(updateDeliveryNoteSchema), updateDeliveryNote)
router.delete('/:id', deleteDeliveryNote)
router.patch('/:id/sign', upload.single('signature'), signDeliveryNote)
router.get('/:id/pdf', getDeliveryNotePDF)

module.exports = router