const express = require('express')
const router = express.Router()
const { register, validateEmail, login, updateUser, updateCompany, getUser, deleteUser } = require('../controllers/user.controller')
const { protect } = require('../middleware/auth.middleware')
const validate = require('../middleware/validate')
const { registerSchema, loginSchema, updateUserSchema, companySchema, validationCodeSchema } = require('../validators/user.validator')

router.post('/register', validate(registerSchema), register)
router.put('/validation', protect, validate(validationCodeSchema), validateEmail)
router.post('/login', validate(loginSchema), login)
router.put('/register', protect, validate(updateUserSchema), updateUser)
router.patch('/company', protect, validate(companySchema), updateCompany)
router.get('/', protect, getUser)
router.delete('/', protect, deleteUser)

module.exports = router