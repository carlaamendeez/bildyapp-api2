const { z } = require('zod')

const registerSchema = z.object({
    email: z.string().email('Email no válido'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

const loginSchema = z.object({
    email: z.string().email('Email no válido'),
    password: z.string().min(1, 'La contraseña es obligatoria'),
})

const updateUserSchema = z.object({
    name: z.string().min(1, 'El nombre es obligatorio').optional(),
    surname: z.string().min(1, 'El apellido es obligatorio').optional(),
    email: z.string().email('Email no válido').optional(),
})

const companySchema = z.object({
    name: z.string().min(1, 'El nombre es obligatorio'),
    cif: z.string().min(1, 'El CIF es obligatorio'),
    address: z.object({
        street: z.string().optional(),
        number: z.string().optional(),
        postal: z.string().optional(),
        city: z.string().optional(),
        province: z.string().optional(),
    }).optional(),
    email: z.string().email('Email no válido').optional(),
    phone: z.string().optional(),
})

const validationCodeSchema = z.object({
    code: z.string().min(1, 'El código es obligatorio'),
})

module.exports = { registerSchema, loginSchema, updateUserSchema, companySchema, validationCodeSchema }