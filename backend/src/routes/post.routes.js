const express = require("express"); // Importamos express para crear las rutas
const router = express.Router(); // Crea un router para organizar las rutas de los posts.
const ctrl = require("../controllers/post.controller");  // Importa las funciones del controlador de posts.
const notFound = require("../middlewares/notFound");
const errorHandler = require("../middlewares/errorHandler");

// Las rutas solo conectan cada endpoint con su función del controlador.
router.get("/", ctrl.getPosts);  // GET: Obtiene todos los posts
router.get("/:id", ctrl.getPost); // GET: Obtiene todos los posts por su id
router.post("/", ctrl.createPost); // POST; crea un nuevo post
router.put("/:id", ctrl.updatePost); // PUT: Actualiza un post por su id
router.delete("/:id", ctrl.deletePost); // DELETE: Elimina un post por su id

router.use(notFound);
router.use(errorHandler);

module.exports = router;
