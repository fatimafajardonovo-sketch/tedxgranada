const mongoose = require("mongoose");

// Conecta a MongoDB Atlas. Reutiliza la conexión si ya está abierta

async function connectDB(uri) {
  if (!uri) { // Espera a que se establezca la conexión; si falla, lanza un error.
    throw new Error("Falta la variable de entorno MONGODB_URI");
  }

  if (mongoose.connection.readyState >= 1) { // Si Mongoose ya está conectado o conectando, reutiliza la conexión.
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri); // hasta que la conexión no termina la función no continúa hasta conectar o hasta que se produzca un error.
  console.log("Conectado a MongoDB Atlas");

  return mongoose.connection;
}

module.exports = connectDB;
