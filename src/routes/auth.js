import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Inscription
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis.' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'Utilisateur créé.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Connexion
// Cette route ne doit PAS être utilisée pour l'admin ! L'admin passe par le backend Python.
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: 'Identifiants invalides.' });
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Identifiants invalides.' });
//     }
//     const token = jwt.sign(
//       { userId: user._id, isAdmin: user.isAdmin },
//       process.env.JWT_SECRET,
//       { expiresIn: '24h' }
//     );
//     res.json({ token });
//   } catch (err) {
//     res.status(500).json({ message: 'Erreur serveur.' });
//   }
// });

// // Connexion admin (pour compatibilité avec l'API Python)
// // Cette route n'est pas utilisée, l'admin passe par le backend Python uniquement.
// router.post('/admin-login', async (req, res) => {
//   // ... code supprimé ou commenté ...
// });

export default router; 