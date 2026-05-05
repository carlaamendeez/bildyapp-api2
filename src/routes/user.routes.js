const express = require('express')
const router = express.Router()
const { register, validateEmail, login, updateUser, updateCompany, getUser, deleteUser } = require('../controllers/user.controller')
const { protect } = require('../middleware/auth.middleware')
const validate = require('../middleware/validate')
const { registerSchema, loginSchema, updateUserSchema, companySchema, validationCodeSchema } = require('../validators/user.validator')

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Usuarios]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: Email ya registrado
 */
router.post('/register', validate(registerSchema), register)

/**
 * @swagger
 * /api/user/validation:
 *   put:
 *     summary: Validar email con codigo
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verificado correctamente
 *       400:
 *         description: Codigo incorrecto
 */
router.put('/validation', protect, validate(validationCodeSchema), validateEmail)

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login de usuario
 *     tags: [Usuarios]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login correcto
 *       401:
 *         description: Credenciales incorrectas
 */
router.post('/login', validate(loginSchema), login)

/**
 * @swagger
 * /api/user/register:
 *   put:
 *     summary: Actualizar datos personales del usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 */
router.put('/register', protect, validate(updateUserSchema), updateUser)

/**
 * @swagger
 * /api/user/company:
 *   patch:
 *     summary: Crear o actualizar compania del usuario
 *     tags: [Usuarios]
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
 *     responses:
 *       200:
 *         description: Compania actualizada correctamente
 */
router.patch('/company', protect, validate(companySchema), updateCompany)

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Obtener usuario autenticado
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Usuario obtenido correctamente
 *       401:
 *         description: No autorizado
 */
router.get('/', protect, getUser)

/**
 * @swagger
 * /api/user:
 *   delete:
 *     summary: Eliminar usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: query
 *         name: soft
 *         schema:
 *           type: boolean
 *         description: Si es true hace soft delete
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 */
router.delete('/', protect, deleteUser)

module.exports = router