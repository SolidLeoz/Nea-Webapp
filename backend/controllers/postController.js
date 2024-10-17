const Post = require('../models/Post');

// Crea un nuovo post
exports.createPost = async (req, res) => {
  console.error('Inizio createPost controller');
  try {
    console.error('Dati ricevuti:', req.body);
    const { title, content } = req.body;
    
    if (!req.user) {
      console.error('Utente non trovato in req.user');
      return res.status(401).json({ message: 'Utente non autenticato' });
    }
    
    console.error('Creazione nuovo post...');
    const newPost = new Post({
      title,
      content,
      author: req.user._id
    });
    
    console.error('Salvataggio post nel database...');
    await newPost.save();
    
    console.error('Post creato con successo');
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Errore durante la creazione del post:', error);
    res.status(400).json({ message: error.message });
  }
};

// Aggiorna un post esistente
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(id, { title, content }, { new: true });
    if (!updatedPost) {
      return res.status(404).json({ message: 'Post non trovato' });
    }
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Elimina un post
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ message: 'Post non trovato' });
    }
    res.json({ message: 'Post eliminato con successo' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Ottieni tutti i post
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ottieni un post specifico per ID
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post non trovato' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
