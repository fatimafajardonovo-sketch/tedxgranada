// Importamos mongoose

const mongoose = require("mongoose");

// Creamos un esquema nuevo.
const postSchema = new mongoose.Schema(
  {
    // Título que se muestra como encabezado de la entrada.
    titulo: {
      type: String,
      required: [true, "El título es obligatorio."],
      trim: true
    },
    // Identificador legible que puede usarse en la URL del post.
    slug: {
      type: String,
      required: [true, "El slug es obligatorio."],
      unique: true,
      trim: true,
      lowercase: true
    },
    // Texto completo de la entrada, que puede contener Markdown.
    contenido: {
      type: String,
      required: [true, "El contenido es obligatorio."]
    },
    // Campos opcionales que ayudan a mostrar y clasificar la entrada.
    extracto: { type: String, trim: true },
    imagen: { type: String, trim: true },
    categoria: {
      type: String,
      required: [true, "La categoría es obligatoria."],
      enum: [
        "anuncio",
        "entrevista",
        "consejos",
        "recomendaciones",
        "divulgacion",
        "ponentes",
        "resumen",
        "patrocinadores"
      ]
    },
    // Array de etiquetas. Si no se indican, se guarda como array vacío.
    etiquetas: {
      type: [String],
      default: []
    },
    // La fecha de publicación puede ser distinta de la fecha de creación.
    fechaPublicacion: {
      type: Date,
      required: [true, "La fecha de publicación es obligatoria."]
    },
    // Permite marcar la entrada como borrador o publicación visible.
    publicado: {
      type: Boolean,
      default: true
    },
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El autor es obligatorio."]
    },
    // Referencia opcional al evento del que trata la entrada.
    evento: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event"
    }
  },
  {
    // Añade createdAt automáticamente, pero no updatedAt, como en la PEC 2.
    timestamps: { createdAt: true, updatedAt: false },
    // Usa el nombre exacto de la colección existente en Atlas.
    collection: "posts"
  }
);

module.exports = mongoose.models.Post || mongoose.model("Post", postSchema);
