// Importamos mongoose
const mongoose = require("mongoose");

// Este esquema sigue los campos definidos para la colección users de la PEC 2.
const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio."],
      trim: true
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "El email no es válido."]
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria."],
      // Evita incluir el hash en consultas normales; no cifra la contraseña.
      select: false
    },
    rol: {
      type: String,
      required: [true, "El rol es obligatorio."],
      enum: [
        "organizador",
        "marketing",
        "diseño",
        "voluntario",
        "ponente",
        "patrocinador"
      ]
    },
    bio: { type: String, trim: true },
    organizacion: { type: String, trim: true },
    foto: { type: String, trim: true },
    web: { type: String, trim: true },
    activo: {
      type: Boolean,
      default: true
    }
  },
  {
    // Guarda createdAt como en el esquema de PEC 2, sin añadir updatedAt.
    timestamps: { createdAt: true, updatedAt: false },
    collection: "users"
  }
);

// Reutiliza el modelo si ya fue registrado, por ejemplo durante recargas.
module.exports =
  mongoose.models.User || mongoose.model("User", userSchema);
