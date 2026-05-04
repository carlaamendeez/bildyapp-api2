const { z } = require('zod')

const deliveryNoteSchema = z.object({
    client: z.string().min(1, 'El cliente es obligatorio'),
    project: z.string().min(1, 'El proyecto es obligatorio'),
    format: z.enum(['material', 'hours'], { required_error: 'El formato es obligatorio' }),
    description: z.string().optional(),
    workDate: z.string().min(1, 'La fecha de trabajo es obligatoria'),
    material: z.string().optional(),
    quantity: z.number().optional(),
    unit: z.string().optional(),
    hours: z.number().optional(),
    workers: z.array(
        z.object({
            name: z.string(),
            hours: z.number(),
        })
    ).optional(),
})

const updateDeliveryNoteSchema = deliveryNoteSchema.partial()

module.exports = { deliveryNoteSchema, updateDeliveryNoteSchema }