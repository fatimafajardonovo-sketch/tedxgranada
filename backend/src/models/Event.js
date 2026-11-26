// Importamos mongoose
const mongoose = require("mongoose");

// Atajo para declarar campos que guardan identificadores de MongoDB.
const { ObjectId } = mongoose.Schema.Types;

// _id: false evita que Mongoose añada identificadores a estos objetos

// El lugar se guarda dentro del documento del evento, no en otra colección.
const lugarSchema = new mongoose.Schema(
  {
    // Nombre del recinto, obligatorio; el resto de datos son opcionales.
    nombre: {
      type: String,
      required: [true, "El nombre del lugar es obligatorio."]
    },
    direccion: String,
    ciudad: { type: String, default: "Granada" },
    mapaUrl: String
  },
  { _id: false }
);

// Participación de una persona en la edición. Los datos personales se
// conservan en users y aquí se guarda una referencia a ese usuario.
const ponenteSchema = new mongoose.Schema(
  {
    usuario: {
      type: ObjectId,
      ref: "User",
      required: [true, "El usuario ponente es obligatorio."]
    },
    participacion: {
      type: String,
      required: [true, "El tipo de participación es obligatorio."],
      enum: ["ponente", "artista", "tallerista", "invitado"]
    },
    titulo: String,
    urlVideo: String,
    perfil: { type: String, enum: ["joven", "adulto"] },
    ganadorConcurso: { type: Boolean, default: false }
  },
  { _id: false }
);

// Cada edición puede tener varios bloques ordenados en su programa.
const programaSchema = new mongoose.Schema(
  {
    orden: {
      type: Number,
      required: [true, "El orden del bloque es obligatorio."]
    },
    titulo: {
      type: String,
      required: [true, "El título del bloque es obligatorio."]
    },
    tipo: {
      type: String,
      required: [true, "El tipo de bloque es obligatorio."],
      enum: [
        "apertura",
        "presentacion",
        "charla",
        "proyeccion",
        "debate",
        "mesa_redonda",
        "taller",
        "actuacion",
        "descanso",
        "comida",
        "networking",
        "cierre",
        "otro"
      ]
    },
    fecha: Date,
    horaInicio: String,
    duracionMinutos: Number,
    ponentes: [{ type: ObjectId, ref: "User" }]
  },
  { _id: false }
);

// El patrocinador se referencia a un User y puede tener un nivel asignado.
const patrocinadorSchema = new mongoose.Schema(
  {
    usuario: {
      type: ObjectId,
      ref: "User",
      required: [true, "El usuario patrocinador es obligatorio."]
    },
    nivel: {
      type: String,
      enum: ["principal", "oro", "plata", "bronce", "colaborador"]
    }
  },
  { _id: false }
);

// Miembro del equipo de una edición; usuario referencia a la colección users.
const equipoSchema = new mongoose.Schema(
  {
    usuario: {
      type: ObjectId,
      ref: "User",
      required: [true, "El usuario del equipo es obligatorio."]
    },
    area: String,
    funcion: String
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    // Nombre visible de la edición y slug utilizado para identificarla en URL.
    nombre: {
      type: String,
      required: [true, "El nombre del evento es obligatorio."],
      trim: true
    },
    slug: {
      type: String,
      required: [true, "El slug es obligatorio."],
      unique: true,
      trim: true,
      lowercase: true
    },
    // Marca, formato y año de la edición. Los enum limitan los valores
    // permitidos a las opciones definidas en el esquema de la PEC 2.
    marca: {
      type: String,
      enum: ["TEDxGranada", "TEDxRealejo"],
      default: "TEDxGranada"
    },
    tipo: {
      type: String,
      required: [true, "El tipo de evento es obligatorio."],
      enum: ["principal", "salon", "youth"]
    },
    anio: {
      type: Number,
      required: [true, "El año del evento es obligatorio."]
    },
    // Tema y explicación de la edición.
    tematica: {
      type: String,
      required: [true, "La temática es obligatoria."]
    },
    descripcion: {
      type: String,
      required: [true, "La descripción es obligatoria."]
    },
    // Si no se indica estado, Mongoose lo establece como próximo.
    estado: {
      type: String,
      enum: ["proximo", "celebrado", "cancelado"],
      default: "proximo"
    },
    // Fecha, hora y lugar de celebración.
    fecha: Date,
    horaInicio: String,
    lugar: {
      type: lugarSchema,
      required: [true, "El lugar del evento es obligatorio."]
    },
    // Enlaces y datos de acceso opcionales asociados a la edición.
    imagenPortada: String,
    urlEntradas: String,
    precioEntrada: { type: Number, min: 0 },
    condicionesEntrada: String,
    emailContacto: String,
    urlPlaylistYoutube: String,
    urlFotos: String,
    // Listas de subdocumentos. Se inicializan vacías cuando no se proporcionan.
    ponentes: {
      type: [ponenteSchema],
      default: []
    },
    programa: {
      type: [programaSchema],
      default: []
    },
    patrocinadores: {
      type: [patrocinadorSchema],
      default: []
    },
    equipo: {
      type: [equipoSchema],
      default: []
    },
    // Usuario que creó el evento; puede no estar indicado.
    creadoPor: {
      type: ObjectId,
      ref: "User"
    }
  },
  {
    // Añade createdAt automáticamente sin añadir updatedAt, como en la PEC 2.
    timestamps: { createdAt: true, updatedAt: false },
    // Mantiene el nombre de la colección existente en Atlas.
    collection: "events"
  }
);

// Registramos el modelo o reutilizamos el ya existente para evitar compilarlo
// dos veces durante recargas del servidor.
module.exports = mongoose.models.Event || mongoose.model("Event", eventSchema);
