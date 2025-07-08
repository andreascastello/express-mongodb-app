# 🚀 API Node.js/Express + MongoDB

## 📋 Vue d'ensemble

API RESTful moderne construite avec **Node.js/Express** et **MongoDB Atlas** pour la gestion des billets de blog. L'application inclut l'authentification JWT, la validation des données, et des tests complets.

## 🏗️ Architecture

### Back-end Node.js/Express
- **Framework** : Express.js avec middleware moderne
- **Base de données** : MongoDB Atlas (cluster M0)
- **ORM** : Mongoose pour la modélisation des données
- **Authentification** : JWT avec middleware de protection
- **Validation** : Joi pour la validation des données
- **Tests** : Jest + Supertest

### Base de données MongoDB
- **Cluster** : MongoDB Atlas M0 (gratuit)
- **Collections** : Users, Posts
- **Indexation** : Optimisée pour les requêtes fréquentes
- **Sécurité** : Connexion sécurisée via variables d'environnement

## 🚀 Installation et lancement 

### Prérequis
- Node.js 18+
- MongoDB Atlas (cluster configuré)
- Docker et Docker Compose (optionnel)

### 1. Installation des dépendances

```bash
cd express-mongodb-app
npm install
```

### 2. Configuration des variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# Serveur
PORT=3000
NODE_ENV=development

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog_db?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:3000

# Tests
TEST_MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/test_db?retryWrites=true&w=majority
```

### 3. Configuration MongoDB Atlas

1. **Créer un cluster MongoDB Atlas**
2. **Configurer l'accès réseau** (IP whitelist ou 0.0.0.0/0)
3. **Créer un utilisateur** avec permissions readWrite
4. **Récupérer l'URI de connexion**

## 🐳 Déploiement avec Docker

### Architecture Docker

Le projet inclut plusieurs configurations Docker :

#### 1. Architecture de développement

```bash
# Lancer l'API avec MongoDB
docker-compose up --build

# Services disponibles :
# - API Express : http://localhost:3000
# - MongoDB : localhost:27017
```

#### 2. Architecture de test

```bash
# Lancer les tests avec MongoDB de test
docker-compose -f docker-compose-test.yml up --build
```

### Configuration Docker

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Tests

### Tests unitaires

```bash
# Lancer tous les tests
npm test

# Tests avec coverage
npm run test:coverage

# Tests en mode watch
npm run test:watch
```

### Tests d'intégration

```bash
# Tests d'intégration
npm run test:integration

# Tests avec base de données de test
npm run test:integration:db
```

### Structure des tests

```
src/__tests__/
├── integration/           # Tests d'intégration
│   ├── auth.test.js      # Tests d'authentification
│   └── posts.test.js     # Tests des posts
├── middlewares/          # Tests des middlewares
│   └── auth.test.js      # Tests du middleware auth
└── models/               # Tests des modèles
    └── Post.test.js      # Tests du modèle Post
```

### Couverture de tests

Les tests couvrent :
- ✅ **Authentification** (login, register, middleware)
- ✅ **Gestion des posts** (CRUD complet)
- ✅ **Validation des données** (Joi schemas)
- ✅ **Gestion des erreurs** (middleware error handling)
- ✅ **Modèles Mongoose** (validation, méthodes)

## 📊 Fonctionnalités

### API RESTful

#### Authentification
- `POST /api/auth/register` - Inscription utilisateur
- `POST /api/auth/login` - Connexion utilisateur
- `GET /api/auth/me` - Récupérer le profil utilisateur

#### Posts (Blog)
- `GET /api/posts` - Liste des posts (avec pagination)
- `GET /api/posts/:id` - Détail d'un post
- `POST /api/posts` - Créer un post (authentifié)
- `PUT /api/posts/:id` - Modifier un post (authentifié)
- `DELETE /api/posts/:id` - Supprimer un post (authentifié)

#### Utilisateurs
- `GET /api/users` - Liste des utilisateurs (admin)
- `GET /api/users/:id` - Profil utilisateur
- `PUT /api/users/:id` - Modifier un utilisateur
- `DELETE /api/users/:id` - Supprimer un utilisateur (admin)

### Modèles de données

#### User Model
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  role: String (enum: ['user', 'admin']),
  createdAt: Date,
  updatedAt: Date
}
```

