const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/event.controller");
const notFound = require("../middlewares/notFound");
const errorHandler = require("../middlewares/errorHandler");

router.get("/", ctrl.getEvents); // GET: Obtiene todos los eventos
router.get("/:id", ctrl.getEvent); // GET: Obtiene un evento por su ID
router.post("/", ctrl.createEvent); // POST: Crea un nuevo evento.
router.put("/:id", ctrl.updateEvent);  // PUT: Actualiza un evento por su ID.
router.delete("/:id", ctrl.deleteEvent); // DELETE: Elimina un evento por su ID.

router.use(notFound);
router.use(errorHandler);

module.exports = router;
