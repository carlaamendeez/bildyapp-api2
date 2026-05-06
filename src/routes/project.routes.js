const express = require('express')
const router = express.Router()
const { createProject, getProjects, getProject, updateProject, deleteProject, getArchivedProjects, restoreProject } = require('../controllers/project.controller')
const { protect } = require('../middleware/auth.middleware')
const validate = require('../middleware/validate')
const { projectSchema, updateProjectSchema } = require('../validators/project.validator')

/**
 * @swagger
 * /api/project:
 *   post:
 *     summary: Crear un proyecto
 *     tags: [Proyectos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - projectCode
 *               - client
 *             properties:
 *               name:
 *                 type: string
 *               projectCode:
 *                 type: string
 *               client:
 *                 type: string
 *               email:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Proyecto creado correctamente
 *       400:
 *         description: Codigo duplicado o datos incorrectos
 */
router.post('/', validate(projectSchema), createProject)

/**
 * @swagger
 * /api/project:
 *   get:
 *     summary: Listar todos los proyectos
 *     tags: [Proyectos]
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
 *         name: name
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de proyectos
 */
router.get('/', getProjects)

/**
 * @swagger
 * /api/project/archived:
 *   get:
 *     summary: Listar proyectos archivados
 *     tags: [Proyectos]
 *     responses:
 *       200:
 *         description: Lista de proyectos archivados
 */
router.get('/archived', getArchivedProjects)

/**
 * @swagger
 * /api/project/{id}:
 *   get:
 *     summary: Obtener un proyecto concreto
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proyecto encontrado
 *       404:
 *         description: Proyecto no encontrado
 */
router.get('/:id', getProject)

/**
 * @swagger
 * /api/project/{id}:
 *   put:
 *     summary: Actualizar un proyecto
 *     tags: [Proyectos]
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
 *               projectCode:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Proyecto actualizado correctamente
 *       404:
 *         description: Proyecto no encontrado
 */
router.put('/:id', validate(updateProjectSchema), updateProject)

/**
 * @swagger
 * /api/project/{id}:
 *   delete:
 *     summary: Eliminar o archivar un proyecto
 *     tags: [Proyectos]
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
 *         description: Proyecto eliminado o archivado
 *       404:
 *         description: Proyecto no encontrado
 */
router.delete('/:id', deleteProject)

/**
 * @swagger
 * /api/project/{id}/restore:
 *   patch:
 *     summary: Restaurar un proyecto archivado
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proyecto restaurado correctamente
 *       404:
 *         description: Proyecto no encontrado
 */
router.patch('/:id/restore', restoreProject)

router.use(protect)

module.exports = router