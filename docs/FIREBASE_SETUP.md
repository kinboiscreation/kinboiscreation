# Configuration Firebase pour MIDP

## 📋 Guide d'Installation Firebase

### Prérequis
- Compte Google
- Node.js 18+
- Firebase CLI (`npm install -g firebase-tools`)

### Étape 1: Créer un Projet Firebase

1. Aller sur [console.firebase.google.com](https://console.firebase.google.com)
2. Cliquer "Ajouter un projet"
3. Nommer le projet: `midp-app-demo`
4. Désactiver Google Analytics (optionnel)
5. Créer le projet

### Étape 2: Activer les Services

#### Firestore Database
```
Firestore Database → Créer une base de données
Mode: Commencer en mode test (development)
Localisation: europe-west1 (Belgique)
```

#### Authentication
```
Authentication → Démarrer
Fournisseurs: Email/Mot de passe
```

#### Cloud Storage
```
Cloud Storage → Créer un bucket
Localisation: europe-west1
```

#### Cloud Functions (optionnel pour rapports PowerPoint)
```
Cloud Functions → Déployer une fonction
```

### Étape 3: Obtenir les Clés de Service

1. Aller dans **Paramètres du Projet** → **Comptes de Service**
2. Cliquer **Générer une nouvelle clé privée**
3. JSON sera téléchargé
4. Copier le contenu dans `.env`:

```bash
FIREBASE_CONFIG={"type":"service_account","project_id":"midp-app-demo",...}
```

### Étape 4: Configuration des Règles de Sécurité

#### Firestore Rules (firestore.rules)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Authentification requise
    match /{document=**} {
      allow read, write: if request.auth != null;
    }

    // Activities
    match /activities/{activityId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.token.role == 'admin_senior' || 
         request.auth.token.role == 'admin' ||
         request.auth.token.role == 'member');
    }

    // Announcements
    match /announcements/{announcementId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.token.role == 'admin_senior' || 
         request.auth.token.role == 'admin');
    }

    // Users (admin only)
    match /users/{userId} {
      allow read: if request.auth.uid == userId || 
        request.auth.token.role == 'admin_senior';
      allow write: if request.auth.token.role == 'admin_senior';
    }

    // Documents
    match /documents/{documentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.token.role == 'admin_senior' || 
         request.auth.token.role == 'admin');
    }
  }
}
```

### Étape 5: Initialiser Firebase dans le Projet

```bash
cd backend
npm install firebase-admin
npm install dotenv
```

Créer `.env`:
```env
FIREBASE_CONFIG={"type":"service_account",...}
FIREBASE_DB_URL=https://midp-app-demo.firebaseio.com
NODE_ENV=development
BACKEND_PORT=3000
```

### Étape 6: Tester la Connexion

```bash
npm run backend:dev
# Accéder à http://localhost:3000/api/health
# Doit retourner: {"status":"OK","timestamp":"..."}
```

---

## 🔑 Variables d'Environnement

### `.env` (Backend)
```env
# Firebase
FIREBASE_CONFIG={"type":"service_account","project_id":"midp-app-demo",...}
FIREBASE_DB_URL=https://midp-app-demo.firebaseio.com

# Backend
BACKEND_PORT=3000
NODE_ENV=development
```

### `.env` (Web Frontend)
```env
VITE_API_URL=http://localhost:3000/api
VITE_ENVIRONMENT=development
VITE_FIREBASE_CONFIG={"apiKey":"...","authDomain":"...",...}
```

### `.env` (Mobile)
```env
EXPO_API_URL=http://localhost:3000/api
EXPO_ENVIRONMENT=development
EXPO_FIREBASE_CONFIG={"apiKey":"...","authDomain":"...",...}
```

---

## 📊 Collections Firestore

Voir `FIRESTORE_SCHEMA.md` pour le schéma détaillé.

Collections principales:
- `activities` - Activités de prière
- `announcements` - Annonces officielles
- `users` - Utilisateurs et rôles
- `conductors` - Conducteurs
- `documents` - Fichiers stockés
- `prayer_subjects` - Sujets de prière
- `monthly_stats` - Statistiques mensuelles (calculées)

---

## 🔒 Sécurité

- ✅ Authentification obligatoire
- ✅ Autorisations par rôle (role-based access control)
- ✅ HTTPS pour tous les appels
- ✅ Validation côté serveur
- ✅ Chiffrement des données sensibles

---

## 🧪 Test Initial

```bash
# 1. Démarrer le backend
npm run backend:dev

# 2. Tester l'endpoint santé
curl http://localhost:3000/api/health

# 3. Créer une activité test
curl -X POST http://localhost:3000/api/activities \
  -H "Content-Type: application/json" \
  -d '{
    "type": "matinale",
    "date": "2024-09-07",
    "totalParticipants": 50,
    "menCount": 25,
    "womenCount": 25,
    "sessionNumber": 1,
    "remarks": "Test activity"
  }'
```

---

## 📚 Ressources

- [Firebase Console](https://console.firebase.google.com)
- [Firebase Admin SDK Docs](https://firebase.google.com/docs/admin/setup)
- [Firestore Rules](https://firebase.google.com/docs/firestore/security/start)

---

**Dernière mise à jour**: 7 septembre 2024
