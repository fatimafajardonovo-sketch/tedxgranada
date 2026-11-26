// Comprueba las rutas de la api, tanto de posts como de events

const express = require("express");
const helmet = require("helmet");
const postRoutes = require("./routes/post.routes");
const eventRoutes = require("./routes/event.routes");
const connectDB = require("./config/db");
const debug = require("debug")("tedxgranada:app");
// Importa los middlewares que gestionan los errores
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

// Crea la app de express
const app = express();

app.use(helmet());

async function ensureDatabaseConnection(req, res, next) {
  try {
    debug("Comprobando conexión para %s", req.baseUrl);
    await connectDB(process.env.MONGODB_URI);
    next();
  } catch (err) {
    next(err);
  }
}

// Permite recibir y leer datos en formato JSON en las peticiones.
app.use(express.json());

// Ruta raíz sencilla para confirmar que la API está respondiendo.
app.get("/", (req, res) => {
  res.status(200).json({ mensaje: "API REST de TEDxGranada" });
});

// Conecta las rutas de los posts con la dirección /api/posts  y api/events
app.use("/api/posts", ensureDatabaseConnection, postRoutes);
app.use("/api/events", ensureDatabaseConnection, eventRoutes);

// Comprueba si la ruta solicitada no existe y devuelve un error 404
app.use(notFound);

app.use(errorHandler);

module.exports = app;
