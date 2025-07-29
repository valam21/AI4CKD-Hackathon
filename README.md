# AI4CKD - Système Intelligent de Gestion des Patients atteints de MRC

![Banner AI4CKD](https://via.placeholder.com/1200x300?text=AI4CKD+Solution+for+CKD+Patients)

## Table des Matières

1.  [Introduction](#1-introduction)
2.  [Fonctionnalités Clés](#2-fonctionnalités-clés)
    * [Système d'Alertes Intelligentes (Alerting dynamique)](#système-dalertes-intelligentes-alerting-dynamique)
    * [Module de Génération de Synthèse PDF](#module-de-génération-de-synthèse-pdf)
    * [Authentification Utilisateur](#authentification-utilisateur)
3.  [Technologies Utilisées](#3-technologies-utilisées)
4.  [Architecture du Projet](#4-architecture-du-projet)
5.  [Pré-requis](#5-pré-requis)
6.  [Installation et Démarrage](#6-installation-et-démarrage)
    * [Cloner le Dépôt](#cloner-le-dépôt)
    * [Configuration de la Base de Données (PostgreSQL)](#configuration-de-la-base-de-données-postgresql)
    * [Configuration du Backend](#configuration-du-backend)
    * [Configuration du Frontend](#configuration-du-frontend)
    * [Lancer l'Application](#lancer-lapplication)
7.  [Utilisation de l'Application](#7-utilisation-de-lapplication)
8.  [Déploiement](#8-déploiement)
9.  [Structure du Dépôt](#9-structure-du-dépôt)
10. [Livrables (Hackathon)](#10-livrables-hackathon)
11. [Défis et Apprentissages](#11-défis-et-apprentissages)
12. [Contribution](#12-contribution)
13. [Auteurs](#13-auteurs)
14. [Licence](#14-licence)

---

## 1. Introduction

Ce projet a été développé dans le cadre du hackathon "AI4CKD". L'objectif est de créer un prototype d'application web pour la gestion des patients atteints de Maladie Rénale Chronique (MRC). Le prototype se concentre sur deux modules critiques : un **système intelligent de détection et d'alerte automatique** des situations cliniques critiques et un **module de génération de synthèse PDF** des données patients. Une fonctionnalité d'**authentification utilisateur** a également été intégrée pour sécuriser l'accès aux données patient.

## 2. Fonctionnalités Clés

### Système d'Alertes Intelligentes (Alerting dynamique)

Cette fonctionnalité permet la détection automatique de situations à risque à partir des données cliniques saisies par les professionnels de santé lors des consultations.

* **Déclenchement des alertes** : Les alertes sont déclenchées en fonction de seuils et de règles prédéfinies basées sur les paramètres cliniques (ex: créatinine, tension artérielle, poids).
    * **Alertes MRC** : Seuil de créatinine élevé, tension artérielle anormale, etc.
    * **Alertes Dynamiques** : Détection de l'aggravation rapide de la fonction rénale (ex: augmentation significative de la créatinine entre deux consultations successives).
* **Notifications** : Les alertes sont affichées de manière claire et visuelle sur la page de détail du patient, permettant une intervention rapide.

### Module de Génération de Synthèse PDF

Ce module permet de générer un rapport PDF complet du dossier patient, incluant toutes les informations démographiques, les antécédents, l'historique des consultations et les alertes.

* **Exportation Facile** : Un bouton dédié sur la page de détail du patient permet de télécharger instantanément le PDF.
* **Contenu Complet** : Le PDF contient de manière structurée l'ensemble des données pertinentes du patient, facilitant le partage et l'archivage.

### Authentification Utilisateur

Pour sécuriser l'accès aux données sensibles des patients, un système d'authentification a été mis en place.

* **Inscription (Register)** : Les nouveaux utilisateurs peuvent créer un compte avec leur email et un mot de passe.
* **Connexion (Login)** : Les utilisateurs enregistrés peuvent se connecter pour accéder aux fonctionnalités de l'application.
* **Protection des Routes** : L'accès aux pages de gestion des patients (liste, détails, ajout) et aux API backend est restreint aux utilisateurs authentifiés via des JSON Web Tokens (JWT).
* **Déconnexion (Logout)** : Permet aux utilisateurs de se déconnecter de leur session.

## 3. Technologies Utilisées

Ce projet est une application web full-stack, utilisant les technologies suivantes :

* **Frontend**:
    * [Next.js](https://nextjs.org/) (Framework React pour le rendu côté serveur et client)
    * [React](https://react.dev/) (Bibliothèque JavaScript pour les interfaces utilisateur)
    * [TypeScript](https://www.typescriptlang.org/) (Superset de JavaScript typé)
    * [Tailwind CSS](https://tailwindcss.com/) (Framework CSS utilitaire pour un style rapide et réactif)
    * [`date-fns`](https://date-fns.org/) (Utilitaires pour la manipulation des dates)
    * `localStorage` (pour la gestion des tokens JWT côté client)
* **Backend**:
    * [Node.js](https://nodejs.org/) (Environnement d'exécution JavaScript côté serveur)
    * [Express.js](https://expressjs.com/) (Framework web pour Node.js)
    * [TypeScript](https://www.typescriptlang.org/)
    * [PostgreSQL](https://www.postgresql.org/) (Système de gestion de base de données relationnelle)
    * [`pg`](https://node-postgres.com/) (Client PostgreSQL pour Node.js)
    * [`dotenv`](https://github.com/motdotla/dotenv) (Pour la gestion des variables d'environnement)
    * [`cors`](https://github.com/expressjs/cors) (Middleware Express pour gérer les requêtes Cross-Origin)
    * [`pdfkit`](http://pdfkit.org/) (Génération de PDF en Node.js)
    * [`bcryptjs`](https://github.com/dcodeIO/bcrypt.js) (Pour le hachage des mots de passe)
    * [`jsonwebtoken`](https://github.com/auth0/node-jsonwebtoken) (Pour la génération et la vérification des JWT)

## 4. Architecture du Projet

L'application suit une architecture client-serveur standard :

* **Frontend (Next.js)** : Responsable de l'interface utilisateur et de l'interaction avec l'API backend. Il gère la navigation, l'affichage des données et les interactions utilisateur.
* **Backend (Node.js/Express)** : Fournit une API RESTful pour la gestion des données (patients, consultations, alertes, utilisateurs). Il interagit avec la base de données PostgreSQL, contient la logique métier (calcul d'alertes) et gère l'authentification.
* **Base de Données (PostgreSQL)** : Stocke toutes les données de l'application (informations patients, consultations, alertes et utilisateurs).

## 5. Pré-requis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants sur votre machine :

* [Node.js](https://nodejs.org/en/download/) (v18 ou plus récent recommandé)
* [pnpm](https://pnpm.io/installation) (Gestionnaire de paquets, recommandé, mais npm ou yarn fonctionnent aussi)
* [PostgreSQL](https://www.postgresql.org/download/) (Base de données)

## 6. Installation et Démarrage

Suivez ces étapes pour configurer et lancer le projet localement.

### Cloner le Dépôt

```bash
git clone [https://github.com/votre-utilisateur/AI4CKD-Hackathon.git](https://github.com/votre-utilisateur/AI4CKD-Hackathon.git)
cd AI4CKD-Hackathon
```

### Configuration de la Base de Données (PostgreSQL)

Vous devez créer la base de données et les tables nécessaires.

#### Option 1 : Utilisation de pgAdmin (Recommandé si vous utilisez l'interface graphique)

1.  **Ouvrez pgAdmin** et connectez-vous à votre serveur PostgreSQL.
2.  **Créez une nouvelle base de données** :
    * Dans le navigateur d'objets (à gauche), faites un clic droit sur "Databases" (ou "Bases de données").
    * Sélectionnez "Create" (Créer) > "Database..." (Base de données...).
    * Donnez le nom `ai4ckd_db` à votre nouvelle base de données.
    * Cliquez sur "Save" (Sauvegarder).
3.  **Exécutez le script de création des tables** :
    * Dans le navigateur d'objets, développez la base de données `ai4ckd_db` que vous venez de créer.
    * Faites un clic droit sur `ai4ckd_db` (ou "Schemas" > "public") et sélectionnez "Query Tool" (Outil de Requête).
    * Ouvrez le fichier `backend/sql/create_tables.sql` dans votre éditeur de texte (ou directement dans pgAdmin si vous le copiez/collez).
    * **Copiez tout le contenu** du fichier `backend/sql/create_tables.sql`.
    * **Collez ce contenu** dans la fenêtre du "Query Tool" de pgAdmin.
    * Cliquez sur le bouton "Execute/Refresh" (souvent un triangle vert ou une flèche "Play") pour exécuter les requêtes. Vous devriez voir un message de succès en bas.

#### Option 2 : Utilisation de la ligne de commande (psql)

1.  **Créez une base de données PostgreSQL** :
    ```bash
    psql -U votre_utilisateur_postgres -c "CREATE DATABASE ai4ckd_db;"
    ```

2.  **Exécutez le script de création des tables** :
    ```bash
    psql -d ai4ckd_db -f backend/sql/create_tables.sql -U votre_utilisateur_postgres
    ```

### Configuration du Backend

1.  **Naviguez vers le dossier `backend`** :
    ```bash
    cd backend
    ```

2.  **Installez les dépendances** :
    ```bash
    npm install
    ```

3.  **Créez un fichier d'environnement `.env`** à la racine du dossier `backend` et configurez vos variables :
    ```env
    PORT=5000
    DATABASE_URL="postgresql://votre_utilisateur_postgres:votre_mot_de_passe_postgres@localhost:5432/ai4ckd_db"
    JWT_SECRET="une_cle_secrete_tres_longue_et_aleatoire_pour_jwt" # Changez ceci en production !
    ```

### Configuration du Frontend

1.  **Naviguez vers le dossier `frontend`** (si vous êtes toujours dans `backend`, faites `cd ../frontend`) :
    ```bash
    cd ../frontend
    ```

2.  **Installez les dépendances** :
    ```bash
    npm install
    ```

3.  **Créez un fichier d'environnement `.env.local`** à la racine du dossier `frontend` :
    ```env
    NEXT_PUBLIC_BACKEND_URL="http://localhost:5000"
    ```

### Lancer l'Application

Vous devrez lancer le backend et le frontend séparément.

1.  **Lancer le Backend** (dans un terminal séparé) :
    ```bash
    cd AI4CKD-Hackathon/backend
    npm run dev
    ```
    Le backend devrait démarrer sur `http://localhost:5000`.

2.  **Lancer le Frontend** (dans un autre terminal séparé) :
    ```bash
    cd AI4CKD-Hackathon/frontend
    npm run dev
    ```
    Le frontend devrait démarrer sur `http://localhost:3000`.


## 7. Utilisation de l'Application

1.  Ouvrez votre navigateur et accédez à `http://localhost:3000`.
2.  **Inscription/Connexion** : Vous serez redirigé vers la page de connexion. Si vous n'avez pas de compte, cliquez sur "Inscription" pour en créer un.
3.  **Gestion des Patients** : Après connexion, vous pouvez accéder à la liste des patients, ajouter de nouveaux patients, et consulter leurs détails.
4.  **Ajout de Consultations** : Sur la page de détail d'un patient, vous pouvez ajouter de nouvelles consultations. Le système évaluera automatiquement les alertes.
5.  **Génération de PDF** : Sur la page de détail du patient, cliquez sur "Générer PDF du Dossier" pour télécharger un rapport complet.

## 8. Déploiement

* **Frontend (Next.js)** : Peut être déployé facilement sur des plateformes comme [Vercel](https://vercel.com/). Assurez-vous de configurer la variable d'environnement `NEXT_PUBLIC_BACKEND_URL` pour pointer vers l'URL de votre backend déployé.
* **Backend (Node.js/Express)** : Peut être déployé sur des services comme [Render](https://render.com/), [Heroku](https://www.heroku.com/), ou un VPS. Configurez les variables d'environnement (`DATABASE_URL`, `JWT_SECRET`) sur la plateforme d'hébergement.

## 9. Structure du Dépôt
```bash

AI4CKD-Hackathon/
├── backend/
│   ├── src/
│   │   ├── config/             # Configuration de la base de données
│   │   ├── controllers/        # Logique métier des requêtes API
│   │   ├── middleware/         # Middleware d'authentification
│   │   ├── models/             # Interfaces TypeScript pour les données
│   │   ├── routes/             # Définition des routes API
│   │   ├── services/           # Logique d'alertes et de génération PDF
│   │   └── app.ts              # Fichier principal de l'application Express
│   ├── sql/                    # Scripts SQL pour la base de données
│   ├── .env.example            # Exemple de fichier d'environnement
│   ├── package.json            # Dépendances et scripts Node.js
│   └── tsconfig.json           # Configuration TypeScript
├── frontend/
│   ├── src/
│   │   ├── app/                # Pages Next.js (App Router)
│   │   │   ├── patients/       # Pages patients (liste, détail, ajout)
│   │   │   ├── login/          # Page de connexion
│   │   │   ├── register/       # Page d'inscription
│   │   │   ├── globals.css     # Styles globaux (Tailwind CSS)
│   │   │   └── layout.tsx      # Layout racine de l'application
│   │   ├── components/         # Composants React réutilisables (ex: Navbar)
│   │   ├── context/            # Contexte d'authentification React
│   │   └── api/                # (Optionnel) Fonctions d'appel API
│   ├── public/                 # Assets statiques
│   ├── .env.local.example      # Exemple de fichier d'environnement
│   ├── package.json            # Dépendances et scripts Next.js
│   ├── tailwind.config.js      # Configuration Tailwind CSS
│   ├── postcss.config.js       # Configuration PostCSS
│   └── tsconfig.json           # Configuration TypeScript
├── .gitignore                  # Fichiers et dossiers à ignorer par Git
├── README.md                   # Ce fichier
└── Cahier des Charges - Projet AI4CKD Hackathon.pdf # Document de référence
```


## 10. Livrables (Hackathon)

* **Lien d'accès au prototype hébergé en ligne** : [À insérer après le déploiement]
* **Dépôt Git complet et commenté** : Ce dépôt lui-même.
* **Vidéo de démonstration (2 à 4 minutes)** : Mettant en évidence l'enregistrement/connexion, l'ajout de patient, l'ajout de consultation avec déclenchement d'alerte, et la génération PDF.
* **Présentation synthétique** : Document ou slides résumant les aspects clés du projet.

## 11. Défis et Apprentissages

* **Intégration Full-Stack** : Cohérence entre le frontend Next.js (App Router) et le backend Express.js.
* **Gestion des Types avec TypeScript** : Assurer la robustesse du code et réduire les erreurs.
* **Logique d'Alerting Complexe** : Définition et implémentation des règles d'alertes dynamiques.
* **Génération PDF** : Manipulation de bibliothèques externes (`pdfkit`) pour la création de documents structurés.
* **Authentification Sécurisée** : Mise en place de JWT, hachage de mots de passe, et protection des routes.
* **Gestion Client/Server Components** : Compréhension et application des concepts de Server Components et Client Components de Next.js 13/14 pour optimiser les performances et résoudre les problèmes d'hydratation.

## 12. Contribution

Les contributions sont les bienvenues ! Pour toute suggestion ou amélioration, n'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## 13. Auteurs

* [Votre Nom / Nom de l'Équipe 1]
* [Votre Nom / Nom de l'Équipe 2]
* ...

## 14. Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.