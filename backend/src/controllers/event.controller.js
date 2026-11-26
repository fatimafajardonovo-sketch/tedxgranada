// Importa el modelo de eventos
const Event = require("../models/Event");

// GET /api/events - Obtengo todos todos los eventos
async function getEvents(req, res, next) {
  try {
    const events = await Event.find().sort({ createdAt: -1 }); // Busca todos los eventos y muestra primero los recientes
    res.status(200).json(events); // Devuelve todos los eventos
  } 
  catch (err) {next(err);}} //Si hay algun error lo envio


// GET /api/events/:id  - Obtengo un evento concreto, en este caso por su id
async function getEvent(req, res, next) {
  try {
    const event = await Event.findById(req.params.id); // Busca el evento usando el ID de la URL.
    if (!event) {
      return res.status(404).json({ mensaje: "Evento no encontrado" }); // Si no existe, devuelve un error 404
    }
    res.status(200).json(event); // Devuelve el evento encontrado.
    } 
  catch (err) {next(err);}} //Si hay algun error lo envio


// POST /api/events - Crear un nuevo evento
async function createEvent(req, res, next) {
  try {
    const nuevo = await Event.create(req.body); // Recoge los datos enviados y crea un nuevo evento.
    res.status(201).json(nuevo); // Devuelve el evento creado.
  }
  catch (err) {next(err);}} //Si hay algun error lo envio


// PUT /api/events/:id - Actualizar un evento
async function updateEvent(req, res, next) {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true // Comprueba que los datos sean correctos
    });

    if (!event) {
      return res.status(404).json({ mensaje: "Evento no encontrado" });
    }
    res.status(200).json(event);// Devuelve el evento actualizado.
  }
  catch (err) {next(err);}} //Si hay algun error lo envio


// DELETE /api/events/:id  - elimino un evento por su ID
async function deleteEvent(req, res, next) {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ mensaje: "Evento no encontrado" });
    }
    res.status(200).json({ mensaje: "Evento eliminado", id: req.params.id });
  }
  catch (err) {next(err);}} //Si hay algun error lo envio


// Exporta cada función para poder utilizarla en otros archivos.
module.exports = {
  getEvents,   // Exporta la función para obtener todos los eventos.
  getEvent,    // Exporta la función para obtener un evento por su ID.
  createEvent, // Exporta la función para crear un evento.
  updateEvent, // Exporta la función para actualizar un evento.
  deleteEvent  // Exporta la función para eliminar un evento.
};