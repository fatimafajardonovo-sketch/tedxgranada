const mongoose = require("mongoose");
const logger = require("./logger");
const debug = require("debug")("tedxgranada:db");

// Conecta a MongoDB Atlas. Reutiliza la conexión si ya está abierta
let connectionPromise;

async function connectDB(uri) {
  // Sin la URI no es posible saber a qué clúster conectarse.
  const connectionUri = typeof uri === "string" ? uri.trim() : "";
  if (!connectionUri) {
    throw new Error("Falta la variable de entorno MONGODB_URI");
  }

  // Si Mongoose ya está conectado, reutilizamos la conexión existente.
  if (mongoose.connection.readyState === 1) {
    debug("Reutilizando conexión existente");
    return mongoose.connection;
  }

  // Comparte la promesa mientras la conexión inicial todavía está en curso.
  if (!connectionPromise) {
    debug("Abriendo conexión con MongoDB");
    mongoose.set("strictQuery", true);
    connectionPromise = mongoose
      .connect(connectionUri)
      .then(() => {
        logger.info("Conectado a MongoDB Atlas");
        return mongoose.connection;
      })
      .catch((err) => {
        connectionPromise = undefined;
        throw err;
      });
  }

  return connectionPromise;
}

module.exports = connectDB;
