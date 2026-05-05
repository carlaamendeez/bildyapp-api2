const request = require('supertest')
const { app } = require('../src/app')

let token
let clientId
let projectId

beforeEach(async () => {
    const register = await request(app).post('/api/user/register').send({
        email: 'test@test.com',
        password: 'password123',
    })
    token = register.body.token

    await request(app)
        .patch('/api/user/company')
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: 'Empresa Test',
            cif: 'B12345678',
        })

    const client = await request(app)
        .post('/api/client')
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: 'Cliente Test',
            cif: 'A12345678',
        })
    clientId = client.body.data._id

    const project = await request(app)
        .post('/api/project')
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: 'Proyecto Test',
            projectCode: 'PRJ001',
            client: clientId,
        })
    projectId = project.body.data._id
})

describe('DeliveryNote endpoints', () => {
    it('debe crear un albaran de horas correctamente', async () => {
        const res = await request(app)
            .post('/api/deliverynote')
            .set('Authorization', `Bearer ${token}`)
            .send({
                client: clientId,
                project: projectId,
                format: 'hours',
                workDate: '2024-01-01',
                hours: 8,
            })
        expect(res.statusCode).toBe(201)
        expect(res.body.data).toHaveProperty('format', 'hours')
    })

    it('debe crear un albaran de materiales correctamente', async () => {
        const res = await request(app)
            .post('/api/deliverynote')
            .set('Authorization', `Bearer ${token}`)
            .send({
                client: clientId,
                project: projectId,
                format: 'material',
                workDate: '2024-01-01',
                material: 'Cemento',
                quantity: 10,
                unit: 'sacos',
            })
        expect(res.statusCode).toBe(201)
        expect(res.body.data).toHaveProperty('format', 'material')
    })

    it('debe listar los albaranes', async () => {
        await request(app)
            .post('/api/deliverynote')
            .set('Authorization', `Bearer ${token}`)
            .send({
                client: clientId,
                project: projectId,
                format: 'hours',
                workDate: '2024-01-01',
                hours: 8,
            })
        const res = await request(app)
            .get('/api/deliverynote')
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toBe(200)
        expect(res.body.data.length).toBeGreaterThan(0)
    })

    it('no debe editar un albaran firmado', async () => {
        const create = await request(app)
            .post('/api/deliverynote')
            .set('Authorization', `Bearer ${token}`)
            .send({
                client: clientId,
                project: projectId,
                format: 'hours',
                workDate: '2024-01-01',
                hours: 8,
            })
        const noteId = create.body.data._id
        await require('../src/models/DeliveryNote').findByIdAndUpdate(noteId, { signed: true })
        const res = await request(app)
            .put(`/api/deliverynote/${noteId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ hours: 10 })
        expect(res.statusCode).toBe(400)
    })
})