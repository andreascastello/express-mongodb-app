import express from 'express';
import Post from '../models/Post.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Créer un post
router.post('/', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = new Post({
      title,
      content,
      author: req.user.userId
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Récupérer tous les posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'email');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Supprimer un post (seulement admin ou auteur)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post non trouvé.' });
    if (post.author.toString() !== req.user.userId && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Non autorisé.' });
    }
    await post.deleteOne();
    res.json({ message: 'Post supprimé.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

export default router; 