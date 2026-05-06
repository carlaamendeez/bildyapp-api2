const express = require('express')
const router = express.Router()
const { createClient, getClients, getClient, updateClient, deleteClient, getArchivedClients, restoreClient } = require('../controllers/client.controller')
const { protect } = require('../middleware/auth.middleware')
const validate = require('../middleware/validate')
const { clientSchema, updateClientSchema } = require('../validators/client.validator')

/**
 * @swagger
 * /api/client:
 *   post:
 *     summary: Crear un cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - cif
 *             properties:
 *               name:
 *                 type: string
 *               cif:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cliente creado correctamente
 *       400:
 *         description: CIF duplicado o datos incorrectos
 */
router.post('/', validate(clientSchema), createClient)

/**
 * @swagger
 * /api/client:
 *   get:
 *     summary: Listar todos los clientes
 *     tags: [Clientes]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Numero de pagina
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Resultados por pagina
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrar por nombre
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Campo de ordenacion
 *     responses:
 *       200:
 *         description: Lista de clientes
 */
router.get('/', getClients)

/**
 * @swagger
 * /api/client/archived:
 *   get:
 *     summary: Listar clientes archivados
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes archivados
 */
router.get('/archived', getArchivedClients)

/**
 * @swagger
 * /api/client/{id}:
 *   get:
 *     summary: Obtener un cliente concreto
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       404:
 *         description: Cliente no encontrado
 */
router.get('/:id', getClient)

/**
 * @swagger
 * /api/client/{id}:
 *   put:
 *     summary: Actualizar un cliente
 *     tags: [Clientes]
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
 *               name:
 *                 type: string
 *               cif:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente actualizado correctamente
 *       404:
 *         description: Cliente no encontrado
 */
router.put('/:id', validate(updateClientSchema), updateClient)

/**
 * @swagger
 * /api/client/{id}:
 *   delete:
 *     summary: Eliminar o archivar un cliente
 *     tags: [Clientes]
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
 *         description: Si es true hace soft delete
 *     responses:
 *       200:
 *         description: Cliente eliminado o archivado
 *       404:
 *         description: Cliente no encontrado
 */
router.delete('/:id', deleteClient)

/**
 * @swagger
 * /api/client/{id}/restore:
 *   patch:
 *     summary: Restaurar un cliente archivado
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cliente restaurado correctamente
 *       404:
 *         description: Cliente no encontrado
 */
router.patch('/:id/restore', restoreClient)

router.use(protect)

module.exports = router