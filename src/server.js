import app from './app.js';

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log('Serveur Node.js démarré sur le port', PORT);
});