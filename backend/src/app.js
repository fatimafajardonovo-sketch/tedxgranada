// Comprueba las rutas de la api, tanto de posts como de events

const express = require("express");
const postRoutes = require("./routes/post.routes");
const eventRoutes = require("./routes/event.routes");
// Importa los middlewares que gestionan los errores
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

// Crea la app de express
const app = express();

// Permite recibir y leer datos en formato JSON en las peticiones
app.use(express.json());

// Ruta raíz sencilla para confirmar que la API está respondiendo.
app.get("/", (req, res) => {
  res.json({ mensaje: "API REST de TEDxGranada" });
});

// Conecta las rutas de los posts con la dirección /api/posts  y api/events
app.use("/api/posts", postRoutes);
app.use("/api/events", eventRoutes);

// Comprueba si la ruta solicitada no existe y devuelve un error 404
app.use(notFound);

app.use(errorHandler);

module.exports = app;
