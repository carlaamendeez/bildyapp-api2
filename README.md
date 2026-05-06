# BildyApp API

API REST para la gestión de albaranes entre clientes y proveedores.

## Instalación

git clone https://github.com/TU_USUARIO/bildyapp-api2.git
cd bildyapp-api2
npm install
cp .env.example .env

Rellena el fichero .env con tus variables de entorno.

## Ejecución

npm run dev

## Ejecución con Docker

docker compose up

## Tests

npm test

## Documentación Swagger

Con el servidor arrancado accede a:

http://localhost:3000/api-docs

## Endpoints principales

### Usuarios
- POST /api/user/register
- POST /api/user/login
- PUT /api/user/validation
- PUT /api/user/register
- PATCH /api/user/company
- GET /api/user
- DELETE /api/user

### Clientes
- POST /api/client
- GET /api/client
- GET /api/client/:id
- PUT /api/client/:id
- DELETE /api/client/:id
- GET /api/client/archived
- PATCH /api/client/:id/restore

### Proyectos
- POST /api/project
- GET /api/project
- GET /api/project/:id
- PUT /api/project/:id
- DELETE /api/project/:id
- GET /api/project/archived
- PATCH /api/project/:id/restore

### Albaranes
- POST /api/deliverynote
- GET /api/deliverynote
- GET /api/deliverynote/:id
- PUT /api/deliverynote/:id
- DELETE /api/deliverynote/:id
- PATCH /api/deliverynote/:id/sign
- GET /api/deliverynote/:id/pdf

## Tecnologias

- Node.js + Express
- MongoDB + Mongoose
- JWT
- Zod
- Swagger/OpenAPI 3.0
- Jest + Supertest
- Socket.IO
- Docker + Docker Compose
- GitHub Actions
- Cloudinary
- Nodemailer