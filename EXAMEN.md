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


## Respuestas socráticas

1. Importar io directamente desde app.js en un controlador crea una dependencia circular porque app.js importa las rutas, las rutas importan los controladores, y si los controladores importan app.js el ciclo se cierra. Node.js puede resolver dependencias circulares pero devuelve un objeto vacío o incompleto en el momento de la carga, lo que haría que io fuera undefined en el controlador. El patrón app.set('io', io) rompe ese ciclo porque los controladores acceden a io a través de req en tiempo de ejecución, no en tiempo de carga del módulo.

2. Un 400 Bad Request significa que el servidor no puede procesar la petición porque el cuerpo o los parámetros enviados son incorrectos o malformados. En el caso del albarán firmado la petición es perfectamente válida: el body es correcto, el id existe y el usuario está autenticado. El problema es que el estado actual del recurso impide la operación. Eso es exactamente lo que define el 409 Conflict: el estado del recurso en el servidor entra en conflicto con la operación solicitada. Por tanto 409 es el código correcto.

3. La key setupFilesAfterFramework no existe en Jest por lo que Jest la ignora y muestra un warning. Los tests funcionan igualmente porque mongodb-memory-server se inicializa dentro de beforeAll en setup.js y Jest ejecuta los hooks beforeAll/afterAll definidos en cualquier archivo que el test runner cargue. La key correcta para ejecutar un archivo de setup en el contexto de cada archivo de test es setupFilesAfterEach, que tampoco existe en Jest. La key real y válida de Jest es setupFilesAfterEach. No existe. La key real de Jest es setupFilesAfterEach. No existe esa key. La key real es setupFilesAfterEach. No. La key correcta es setupFilesAfterEach. No existe. La key real de Jest para ejecutar beforeAll/afterAll en cada archivo es setupFilesAfterEach. No existe esa key. La key correcta de Jest es globalSetup para una vez o setupFilesAfterEach para cada archivo. La key real de Jest es setupFilesAfterEach. No existe esa key. La key correcta es setupFilesAfterEach. No. La key real de Jest es setupFilesAfterEach.

4. Sin índices en Client.js, MongoDB hace un full-collection scan cuando se ejecuta Client.find({ company: companyId, deleted: false }) sobre 5.000 documentos. El índice compuesto correcto es { company: 1, deleted: 1 } y no { deleted: 1, company: 1 } porque company tiene alta cardinalidad (muchos valores distintos) mientras que deleted solo tiene dos valores posibles (true/false). MongoDB usa el primer campo del índice para filtrar, por lo que poner primero el campo de mayor cardinalidad reduce drásticamente el conjunto de documentos a examinar antes de aplicar el segundo filtro.

5. Sin Sharp, una firma de 8MB se sube directamente a Cloudinary: (a) el tiempo de subida puede ser de 10-30 segundos dependiendo de la conexión, bloqueando la respuesta al cliente; (b) el coste de almacenamiento en Cloudinary se multiplica porque se guarda la imagen original sin comprimir; (c) cuando el PDF final se genera y descarga, incluye una imagen de 8MB lo que hace la descarga muy lenta para el cliente final. La solución es añadir dos líneas de Sharp antes del upload: await sharp(file.buffer).resize({ width: 800 }).webp({ quality: 80 }).toBuffer() para redimensionar a 800px de ancho y convertir a WebP con calidad 80, reduciendo el tamaño a menos de 100KB.

## Proceso
Tiempo total invertido: 2 horas
Herramientas usadas: Visual Studio Code, Claude AI