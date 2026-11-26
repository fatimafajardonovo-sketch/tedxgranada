// Punto de entrada de la APIm, se conecta a MongoDB y arranca el servidor.
// En Vercel se exporta la aplicación Express sin abrir otro servidor.
const path = require("node:path"); // Importa la herramienta para trabajar con rutas de archivos.
require("dotenv").config({ path: path.join(__dirname, ".env") });  // Carga las variables de configuración del archivo .env.

const logger = require("./src/config/logger");
const debug = require("debug")("tedxgranada:server");
const app = require("./src/app"); // Importa la aplicación Express con sus rutas y middlewares.
const connectDB = require("./src/config/db"); // Importa la función que conecta con MongoDB.

// Inicia la conexión con MongoDB utilizando la dirección guardada en las variables de entorno.
debug("Iniciando conexión de base de datos para el servidor");
const dbConnection = connectDB(process.env.MONGODB_URI);

// Comprueba si hay algún error al conectar con MongoDB
dbConnection.catch((err) => {
  logger.error("Error de conexión a MongoDB", { message: err.message });
});

// Comprueba si este archivo se está ejecutando directamente
if (require.main === module) {
  const PORT = process.env.PORT || 4000; // Establece el puerto del servidor, utilizando el 4000 si no hay otro configurado

  // Espera a que MongoDB esté conectado antes de iniciar el servidor.
  dbConnection
    .then(() => {
      app.listen(PORT, () => { // Inicia el servidor Express en el puerto indicado
        logger.info("API escuchando", { url: `http://localhost:${PORT}` });
      });
    })
    .catch(() => {
      process.exitCode = 1; // Indica que la aplicación no ha podido iniciarse correctamente
    });
}

// Exporta la aplicación para que pueda utilizarse en Vercel
module.exports = app;
