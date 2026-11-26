# TEDxGranada · Base de datos (PEC 2) y API REST (PEC 3)

Proyecto de base de datos MongoDB Atlas y API REST para TEDxGranada.
Asignatura: Desarrollo Web Fullstack (CEI).

## Descripción

El repositorio contiene el modelo de datos y los documentos de ejemplo de la PEC 2, además de un backend para consultar y gestionar las colecciones `posts` y `events` mediante Node.js, Express y Mongoose.

## Base de datos de la PEC 2

| Colección | Descripción | Documentos de ejemplo |
|---|---|---:|
| `users` | Equipo, voluntarios, ponentes, artistas y patrocinadores | 225 |
| `events` | Ediciones y sesiones TEDxGranada, TEDxRealejo, TEDxGranadaSalon y TEDxYouth | 13 |
| `posts` | Entradas del blog | 32 |

### Relaciones

- `events.creadoPor` → `users`
- `events.ponentes.usuario`, `events.patrocinadores.usuario`, `events.equipo.usuario` y `events.programa.ponentes` → `users`
- `posts.autor` → `users`
- `posts.evento` → `events`

### Índices únicos

- `users.email`
- `events.slug`
- `posts.slug`

Los detalles de campos y relaciones están en `schemas/`; los documentos JSON están en `data/`.

### Estructura del repositorio

```text
data/          Documentos de ejemplo (users, events y posts)
schemas/       Descripción de campos y relaciones
seed.js        Importador de datos para MongoDB Atlas
backend/       API REST Node.js, Express y Mongoose
```

## API de la PEC 3

La API está en `backend/`. Sus responsabilidades están separadas:

```text
backend/
├── src/
│   ├── config/db.js
│   ├── models/                 User.js, Post.js, Event.js
│   ├── controllers/            controladores de posts y eventos
│   ├── routes/                 rutas de posts y eventos
│   ├── middlewares/            404 y gestor central de errores
│   └── app.js                  configuración de Express
├── server.js                   conexión y arranque local
├── requests.http               pruebas con REST Client
├── tedxgranada-api.postman.json colección para Postman/Thunder Client
├── .env.example
└── package.json
```

### Modelos

- `User`: representa la colección existente `users` y se usa también en las referencias desde posts y eventos. No se expone un CRUD de usuarios.
- `Post`: representa una entrada del blog; referencia a su autor (`User`) y puede referenciar al evento relacionado (`Event`).
- `Event`: representa una edición de TEDxGranada, con lugar, ponentes, programa, patrocinadores y equipo.

### Endpoints

| Método | Ruta | Acción |
|---|---|---|
| GET | `/` | Comprueba que la API responde |
| GET | `/api/posts` | Lista los posts |
| GET | `/api/posts/:id` | Obtiene un post por ID |
| POST | `/api/posts` | Crea un post |
| PUT | `/api/posts/:id` | Actualiza un post |
| DELETE | `/api/posts/:id` | Elimina un post |
| GET | `/api/events` | Lista los eventos |
| GET | `/api/events/:id` | Obtiene un evento por ID |
| POST | `/api/events` | Crea un evento |
| PUT | `/api/events/:id` | Actualiza un evento |
| DELETE | `/api/events/:id` | Elimina un evento |

Las respuestas correctas devuelven los documentos o arrays en JSON. Los errores generales y las rutas inexistentes usan `{ "error": "...", "mensaje": "..." }`; si no existe un post o evento solicitado, la respuesta incluye `{ "mensaje": "..." }`. Un ID con formato inválido devuelve 400; un documento inexistente devuelve 404; un valor único duplicado devuelve 409.

### Diagrama del flujo

```mermaid
flowchart LR
    Cliente[REST Client o Postman] --> App[Express app]
    App --> Routes[Rutas /api/posts y /api/events]
    Routes --> Controllers[Controladores]
    Controllers --> Models[Modelos Mongoose]
    Models --> Atlas[(MongoDB Atlas)]
    App --> NotFound[Middleware 404]
    App --> Errors[Middleware central de errores]
```

