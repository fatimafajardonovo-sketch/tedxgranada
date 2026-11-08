# TEDxGranada · Base de datos (PEC 2)

Base de datos MongoDB Atlas del proyecto de rediseño de la web de TEDxGranada.
Asignatura: Desarrollo Web Fullstack (CEI) 

## Descripción

Este repositorio contiene el modelo de datos y los datos de prueba del proyecto, junto con el script que los carga en MongoDB Atlas.

## Colecciones

| Colección | Descripción | Documentos |
|---|---|---|
| `users` | Equipo, voluntarios, ponentes, artistas y patrocinadores (campo `rol`) | [225] |
| `events` | Ediciones de TEDxGranada, TEDxRealejo, TEDxGranadaSalon y TEDxYouth | [13] |
| `posts` | Entradas del blog | [32] |

### Relaciones (por `_id`, ObjectId)

- `events.creadoPor` → `users`
- `events.ponentes.usuario`, `events.patrocinadores.usuario`, `events.equipo.usuario`, `events.programa.ponentes` → `users`
- `posts.autor` → `users`
- `posts.evento` → `events`

### Índices únicos

- `users.email`
- `events.slug`
- `posts.slug`

## Estructura del repositorio

```
├── data/        Datos de ejemplo (users_data.json, events_data.json, posts_data.json)
├── schemas/     Descripción de campos, tipos y relaciones (users.json, events.json, posts.json)
├── seed.js      Script de importación a MongoDB Atlas
├── .env.example Plantilla de variables de entorno
└── package.json
```

## Cómo ejecutarlo

1. Clona el repositorio e instala las dependencias:
   ```bash
   npm install
   ```
2. Copia `.env.example` a `.env` y pon tu connection string de Atlas
   (el nombre de la base de datos debe ir antes del `?`):
   ```
   MONGODB_URI=mongodb+srv://USUARIO:PASSWORD@cluster0.xxxxx.mongodb.net/tedxgranada
   ```
3. Carga los datos:
   ```bash
   node seed.js
   ```
   El script convierte los `_id`, las referencias y las fechas a `ObjectId` y `Date`, vacía las colecciones antes de insertar (se puede repetir sin duplicar) y crea los índices únicos.

## Notas

- Los emails son ficticios (`@example.com`) y las contraseñas están hasheadas con bcrypt.
- Algunos datos (ponentes de TEDxGranada 2023 y 2026, precios, programas y emails) son de ejemplo y están marcados como tales en los propios documentos.
- El archivo `.env` no se incluye en el repositorio por seguridad.