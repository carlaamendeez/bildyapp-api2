const { z } = require('zod')

const projectSchema = z.object({
    name: z.string().min(1, 'El nombre es obligatorio'),
    projectCode: z.string().min(1, 'El código de proyecto es obligatorio'),
    client: z.string().min(1, 'El cliente es obligatorio'),
    address: z.object({
        street: z.string().optional(),
        number: z.string().optional(),
        postal: z.string().optional(),
        city: z.string().optional(),
        province: z.string().optional(),
    }).optional(),
    email: z.string().email('Email no válido').optional(),
    notes: z.string().optional(),
    active: z.boolean().optional(),
})

const updateProjectSchema = projectSchema.partial()

module.exports = { projectSchema, updateProjectSchema }