const request = require('supertest')
const { app } = require('../src/app')

describe('Auth endpoints', () => {
    it('debe registrar un usuario correctamente', async () => {
        const res = await request(app).post('/api/user/register').send({
            email: 'test@test.com',
            password: 'password123',
        })
        expect(res.statusCode).toBe(201)
        expect(res.body).toHaveProperty('token')
    })

    it('no debe registrar un usuario con email duplicado', async () => {
        await request(app).post('/api/user/register').send({
            email: 'test@test.com',
            password: 'password123',
        })
        const res = await request(app).post('/api/user/register').send({
            email: 'test@test.com',
            password: 'password123',
        })
        expect(res.statusCode).toBe(400)
    })

    it('debe hacer login correctamente', async () => {
        await request(app).post('/api/user/register').send({
            email: 'test@test.com',
            password: 'password123',
        })
        const res = await request(app).post('/api/user/login').send({
            email: 'test@test.com',
            password: 'password123',
        })
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('token')
    })

    it('no debe hacer login con contraseña incorrecta', async () => {
        await request(app).post('/api/user/register').send({
            email: 'test@test.com',
            password: 'password123',
        })
        const res = await request(app).post('/api/user/login').send({
            email: 'test@test.com',
            password: 'wrongpassword',
        })
        expect(res.statusCode).toBe(401)
    })

    it('debe obtener el usuario autenticado', async () => {
        const register = await request(app).post('/api/user/register').send({
            email: 'test@test.com',
            password: 'password123',
        })
        const token = register.body.token
        const res = await request(app)
            .get('/api/user')
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toBe(200)
        expect(res.body.data).toHaveProperty('email', 'test@test.com')
    })
})