#### Post Model
```javascript
{
  title: String (required),
  content: String (required),
  author: ObjectId (ref: 'User'),
  tags: [String],
  published: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Scripts utiles

### Développement
```bash
# Mode développement avec nodemon
npm run dev

# Mode production
npm start

# Linter
npm run lint

# Formatage du code
npm run format
```

### Base de données
```bash
# Initialisation de la base de données
npm run db:init

# Migration des données
npm run db:migrate

# Reset de la base de données
npm run db:reset
```

### Déploiement
```bash
# Build Docker
docker build -t express-mongodb-api .

# Déploiement Scalingo
./deploy-scalingo.sh
```

## 📁 Structure du projet

```
express-mongodb-app/
├── src/
│   ├── __tests__/         # Tests unitaires et intégration
│   ├── middlewares/       # Middlewares Express
│   │   └── auth.js        # Middleware d'authentification
│   ├── models/            # Modèles Mongoose
│   │   ├── Post.js        # Modèle Post
│   │   └── User.js        # Modèle User
│   ├── routes/            # Routes Express
│   │   ├── auth.js        # Routes d'authentification
│   │   ├── posts.js       # Routes des posts
│   │   └── users.js       # Routes des utilisateurs
│   ├── app.js             # Configuration Express
│   └── server.js          # Point d'entrée
├── docker-compose.yml     # Architecture Docker
├── docker-compose-test.yml # Architecture de test
├── Dockerfile             # Configuration Docker
├── package.json           # Dépendances et scripts
└── vercel.json            # Configuration Vercel
```

## 🔐 Sécurité

### Authentification JWT
- **Token d'accès** : 24h d'expiration
- **Refresh token** : 7 jours d'expiration
- **Blacklist** : Gestion des tokens révoqués

### Validation des données
- **Joi schemas** pour toutes les entrées
- **Sanitisation** des données utilisateur
- **Rate limiting** sur les endpoints sensibles

### Base de données
- **Connexion sécurisée** MongoDB Atlas
- **Indexation** optimisée
- **Backup automatique** (MongoDB Atlas)

## 🚀 Déploiement

### Déploiement Vercel

```bash
# Installation Vercel CLI
npm i -g vercel

# Déploiement
vercel --prod
```

### Déploiement Scalingo

Le déploiement se fait automatiquement via GitHub Actions :

1. **Build de l'application**
2. **Tests automatisés**
3. **Déploiement via Git SSH**

### Variables d'environnement de production

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=production-secret-key
CORS_ORIGIN=https://your-frontend-domain.com
```

## 📚 API Documentation

### Exemples d'utilisation

#### Créer un post
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mon premier post",
    "content": "Contenu du post...",
    "tags": ["blog", "express"]
  }'
```

#### Se connecter
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Documentation interactive
- **Swagger UI** : `http://localhost:3000/api-docs`
- **Postman Collection** : Disponible dans `/docs`

## 🐛 Dépannage

### Problèmes courants

#### Erreur de connexion MongoDB
- Vérifiez l'URI de connexion
- Vérifiez les permissions utilisateur
- Vérifiez la whitelist IP

#### Erreurs JWT
- Vérifiez `JWT_SECRET` dans les variables d'environnement
- Vérifiez l'expiration du token
- Vérifiez le format du token

#### Tests qui échouent
- Vérifiez la base de données de test
- Vérifiez les variables d'environnement de test
- Relancez les conteneurs Docker

**🎯 Objectif atteint** : API Node.js/Express robuste avec MongoDB Atlas, authentification sécurisée, tests complets et déploiement automatisé. 