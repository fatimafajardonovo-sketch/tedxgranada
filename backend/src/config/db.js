const mongoose = require("mongoose");

// Conecta a MongoDB Atlas. Reutiliza la conexión si ya está abierta

async function connectDB(uri) {
  // Sin la URI no es posible saber a qué clúster conectarse.
  if (!uri) {
    throw new Error("Falta la variable de entorno MONGODB_URI");
  }

  // Si Mongoose ya tiene una conexión iniciada, la reutilizamos en vez de intentar abrir otra.
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  mongoose.set("strictQuery", true);
  // Esperamos a que se conecte; si falla, Mongoose lanza el error al llamador.
  await mongoose.connect(uri);
  console.log("Conectado a MongoDB Atlas");

  return mongoose.connection;
}

module.exports = connectDB;
