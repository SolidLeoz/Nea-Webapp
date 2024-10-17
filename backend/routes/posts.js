const express = require('express');
const router = express.Router();
const { createPost, updatePost, deletePost, getAllPosts, getPostById } = require('../controllers/postController');
const { isAdmin } = require('../middleware/authMiddleware');

// Rotte pubbliche
router.get('/', getAllPosts);
router.get('/:id', getPostById);

// Rotte protette (solo per admin)
router.post('/', isAdmin, createPost);
router.put('/:id', isAdmin, updatePost);
router.delete('/:id', isAdmin, deletePost);

module.exports = router;
