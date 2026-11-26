// Importo el modelo
const Post = require("../models/Post");


// GET /api/posts - Obtengo todos los posts
async function getPosts(req, res, next) {
  try {
    // Busca todos los posts y muestra primero los más recientes.
    const posts = await Post.find().sort({ createdAt: -1 });
    // Devuelve todos los posts.
    res.status(200).json(posts);
  } catch (err) {
    // Si hay algún error, lo envía
    next(err);
  }
}

// GET /api/posts/:id  -> Obtengo un post por su identificador, un post en concreto
async function getPost(req, res, next) {
  try {
    // Busca el post usando el ID que llega en la URL.
    const post = await Post.findById(req.params.id);
    if (!post) {
    // Si no existe, devuelve un error 404.
      return res.status(404).json({ mensaje: "Post no encontrado" });
    }
    // Si existe, se devuelve el post encontrado en formato JSON
    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
}

// POST /api/posts - Crear un nuevo post
async function createPost(req, res, next) {
  try {
    // Recoge los datos enviados y crea un nuevo post
    const nuevo = await Post.create(req.body);
    // Devuelve el post creado.
    // 201 indica que se ha creado un documento nuevo
    res.status(201).json(nuevo);
  } catch (err) {
    next(err);
  }
}

// PUT /api/posts/:id - Actualizar un post
async function updatePost(req, res, next) {
  try {
    // Busca el post por su ID y actualiza sus datos.
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      // new devuelve el post que se ha actualizado y lo devuelve. Tambien compruebo que los datos estan bien
      new: true,
      runValidators: true
    });

    if (!post) {
    // Si no encuentra el post, devuelve un error 404.
      return res.status(404).json({ mensaje: "Post no encontrado" });
    }

    // Devuelve el post actualizado.
    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/posts/:id  - eliminamos un post
async function deletePost(req, res, next) {
  try {
    // Busca el post por su ID y lo elimina.
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ mensaje: "Post no encontrado" });
    }

    // Si no existe, devuelve un error 404.Confirma que el post se ha eliminado.
    res.status(200).json({ mensaje: "Post eliminado", id: req.params.id });
  } catch (err) {
    next(err);
  }
}

// Exporta cada función por separado para poder utilizarla en otros archivos.
module.exports = {
  getPosts,    // Exporta la función para obtener todos los posts.
  getPost,     // Exporta la función para obtener un post por su ID.
  createPost,  // Exporta la función para crear un post.
  updatePost,  // Exporta la función para actualizar un post.
  deletePost   // Exporta la función para eliminar un post.
};
