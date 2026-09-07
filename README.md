# MIDP - Ministère d'Intercession et de Développement de la Prière

> Application mobile et web haut de gamme pour la gestion des activités de prière

## 🎯 Vision

Développer une application exceptionnelle, luxueuse et hi-tech pour gérer l'ensemble des activités du MIDP avec:
- Interface haut de gamme et prestigieuse
- Design moderne avec animations fluides
- Synchronisation en temps réel
- Fonctionnalités avancées de statistiques
- Rapports PowerPoint automatisés

## 🚀 Fonctionnalités

### Gestion des Activités
- ✅ Enregistrement des présences
- ✅ Suivi des participants par genre
- ✅ Calcul automatique des moyennes
- ✅ Statistiques mensuelles et annuelles

### Activités Supportées
- Matinaux de Prière (lundi-vendredi)
- Nocturnes de Prière (lundi-vendredi)
- Atmosphère de Prière
- Langues de Feu
- Nuit de Prière de préparation au culte
- Comme une Mère dans la Nation
- Femmes aux Pieds du Maître
- Programmes spéciaux

### Calendrier Intelligent
- Calendrier annuel débutant en août
- Mise à jour automatique des statistiques
- Gestion des événements
- Rappels automatiques

### Annonces et Communications
- Publication d'annonces officielles
- Rappels automatiques (mardi)
- Génération IA des annonces
- Archivage

### Planning et Conducteurs
- Base de données des conducteurs
- Planning hebdomadaire automatisé
- Suivi des absences
- Rapports de participation

### Espace Conseil
- Statistiques trimestrielles
- Graphiques d'évolution
- Génération de rapports PowerPoint
- Comparaisons mensuelles

### Documents
- Stockage sécurisé (PDF, Word, Excel, PowerPoint)
- Partage contrôlé par rôles
- Synchronisation mobile/web

## 📋 Prérequis

- Node.js 18+
- npm 9+
- Compte Firebase
- (Optionnel) Android Studio pour mobile
- (Optionnel) Xcode pour iOS

## 🔧 Installation

### 1. Cloner le Projet
```bash
git clone https://github.com/kinboiscreation/kinboiscreation.git
cd kinboiscreation
```

### 2. Installer les Dépendances
```bash
npm install
```

### 3. Configuration
```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer .env avec vos configurations Firebase
# FIREBASE_CONFIG=... votre config Firebase
# FIREBASE_DB_URL=... votre URL Firebase
```

### 4. Initialiser Firebase
```bash
# Créer un projet Firebase sur console.firebase.google.com
# Activer Firestore et Authentication
# Télécharger les clés de service
```

## 🏃 Démarrage

### Mode Développement (tous les services)
```bash
npm run dev
```

### Services Individuels
```bash
# Backend (port 3000)
npm run backend:dev

# Web (port 5173)
npm run web:dev

# Mobile (Expo)
npm run mobile:dev
```

### Accès
- **Web**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **Mobile**: Expo DevTools

### Identifiants de Démonstration
- **Email**: admin@midp.fr
- **Mot de passe**: admin123

## 🏗️ Structure du Projet

```
kinboiscreation/
├── shared/          # Code partagé (types, constantes)
├── backend/         # API Node.js/Express
├── web/            # Application Web React
├── mobile/         # Application Mobile Expo
├── docs/           # Documentation
└── README.md       # Ce fichier
```

## 📱 Niveaux d'Accès

| Rôle | Dashboard | Activités | Annonces | Admin |
|------|-----------|-----------|----------|-------|
| Admin Senior | ✅ RW | ✅ RW | ✅ RW | ✅ RW |
| Admin | ✅ RW | ✅ RW | ✅ RW | ❌ |
| Membre | ✅ R | ✅ W | ❌ | ❌ |
| Lecteur | ✅ R | ❌ | ❌ | ❌ |

**R** = Lecture, **W** = Écriture, **RW** = Lecture/Écriture

## 🎨 Design

### Palette de Couleurs
- 🟠 Primaire: Amber-500 (`#f59e0b`)
- 🟤 Secondaire: Orange-600
- ⬛ Fond: Slate-950/900
- ⚪ Texte: Slate-100/300

### Composants
- Glassmorphic cards
- Gradients modernes
- Animations fluides
- Mode sombre par défaut

## 🔄 Synchronisation

Toutes les données sont synchronisées en temps réel entre:
- ✅ Application Web
- ✅ Application Mobile (iOS & Android)
- ✅ API Backend

Technologie: Firebase Realtime Database

## 📊 Statistiques

L'application calcule automatiquement:
- Nombre total de participants
- Nombre de séances
- Moyenne mensuelle
- Tendances d'évolution
- Rapports trimestriels

## 🔐 Sécurité

- Authentification Firebase
- Autorisation basée sur les rôles
- HTTPS obligatoire
- Chiffrement des données sensibles
- Audit logs

## 📝 Conventions de Développement

### Code
- TypeScript strictement typé
- Composants fonctionnels React
- Hooks pour la gestion d'état
- Props destructurées

### Commits
```
git commit -m "feat: description de la fonctionnalité"
git commit -m "fix: description du bug"
git commit -m "docs: mise à jour de la documentation"
```

### Branches
```
main                    # Production
develop                 # Développement
feature/nom-feature    # Nouvelles fonctionnalités
fix/nom-bug            # Corrections de bugs
```

## 📦 Build Production

### Web
```bash
npm run web:build
# Résultat: web/dist/
```

### Mobile
```bash
# iOS
npm run mobile:build -- --platform ios

# Android
npm run mobile:build -- --platform android
```

### Backend
```bash
npm run backend:build
# Résultat: backend/dist/
```

## 🚢 Déploiement

### Frontend Web
```bash
npm run web:build
# Déployer web/dist/ sur Firebase Hosting ou Vercel
```

### Backend
```bash
npm run backend:build
# Déployer sur Cloud Functions ou Cloud Run
```

### Mobile
```bash
# Via Expo Application Services
eas build
eas submit
```

## 📚 Documentation Supplémentaire

- [Architecture](./docs/ARCHITECTURE.md) - Architecture détaillée du système
- [API](./docs/API.md) - Documentation des endpoints (à créer)
- [Mobile](./docs/MOBILE.md) - Guide de développement mobile (à créer)
- [Deployment](./docs/DEPLOYMENT.md) - Guide de déploiement (à créer)

## 🐛 Support et Contributions

Pour les bugs ou suggestions:
1. Ouvrir une issue sur GitHub
2. Décrire le problème clairement
3. Fournir les étapes de reproduction

## 📄 Licence

MIDP © 2024. Tous droits réservés.

## 👥 Équipe

- **Développement**: Claude AI
- **Sponsor**: MIDP Ministère

---

**Dernière mise à jour**: 7 septembre 2024
**Version**: 1.0.0
**Status**: 🚧 En développement
