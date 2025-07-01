import express from 'express';
import User from '../models/User.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Middleware pour vérifier si l'utilisateur est admin
function isAdmin(req, res, next) {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Accès réservé aux administrateurs.' });
  }
  next();
}

// Lister tous les utilisateurs (infos réduites)
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, 'email isAdmin');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Supprimer un utilisateur par son id
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    res.json({ message: 'Utilisateur supprimé.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Voir les infos privées d'un utilisateur (admin seulement)
router.get('/:id', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id, '-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

export default router; 