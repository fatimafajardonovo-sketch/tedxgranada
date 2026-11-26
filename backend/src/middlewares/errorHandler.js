// Este middleware se encarga de gestionar los errores que pueda generar la API

const logger = require("../config/logger");

function errorHandler(err, req, res, next) {
  if (res.headersSent) {   // Comprueba si la respuesta ya se ha enviado
    return next(err); // Si ya se ha enviado, pasa el error a Express
  }
  logger.error("Error procesando solicitud", {
    name: err.name,
    message: err.message,
    method: req.method,
    path: req.path,
    stack: err.stack
  });

  // Comprueba si el ID de MongoDB tiene un formato incorrecto
  if (err.name === "CastError") {
    return res.status(400).json({
      error: "Bad Request",
      mensaje: "ID no válido."
    });
  }

  // Comprueba si hay algún error en los datos introducidos
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation Error",
      mensaje: err.message
    });
  }

  // Comprueba si el JSON enviado en la petición tiene un formato incorrecto
  if (err instanceof SyntaxError && err.status === 400) {
    return res.status(400).json({
      error: "Bad Request",
      mensaje: "El cuerpo de la petición contiene JSON no válido."
    });
  }

  // Comprueba si ya existe un registro con un valor que debe ser único
  if (err.code === 11000) {
    return res.status(409).json({
      error: "Conflict",
      mensaje: "Ya existe un registro con ese valor único."
    });
  }

  // Si no coincide con ningún error anterior, devuelve un error general
  res.status(err.status || 500).json({
    error: "Internal Server Error",
    mensaje: err.message || "Ha ocurrido un error inesperado."
  });
}

// Exporta el middleware para poder utilizarlo en otros archivos.
module.exports = errorHandler;
