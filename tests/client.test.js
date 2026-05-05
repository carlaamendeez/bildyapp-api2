const request = require('supertest')
const { app } = require('../src/app')

let token
let companyId

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
})

describe('Client endpoints', () => {
    it('debe crear un cliente correctamente', async () => {
        const res = await request(app)
            .post('/api/client')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Cliente Test',
                cif: 'A12345678',
                email: 'cliente@test.com',
            })
        expect(res.statusCode).toBe(201)
        expect(res.body.data).toHaveProperty('name', 'Cliente Test')
    })

    it('no debe crear un cliente con CIF duplicado', async () => {
        await request(app)
            .post('/api/client')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Cliente Test',
                cif: 'A12345678',
            })
        const res = await request(app)
            .post('/api/client')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Cliente Test 2',
                cif: 'A12345678',
            })
        expect(res.statusCode).toBe(400)
    })

    it('debe listar los clientes', async () => {
        await request(app)
            .post('/api/client')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Cliente Test',
                cif: 'A12345678',
            })
        const res = await request(app)
            .get('/api/client')
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toBe(200)
        expect(res.body.data.length).toBeGreaterThan(0)
    })

    it('debe archivar un cliente', async () => {
        const create = await request(app)
            .post('/api/client')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Cliente Test',
                cif: 'A12345678',
            })
        const clientId = create.body.data._id
        const res = await request(app)
            .delete(`/api/client/${clientId}?soft=true`)
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toBe(200)
        expect(res.body.message).toBe('Cliente archivado')
    })

    it('debe restaurar un cliente archivado', async () => {
        const create = await request(app)
            .post('/api/client')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Cliente Test',
                cif: 'A12345678',
            })
        const clientId = create.body.data._id
        await request(app)
            .delete(`/api/client/${clientId}?soft=true`)
            .set('Authorization', `Bearer ${token}`)
        const res = await request(app)
            .patch(`/api/client/${clientId}/restore`)
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toBe(200)
        expect(res.body.data.deleted).toBe(false)
    })
})