## Instalación y ejecución local de la API

Requiere Node.js 18 o posterior.

En PowerShell, desde la raíz del repositorio:

```powershell
cd backend
npm.cmd install
Copy-Item .env.example .env
```

Edita `backend/.env` y añade la URI de tu clúster:

```dotenv
MONGODB_URI=mongodb+srv://USUARIO:CONTRASENA@cluster0.xxxxx.mongodb.net/tedxgranada
```

No escribas credenciales reales en el código ni las subas al repositorio. El `.gitignore` de la raíz excluye `.env` y `node_modules`.

Desde la carpeta `backend`, inicia la API:

```powershell
npm.cmd start
```

El servidor espera a que la conexión con Atlas esté establecida y escucha en `http://localhost:4000` por defecto. Se puede cambiar el puerto con la variable opcional `PORT`.

## Pruebas

1. Deja el servidor ejecutándose en una terminal.
2. Abre `backend/requests.http` en VS Code con la extensión REST Client, o importa `backend/tedxgranada-api.postman.json` en Postman o Thunder Client.
3. La colección de peticiones está preparada para `http://localhost:4000`. Para probar un despliegue, cambia la variable `base` por la URL asignada por Vercel.

Las operaciones POST, PUT y DELETE escriben en la base configurada. Ejecuta las pruebas con datos temporales y completa cada flujo de creación, consulta, actualización y eliminación. El identificador de autor de ejemplo debe existir en la colección `users` de Atlas.

## Variables de entorno

| Variable | Obligatoria | Uso |
|---|---|---|
| `MONGODB_URI` | Sí | Cadena de conexión a MongoDB Atlas |
| `PORT` | No | Puerto local de Express; por defecto `4000` |

Hay plantillas `.env.example` en la raíz y en `backend/`: la de la raíz se utiliza con el importador de la PEC 2; la de `backend/`, con la API. Configura los archivos `.env` locales correspondientes sin compartirlos.

## Importar los datos de la PEC 2

Desde la raíz, instala las dependencias, configura `.env` a partir de `.env.example` y ejecuta:

```powershell
npm.cmd install
Copy-Item .env.example .env
node seed.js
```

El importador convierte los identificadores y fechas del JSON al formato MongoDB y crea los índices únicos descritos arriba. **Advertencia:** elimina los documentos existentes de `users`, `events` y `posts` antes de insertar los datos de ejemplo. No lo ejecutes sobre datos que quieras conservar; no afecta a otras colecciones.

## Despliegue en Vercel

La aplicación Express exportada en `backend/server.js` está desplegada en Vercel. Según la [documentación de Express en Vercel](https://vercel.com/docs/frameworks/backend/express), Express puede desplegarse sin configuración adicional cuando Vercel detecta la aplicación.

**URL base:** <https://tedxgranada.vercel.app/>

Endpoints públicos:

- Posts: <https://tedxgranada.vercel.app/api/posts>
- Eventos: <https://tedxgranada.vercel.app/api/events>

Se comprobó que ambos endpoints GET responden con registros en JSON.

Para configurar futuros despliegues:

1. Configura `backend` como **Root Directory**.
2. Añade `MONGODB_URI` a las variables de entorno de Vercel para los entornos que vayas a utilizar.
3. Comprueba en MongoDB Atlas que la configuración de acceso de red permite la conexión desde el despliegue.
4. Despliega y comprueba la URL pública con `/`, `/api/posts` y `/api/events`.

## Notas de seguridad y datos

- Los emails del dataset son ficticios (`@example.com`) y las contraseñas de ejemplo están almacenadas como hashes bcrypt.
- Algunos ponentes, precios, programas y emails se marcan como datos de ejemplo en los documentos.
- Los archivos `.env` reales no se incluyen en el repositorio.
