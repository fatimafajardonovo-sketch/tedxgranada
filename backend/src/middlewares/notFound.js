 // Middleware que se encarga de gestionar las rutas que no existen.

function notFound(req, res) {
  res.status(404).json({   // Devuelve un error 404, indica que la ruta solicitada no se ha encontrado
    error: "Not Found",
    mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
}
// Exporta el middleware para poder utilizarlo en otros archivos.
module.exports = notFound;
