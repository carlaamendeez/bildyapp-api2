const request = require('supertest')
const { app } = require('../src/app')

let token
let clientId

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
})

describe('Project endpoints', () => {
    it('debe crear un proyecto correctamente', async () => {
        const res = await request(app)
            .post('/api/project')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Proyecto Test',
                projectCode: 'PRJ001',
                client: clientId,
            })
        expect(res.statusCode).toBe(201)
        expect(res.body.data).toHaveProperty('name', 'Proyecto Test')
    })

    it('no debe crear un proyecto con codigo duplicado', async () => {
        await request(app)
            .post('/api/project')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Proyecto Test',
                projectCode: 'PRJ001',
                client: clientId,
            })
        const res = await request(app)
            .post('/api/project')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Proyecto Test 2',
                projectCode: 'PRJ001',
                client: clientId,
            })
        expect(res.statusCode).toBe(400)
    })

    it('debe listar los proyectos', async () => {
        await request(app)
            .post('/api/project')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Proyecto Test',
                projectCode: 'PRJ001',
                client: clientId,
            })
        const res = await request(app)
            .get('/api/project')
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toBe(200)
        expect(res.body.data.length).toBeGreaterThan(0)
    })

    it('debe archivar un proyecto', async () => {
        const create = await request(app)
            .post('/api/project')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Proyecto Test',
                projectCode: 'PRJ001',
                client: clientId,
            })
        const projectId = create.body.data._id
        const res = await request(app)
            .delete(`/api/project/${projectId}?soft=true`)
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toBe(200)
        expect(res.body.message).toBe('Proyecto archivado')
    })

    it('debe restaurar un proyecto archivado', async () => {
        const create = await request(app)
            .post('/api/project')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Proyecto Test',
                projectCode: 'PRJ001',
                client: clientId,
            })
        const projectId = create.body.data._id
        await request(app)
            .delete(`/api/project/${projectId}?soft=true`)
            .set('Authorization', `Bearer ${token}`)
        const res = await request(app)
            .patch(`/api/project/${projectId}/restore`)
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toBe(200)
        expect(res.body.data.deleted).toBe(false)
    })
})