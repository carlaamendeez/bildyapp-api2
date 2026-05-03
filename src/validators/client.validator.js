const { z } = require('zod')

const clientSchema = z.object({
    name: z.string().min(1, 'El nombre es obligatorio'),
    cif: z.string().min(1, 'El CIF es obligatorio'),
    email: z.string().email('Email no válido').optional(),
    phone: z.string().optional(),
    address: z.object({
        street: z.string().optional(),
        number: z.string().optional(),
        postal: z.string().optional(),
        city: z.string().optional(),
        province: z.string().optional(),
    }).optional(),
})

const updateClientSchema = clientSchema.partial()

module.exports = { clientSchema, updateClientSchema }