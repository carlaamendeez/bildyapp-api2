const express = require('express')
const router = express.Router()
const { createDeliveryNote, getDeliveryNotes, getDeliveryNote, updateDeliveryNote, deleteDeliveryNote, signDeliveryNote, getDeliveryNotePDF } = require('../controllers/deliverynote.controller')
const { protect } = require('../middleware/auth.middleware')
const validate = require('../middleware/validate')
const { deliveryNoteSchema, updateDeliveryNoteSchema } = require('../validators/deliverynote.validator')
const upload = require('../middleware/upload')

router.use(protect)

/**
 * @swagger
 * /api/deliverynote:
 *   post:
 *     summary: Crear un albaran
 *     tags: [Albaranes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - client
 *               - project
 *               - format
 *               - workDate
 *             properties:
 *               client:
 *                 type: string
 *               project:
 *                 type: string
 *               format:
 *                 type: string
 *                 enum: [material, hours]
 *               description:
 *                 type: string
 *               workDate:
 *                 type: string
 *               material:
 *                 type: string
 *               quantity:
 *                 type: number
 *               unit:
 *                 type: string
 *               hours:
 *                 type: number
 *     responses:
 *       201:
 *         description: Albaran creado correctamente
 *       400:
 *         description: Datos incorrectos
 */
router.post('/', validate(deliveryNoteSchema), createDeliveryNote)

/**
 * @swagger
 * /api/deliverynote:
 *   get:
 *     summary: Listar todos los albaranes
 *     tags: [Albaranes]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de albaranes
 */
router.get('/', getDeliveryNotes)

/**
 * @swagger
 * /api/deliverynote/{id}:
 *   get:
 *     summary: Obtener un albaran concreto
 *     tags: [Albaranes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Albaran encontrado
 *       404:
 *         description: Albaran no encontrado
 */
router.get('/:id', getDeliveryNote)

/**
 * @swagger
 * /api/deliverynote/{id}:
 *   put:
 *     summary: Actualizar un albaran
 *     tags: [Albaranes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               hours:
 *                 type: number
 *               material:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Albaran actualizado correctamente
 *       400:
 *         description: No se puede editar un albaran firmado
 *       404:
 *         description: Albaran no encontrado
 */
router.put('/:id', validate(updateDeliveryNoteSchema), updateDeliveryNote)

/**
 * @swagger
 * /api/deliverynote/{id}:
 *   delete:
 *     summary: Eliminar o archivar un albaran
 *     tags: [Albaranes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: soft
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Albaran eliminado o archivado
 *       400:
 *         description: No se puede eliminar un albaran firmado
 *       404:
 *         description: Albaran no encontrado
 */
router.delete('/:id', deleteDeliveryNote)

/**
 * @swagger
 * /api/deliverynote/{id}/sign:
 *   patch:
 *     summary: Firmar un albaran subiendo imagen de firma
 *     tags: [Albaranes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               signature:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Albaran firmado correctamente
 *       400:
 *         description: Albaran ya firmado o sin firma
 *       404:
 *         description: Albaran no encontrado
 */
router.patch('/:id/sign', upload.single('signature'), signDeliveryNote)

/**
 * @swagger
 * /api/deliverynote/{id}/pdf:
 *   get:
 *     summary: Descargar PDF de un albaran
 *     tags: [Albaranes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: PDF generado correctamente
 *       404:
 *         description: Albaran no encontrado
 */
router.get('/:id/pdf', getDeliveryNotePDF)

module.exports = router