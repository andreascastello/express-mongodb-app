# express-mongodb-app

## Description

API Node.js Express avec MongoDB pour la gestion d'utilisateurs (authentification JWT) et de posts de blog.

## Lancement rapide avec Docker

1. **Cloner le dépôt**
2. **Configurer les variables d'environnement**
   - Copier `.env.example` en `.env` si besoin (pour usage local)
   - Avec Docker Compose, les variables sont déjà définies dans `docker-compose.yml`
3. **Lancer l'application**

```bash
docker-compose up --build
```

- L'API sera disponible sur [http://localhost:3000](http://localhost:3000)
- MongoDB sera disponible sur le port 27017

## Structure du projet

```
express-mongodb-app/
│
├── src/
│   ├── app.js                # Point d'entrée principal
│   ├── models/               # Modèles Mongoose (User, Post)
│   ├── routes/               # Routes Express (auth, posts, users)
│   └── middlewares/          # Middlewares (authentification)
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

## Variables d'environnement

- `MONGO_URI` : URI de connexion MongoDB
- `JWT_SECRET` : Clé secrète pour le JWT
- `PORT` : Port d'écoute de l'API (par défaut 3000)

## Endpoints principaux

### Authentification
- `POST /api/auth/register` : Inscription (email, password)
- `POST /api/auth/login` : Connexion (retourne un JWT)

### Utilisateurs (admin uniquement)
- `GET /api/users/` : Liste tous les utilisateurs (infos réduites)
- `GET /api/users/:id` : Infos privées d'un utilisateur
- `DELETE /api/users/:id` : Supprime un utilisateur

### Posts
- `GET /api/posts/` : Liste tous les posts
- `POST /api/posts/` : Crée un post (authentifié)
- `DELETE /api/posts/:id` : Supprime un post (auteur ou admin)

## Exemple d'utilisation

### Inscription
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com", "password":"monmotdepasse"}'
```

### Connexion
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com", "password":"monmotdepasse"}'
```

### Créer un post (authentifié)
```bash
curl -X POST http://localhost:3000/api/posts \
  -H 'Authorization: Bearer <VOTRE_TOKEN_JWT>' \
  -H 'Content-Type: application/json' \
  -d '{"title":"Mon premier post", "content":"Contenu du post"}'
```

## Auteurs
- À compléter avec les noms des membres du groupe et leur répartition des tâches.

---

N'hésitez pas à adapter ce README selon vos besoins ! 