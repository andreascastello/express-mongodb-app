import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';

// Chargement des variables d'environnement
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('Connecté à MongoDB');
  }).catch((err) => {
    console.error('Erreur de connexion à MongoDB:', err);
  });
}

// Routes (à ajouter)
app.get('/', (req, res) => {
  res.send('Tout fonctionne bien 🚀');
});
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 8080;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
  });
}

export default app; 