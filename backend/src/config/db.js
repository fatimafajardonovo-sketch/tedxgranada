const mongoose = require("mongoose");

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
    return mongoose.connection;
  }

  // Comparte la promesa mientras la conexión inicial todavía está en curso.
  if (!connectionPromise) {
    mongoose.set("strictQuery", true);
    connectionPromise = mongoose
      .connect(connectionUri)
      .then(() => {
        console.log("Conectado a MongoDB Atlas");
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
