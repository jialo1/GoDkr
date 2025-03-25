# GoDkr - Guide de Dakar

GoDkr est une application web et mobile qui aide les nouveaux arrivants à Dakar à découvrir la ville, trouver des lieux d'intérêt, rejoindre des communautés et rester informés des actualités locales.

## Technologies utilisées

- **Frontend Web**: Next.js 14 avec TypeScript et Tailwind CSS
- **Backend**: Node.js avec Express et Prisma
- **Base de données**: PostgreSQL
- **Authentification**: NextAuth.js
- **Cartographie**: Mapbox
- **Gestion d'images**: Cloudinary

## Prérequis

- Node.js 18.x ou supérieur
- PostgreSQL
- npm ou yarn

## Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/votre-username/godkr.git
cd godkr/godkr-web
```

2. Installez les dépendances :
```bash
npm install
# ou
yarn install
```

3. Configurez les variables d'environnement :
```bash
cp .env.example .env
```
Modifiez le fichier `.env` avec vos propres valeurs :
- `DATABASE_URL` : URL de votre base de données PostgreSQL
- `NEXTAUTH_SECRET` : Une chaîne aléatoire pour la sécurité de NextAuth
- `NEXTAUTH_URL` : URL de votre application (http://localhost:3000 en développement)

4. Initialisez la base de données :
```bash
npx prisma generate
npx prisma db push
```

5. Lancez le serveur de développement :
```bash
npm run dev
# ou
yarn dev
```

L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000).

## Structure du projet

```
godkr-web/
├── src/
│   ├── app/              # Pages et routes de l'application
│   ├── components/       # Composants React réutilisables
│   ├── lib/             # Utilitaires et configurations
│   └── styles/          # Styles globaux
├── prisma/              # Schéma et migrations de la base de données
├── public/              # Fichiers statiques
└── package.json         # Dépendances et scripts
```

## Fonctionnalités

- 🔐 Authentification et gestion des profils utilisateurs
- 🗺️ Carte interactive de Dakar avec lieux d'intérêt
- 👥 Création et gestion de communautés
- 📰 Actualités et événements locaux
- 📱 Interface responsive pour mobile et desktop

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## Contact

Votre Nom - [@votre_twitter](https://twitter.com/votre_twitter)

Lien du projet : [https://github.com/votre-username/godkr](https://github.com/votre-username/godkr)
