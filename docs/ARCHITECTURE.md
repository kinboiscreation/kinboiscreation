# Architecture de l'Application MIDP

## Vue d'ensemble

L'application MIDP est construite selon une architecture monorepo moderne avec:
- **Backend**: Node.js/Express + TypeScript + Firebase
- **Frontend Web**: React + Vite + TypeScript + Tailwind CSS
- **Frontend Mobile**: Expo + React Native + TypeScript
- **Shared**: Types et utilitaires partagés

## Structure du Projet

```
kinboiscreation/
├── shared/                    # Code partagé (types, utils)
│   ├── src/
│   │   └── index.ts          # Types et constantes
│   └── package.json
├── backend/                   # API Node.js/Express
│   ├── src/
│   │   └── index.ts          # Serveur principal
│   └── package.json
├── web/                       # Application Web React
│   ├── src/
│   │   ├── components/       # Composants réutilisables
│   │   ├── pages/           # Pages principales
│   │   ├── App.tsx          # Composant racine
│   │   └── index.css        # Styles globaux
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── mobile/                    # Application Mobile Expo
│   ├── src/
│   │   ├── screens/         # Écrans de l'app
│   │   ├── components/      # Composants mobiles
│   │   └── App.tsx          # Composant racine
│   ├── app.json
│   └── package.json
├── docs/                      # Documentation
├── package.json              # Configuration monorepo
└── tsconfig.json             # Configuration TypeScript
```

## Stack Technologique

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Firebase Admin SDK** - Base de données et authentification
- **TypeScript** - Typage statique

### Frontend Web
- **React 18** - Bibliothèque UI
- **Vite** - Bundler rapide
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styles CSS utilitaires
- **React Router** - Navigation
- **Recharts** - Graphiques interactifs
- **Axios** - Client HTTP

### Frontend Mobile
- **Expo** - Plateforme React Native
- **React Native** - Framework mobile
- **TypeScript** - Typage statique
- **React Navigation** - Navigation mobile
- **Firebase SDK** - Intégration backend

## Fonctionnalités Principales

### 1. Dashboard Intelligent
- Affichage en temps réel des statistiques
- Graphiques interactifs
- Vue d'ensemble des activités de la semaine

### 2. Gestion des Activités
- Enregistrement des présences
- Calcul automatique des statistiques
- Suivi des participants par genre

### 3. Calendrier Intelligent
- Calendrier annuel (commençant en août)
- Mise à jour automatique des statistiques
- Gestion des événements

### 4. Gestion des Annonces
- Publication d'annonces officielles
- Rappels automatiques
- Génération IA des annonces

### 5. Planning et Conducteurs
- Gestion des conducteurs par activité
- Planning hebdomadaire
- Suivi des absences

### 6. Espace Conseil
- Statistiques trimestrielles
- Génération de rapports PowerPoint
- Graphiques d'évolution

## Synchronisation en Temps Réel

La synchronisation est assurée par:
- **Firebase Realtime Database** - Stockage et sync en temps réel
- **Firestore** - Requêtes complexes
- **Cloud Firestore Listeners** - Mises à jour en temps réel

## Système de Permissions

Quatre niveaux d'accès:
1. **Admin Senior** - Accès complet
2. **Admin** - Accès complet sauf modifications d'app
3. **Membre** - Ajout de données seulement
4. **Lecteur** - Lecture seule

## Design System

### Palette de Couleurs
- **Primaire**: Amber-500 (`#f59e0b`)
- **Secondaire**: Orange-600
- **Fond**: Slate-950 et Slate-900
- **Texte**: Slate-100 et Slate-300

### Composants
- Cards glassmorphic
- Boutons gradients
- Animations fluides
- Mode sombre par défaut

## Installation et Démarrage

### Prérequis
- Node.js 18+
- npm 9+
- Firebase Account (pour backend)

### Installation
```bash
npm install
```

### Démarrage du Développement
```bash
# Tous les services
npm run dev

# Individuellement
npm run backend:dev
npm run web:dev
npm run mobile:dev
```

### Build pour Production
```bash
npm run build
```

## Sécurité

- **Authentification** - Firebase Auth
- **Autorisation** - Système de rôles basé sur Firestore
- **HTTPS** - Tous les appels API
- **CORS** - Configuration restrictive

## Performance

- **Lazy Loading** - Chargement des composants à la demande
- **Code Splitting** - Séparation du code par route
- **Caching** - Mise en cache Firebase
- **CDN** - Servir les assets statiques via CDN

## Déploiement

### Backend
- Cloud Functions Firebase ou Cloud Run
- Auto-scaling automatique

### Frontend Web
- Firebase Hosting ou Vercel
- CI/CD avec GitHub Actions

### Frontend Mobile
- Expo Application Services
- App Store et Google Play

## Maintenance

- Logs centralisés avec Cloud Logging
- Monitoring avec Cloud Monitoring
- Alertes automatiques
- Sauvegardes quotidiennes Firebase
