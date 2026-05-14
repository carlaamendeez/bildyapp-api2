# EXAMEN — Carla

## Reto
F1 — Socket.IO: JWT en handshake + eventos desde controladores + HTTP 400→409

## Tarea técnica

### Qué problema detecté
El objeto io en src/app.js no tenía autenticación en el handshake, lo que permitía que cualquier cliente sin JWT se conectara. Además los controladores nunca emitían eventos aunque la infraestructura estaba creada. Por último los errores de albarán firmado devolvían 400 en lugar de 409.

### Cómo lo arreglé
Añadí un middleware con io.use() que extrae el token de socket.handshake.auth.token y lo verifica con jwt.verify, rechazando conexiones sin token válido. Para pasar io a los controladores sin importarlo directamente usé app.set('io', io) en app.js y req.app.get('io') en cada controlador. Emití los eventos client:new, project:new, deliverynote:new y deliverynote:signed desde sus controladores. Cambié los dos AppError con 400 a 409 en updateDeliveryNote y deleteDeliveryNote.

### Por qué mi solución es correcta
El patrón app.set/app.get evita dependencias circulares entre módulos. El middleware de Socket.IO garantiza que solo usuarios autenticados puedan conectarse. Los eventos se emiten solo a la room de la compañía con io.to(companyId).emit(), garantizando que cada empresa solo recibe sus propios eventos. El 409 es semánticamente correcto porque el problema no es la petición sino el estado del recurso.

## Proceso
Tiempo total invertido: 2 horas
Herramientas usadas: Visual Studio Code, Claude AI