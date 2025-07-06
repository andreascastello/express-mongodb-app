import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token manquant.' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Compatibilité avec les tokens de l'API Python
    if (decoded.data && decoded.data[0] && decoded.data[0].email) {
      // Token de l'API Python - considérer comme admin
      req.user = {
        userId: 'admin',
        isAdmin: true,
        email: decoded.data[0].email
      };
    } else {
      // Token de l'API Node.js normal
      req.user = decoded;
    }
    
    next();
  } catch (err) {
    console.error('Erreur de vérification du token:', err);
    res.status(403).json({ message: 'Token invalide.' });
  }
} 