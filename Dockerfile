# Utilise une image officielle Node.js comme image de base
FROM node:20-alpine

# Définit le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copie les fichiers package.json et package-lock.json
COPY package*.json ./

# Installe les dépendances
RUN npm ci --only=production

# Copie le reste des fichiers de l'application
COPY . .

# Expose le port utilisé par l'app
EXPOSE 8080

# Définit la commande de démarrage
CMD ["npm", "start"] 