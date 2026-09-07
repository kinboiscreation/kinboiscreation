# MIDP - Claude Development Guide

> Guide de développement pour Claude Code sur le projet MIDP

## 📋 Vue d'ensemble du Projet

Application complète de gestion des activités de prière avec:
- **Web**: React + Vite + TypeScript + Tailwind
- **Mobile**: Expo + React Native
- **Backend**: Node.js + Express + Firebase
- **Shared**: Types et utilitaires TypeScript

## 🎯 Phase Actuelle

**Phase 1: Foundation** (En cours)
- ✅ Structure du projet monorepo
- ✅ Configuration TypeScript
- ✅ Backend API de base
- ✅ Dashboard web avec graphiques
- ✅ Navigation et authentification
- ✅ Application mobile de base

## 📂 Structure Clé des Fichiers

### Types Partagés (`shared/src/index.ts`)
Tous les types TypeScript centralisés:
- `Activity`, `MonthlyStats`, `User`
- `ActivityType`, `UserRole`
- Constantes et permissions

### Backend API (`backend/src/index.ts`)
Endpoints principaux:
- `GET /api/health` - Vérification
- `POST /api/activities` - Créer activité
- `GET /api/activities/:type` - Récupérer activités
- `GET /api/stats/monthly/:year/:month` - Statistiques
- `POST /api/announcements` - Créer annonce
- `GET /api/announcements` - Lister annonces

### Frontend Web
- **Pages**: Dashboard, Activities, Calendar, etc.
- **Composants**: Layout, Navigation, Sidebar
- **Styles**: Tailwind + CSS personnalisé (index.css)

### Frontend Mobile
- **Screens**: Dashboard, Activities, Announcements
- **Navigation**: Bottom Tabs
- **Styles**: React Native StyleSheet

## 🔧 Commandes Essentielles

```bash
# Installation
npm install

# Développement
npm run dev                    # Tous les services
npm run backend:dev           # Backend uniquement
npm run web:dev               # Web uniquement
npm run mobile:dev            # Mobile uniquement

# Build
npm run build                 # Build tout
npm run web:build             # Build web seulement

# Type checking
npm run type-check            # Vérifier les types TypeScript

# Linting
npm run lint                  # Vérifier le code
```

## 🎨 Design System

### Couleurs
- **Primaire**: `#f59e0b` (Amber-500)
- **Secondaire**: `#f97316` (Orange-500)
- **Fond**: `#0f172a` (Slate-950)
- **Texte Primaire**: `#f1f5f9` (Slate-100)

### Classes CSS Réutilisables
```css
.card              /* Carte avec effet glassmorphic */
.btn-primary       /* Bouton primaire amber */
.btn-secondary     /* Bouton secondaire slate */
.input             /* Champ input stylisé */
.badge             /* Badge coloré */
.stat-box          /* Boîte de statistique */
.grid-2/3/4        /* Grilles responsive */
```

## 🗂️ Noms de Fichiers

**Convention**: kebab-case pour les fichiers

```
❌ Dashboard.tsx         → ✅ dashboard.tsx
❌ UserListItem.tsx      → ✅ user-list-item.tsx
❌ mainLayout.css        → ✅ main-layout.css
```

## 📝 Conventions de Code

### Components React
```typescript
// Fonction nommée + export par défaut
export default function ComponentName() {
  return <div>...</div>;
}
```

### Types et Interfaces
```typescript
// Depuis shared/@midp/shared
import { Activity, UserRole } from '@midp/shared';

interface ComponentProps {
  title: string;
  data: Activity[];
  onSubmit?: (data: Activity) => void;
}
```

### Hooks
```typescript
// Utiliser useState pour l'état local
const [isLoading, setIsLoading] = useState(false);

// Utiliser useEffect pour les effets
useEffect(() => {
  fetchData();
}, []);
```

## 🔄 Flux de Travail Git

1. **Feature Branch**
   ```bash
   git checkout -b feature/nom-feature
   ```

2. **Développement et Commits**
   ```bash
   git commit -m "feat: description de la fonctionnalité"
   ```

3. **Push vers la branche de travail**
   ```bash
   git push -u origin claude/midp-mobile-web-app-k9iqo3
   ```

## 🚀 Prochaines Étapes

### Phase 2: Features Principales
1. **Activités Complètes**
   - Formulaire de création/édition
   - Validation des données
   - Calculs de statistiques

2. **Calendrier Intelligent**
   - Calendrier annuel (août-juillet)
   - Mise à jour automatique
   - Vue mensuelle avec statistiques

3. **Gestion des Annonces**
   - Créateur d'annonces
   - Système de rappels
   - Génération IA

4. **Planning et Conducteurs**
   - Base de données conducteurs
   - Planning automatisé
   - Rapports d'absence

### Phase 3: Fonctionnalités Avancées
1. Génération PowerPoint automatique
2. Export de rapports (PDF, Excel)
3. Synchronisation temps réel améliorée
4. Notifications push mobiles

## 🔒 Configuration Firebase

Pour connecter Firebase:

1. Créer un projet sur console.firebase.google.com
2. Activer Firestore Database
3. Activer Authentication (Email/Password)
4. Télécharger les clés de service
5. Définir dans `.env`:
   ```
   FIREBASE_CONFIG={...clés...}
   FIREBASE_DB_URL=https://votre-projet.firebaseio.com
   ```

## 📚 Ressources

- [Shared Types](./shared/src/index.ts) - Tous les types du projet
- [Backend API](./backend/src/index.ts) - Endpoints
- [Architecture](./docs/ARCHITECTURE.md) - Vue d'ensemble technique
- [README](./README.md) - Documentation utilisateur

## 🐛 Debugging

### Backend
```bash
# Logs detaillés
NODE_DEBUG=* npm run backend:dev

# Debugger Node.js
node --inspect dist/index.js
```

### Frontend Web
```bash
# React DevTools (Chrome)
# Debugger: F12 → Console/Sources
```

### Mobile
```bash
# Expo DevTools
npm run mobile:dev
# Scanner QR avec Expo Go app
```

## 💡 Tips

1. **Hot Reload**: Tous les services supportent le hot reload
2. **TypeScript**: Activé partout, utilisez les types fournis
3. **Prettier**: Format automatique recommendé
4. **Testing**: À implémenter avec Jest/Vitest
5. **Env Variables**: Copier .env.example en .env avant de démarrer

## 📞 Support

Pour des questions sur:
- **Architecture**: Voir `docs/ARCHITECTURE.md`
- **Types**: Vérifier `shared/src/index.ts`
- **API**: Vérifier `backend/src/index.ts`
- **UI**: Voir composants dans `web/src/`

---

**Dernière mise à jour**: 7 septembre 2024
**Version**: 1.0.0
**Branche**: `claude/midp-mobile-web-app-k9iqo3`
