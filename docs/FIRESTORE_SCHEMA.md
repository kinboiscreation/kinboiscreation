# Schéma Firestore - MIDP

## 📊 Vue d'ensemble des Collections

```
firestore/
├── activities/              # Activités de prière
├── announcements/           # Annonces officielles
├── users/                   # Utilisateurs
├── conductors/             # Conducteurs
├── conductor_schedules/    # Plannings conducteurs
├── documents/              # Fichiers stockés
├── prayer_subjects/        # Sujets de prière
├── meetings/               # Réunions
├── monthly_stats/          # Statistiques (dénormalisées)
└── council_reports/        # Rapports Conseil
```

---

## 📝 Collection: `activities`

Enregistrement des participants aux activités.

```typescript
{
  id: string,                    // Auto-généré
  type: "matinale" | "nocturne" | "atmosphère" | ... // ActivityType
  date: Timestamp,               // Date de l'activité
  dayOfWeek: 0-6,               // 0=dimanche, 6=samedi (pour tri)
  totalParticipants: number,    // Nombre total
  menCount: number,             // Hommes
  womenCount: number,           // Femmes
  sessionNumber: number,        // Numéro de séance du mois
  remarks: string,              // Remarques optionnelles
  conductorId?: string,         // Lien vers conducteur
  createdBy: string,            // Email de qui a créé
  createdAt: Timestamp,
  updatedAt: Timestamp,
  month: number,                // 1-12 (pour requêtes)
  year: number,                 // 2024 (pour requêtes)
  fiscalYear: number,           // Année fiscale (août-juillet)
}

Index composé:
- type, date (DESC)
- type, month, year
- month, year
```

**Exemples de documents**:
```json
{
  "id": "act_001",
  "type": "matinale",
  "date": "2024-09-09",
  "dayOfWeek": 1,
  "totalParticipants": 85,
  "menCount": 45,
  "womenCount": 40,
  "sessionNumber": 1,
  "remarks": "Excellente participation",
  "conductorId": "cond_001",
  "createdBy": "admin@midp.fr",
  "createdAt": "2024-09-09T08:00:00Z",
  "updatedAt": "2024-09-09T08:00:00Z",
  "month": 9,
  "year": 2024,
  "fiscalYear": 2024
}
```

---

## 📢 Collection: `announcements`

Annonces officielles du MIDP.

```typescript
{
  id: string,
  title: string,
  content: string,
  status: "draft" | "published" | "archived",
  createdBy: string,             // Email
  createdAt: Timestamp,
  updatedAt: Timestamp,
  publishedAt?: Timestamp,
  scheduledFor?: Timestamp,      // Date d'envoi planifiée
  reminderType?: "weekly" | "custom" | "event",
  reminderEnabled: boolean,      // Rappel actif ?
  reminderSentAt?: Timestamp,    // Quand le rappel a été envoyé
  aiGenerated: boolean,          // Généré par IA ?
  aiPrompt?: string,             // Prompt utilisé pour IA
  tags: string[],                // Pour filtrer
  priority: "low" | "medium" | "high",
}
```

**Index**:
- status, createdAt (DESC)
- publishedAt (DESC)
- scheduledFor

---

## 👥 Collection: `users`

Utilisateurs de l'application.

```typescript
{
  id: string,                    // UID Firebase Auth
  email: string,                 // Email unique
  name: string,
  role: "admin_senior" | "admin" | "member" | "reader",
  status: "active" | "inactive" | "suspended",
  joinDate: Timestamp,
  lastLogin?: Timestamp,
  photoUrl?: string,
  phone?: string,
  notificationsEnabled: boolean,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  metadata: {
    loginCount: number,
    lastActivityAt?: Timestamp,
    department?: string,
  }
}
```

---

## 🎤 Collection: `conductors`

Base de données des conducteurs.

```typescript
{
  id: string,
  name: string,
  email: string,
  phone?: string,
  role: "main" | "secondary" | "standby",
  activities: string[],         // Types d'activités
  joinDate: Timestamp,
  status: "active" | "inactive",
  notes?: string,
  certifications?: string[],
  contactPreference: "email" | "phone" | "whatsapp",
  createdAt: Timestamp,
  updatedAt: Timestamp,
}
```

---

## 📅 Collection: `conductor_schedules`

Planning hebdomadaire des conducteurs.

```typescript
{
  id: string,
  week: number,                  // 1-52
  year: number,
  activityType: string,
  conductorId: string,
  scheduledDate: Timestamp,
  timeSlot?: "morning" | "evening" | "night",
  attended: boolean,
  attendedAt?: Timestamp,
  absenceReason?: string,        // "sick", "personal", "unknown", etc
  arrivedLateAt?: Timestamp,
  lateMinutes?: number,
  notes?: string,
  createdAt: Timestamp,
  updatedAt: Timestamp,
}

Index:
- week, year
- conductorId, year
```

---

## 📄 Collection: `documents`

Fichiers stockés (PDF, Word, Excel, PowerPoint).

```typescript
{
  id: string,
  title: string,
  description?: string,
  type: "pdf" | "word" | "excel" | "ppt",
  category: "prayer_subjects" | "presentation" | "report" | "procedure",
  storageUrl: string,            // URL Firebase Storage
  fileName: string,
  fileSize: number,              // bytes
  uploadedBy: string,            // Email
  uploadedAt: Timestamp,
  accessibleTo: string[],        // Rôles: ["admin_senior", "admin", ...]
  tags: string[],
  version: number,               // Pour versionning
  previousVersionId?: string,
  createdAt: Timestamp,
  updatedAt: Timestamp,
}

Index:
- category, uploadedAt (DESC)
- uploadedBy
```

---

## 🙏 Collection: `prayer_subjects`

Sujets de prière par semaine.

```typescript
{
  id: string,
  week: number,                  // 1-52
  year: number,
  subject: string,
  details?: string,
  responsible: string,           // Email
  documentUrl?: string,          // Lien vers fichier
  status: "draft" | "published",
  tags: string[],
  createdAt: Timestamp,
  updatedAt: Timestamp,
  publishedAt?: Timestamp,
}

Index:
- week, year
- year
```

---

## 👥 Collection: `meetings`

Réunions et assemblées.

```typescript
{
  id: string,
  title: string,
  date: Timestamp,
  time: string,                  // "14:30" format
  duration: number,              // minutes
  location: "church" | "zoom" | "hybrid",
  zoomLink?: string,
  address?: string,
  agenda: string,
  remarks?: string,
  attendees: {
    userId: string,
    name: string,
    status: "present" | "absent" | "justified" | "unknown",
    arrivedAt?: Timestamp,
    leftAt?: Timestamp,
    remarks?: string,
  }[],
  organizer: string,             // Email
  createdAt: Timestamp,
  updatedAt: Timestamp,
}

Index:
- date (DESC)
```

---

## 📊 Collection: `monthly_stats` (Dénormalisée)

Statistiques pré-calculées par mois (pour performances).

```typescript
{
  id: string,                    // "YYYY-MM-TYPE"
  month: number,
  year: number,
  fiscalYear: number,
  activityType: string,
  totalParticipants: number,
  sessionCount: number,
  averageParticipants: number,
  menTotal: number,
  menAverage: number,
  womenTotal: number,
  womenAverage: number,
  highestSessionParticipants: number,
  lowestSessionParticipants: number,
  remarks?: string,
  calculatedAt: Timestamp,
  lastUpdatedAt: Timestamp,
}

Index:
- month, year
- fiscalYear
```

**Mis à jour automatiquement** via Cloud Functions quand une activité est créée/modifiée.

---

## 📈 Collection: `council_reports`

Rapports trimestriels pour le Conseil.

```typescript
{
  id: string,
  quarter: 1|2|3|4,
  year: number,
  fiscalYear: number,
  stats: {
    [activityType]: {
      totalParticipants: number,
      sessionCount: number,
      average: number,
    }
  },
  highlights: string,
  challenges: string,
  recommendations: string,
  createdBy: string,
  createdAt: Timestamp,
  powerPointUrl?: string,        // URL du fichier généré
  generatedAt?: Timestamp,
}

Index:
- quarter, year
- createdAt (DESC)
```

---

## 🔐 Règles de Sécurité (Resumé)

| Collection | Reader | Member | Admin | Admin Sr |
|-----------|--------|--------|-------|----------|
| activities | R | R/W | R/W | R/W |
| announcements | R | R | R/W | R/W |
| users | - | R/self | - | R/W |
| conductors | R | R | R/W | R/W |
| documents | R | - | R/W | R/W |
| monthly_stats | R | R | R | R/W |
| council_reports | - | - | R | R/W |

---

## 💾 Cloud Storage Structure

```
gs://midp-app-demo/
├── documents/
│   ├── prayer_subjects/    # Sujets de prière
│   ├── presentations/      # PowerPoints
│   ├── reports/            # Rapports PDF
│   └── procedures/         # Procédures
├── uploads/
│   └── [userId]/
└── exports/
    ├── reports/
    ├── powerpoint/
    └── statistics/
```

---

## 🔄 Cloud Functions (À Implémenter)

1. **`onActivityCreated`** - Recalculer `monthly_stats`
2. **`onMonthChange`** - Initialiser stats du nouveau mois
3. **`generateCouncilReport`** - Créer rapport trimestriel
4. **`generatePowerPoint`** - Créer fichier PowerPoint
5. **`sendReminders`** - Envoyer rappels d'annonces (mardi)
6. **`backupData`** - Sauvegarde quotidienne

---

## 📋 Indices Firestore Requis

```javascript
// À créer dans Firebase Console

// Activities
firestore.createIndex('activities', [
  { field: 'type', order: 'ASCENDING' },
  { field: 'date', order: 'DESCENDING' }
]);

firestore.createIndex('activities', [
  { field: 'type', order: 'ASCENDING' },
  { field: 'month', order: 'ASCENDING' },
  { field: 'year', order: 'ASCENDING' }
]);

// Monthly Stats
firestore.createIndex('monthly_stats', [
  { field: 'month', order: 'ASCENDING' },
  { field: 'year', order: 'ASCENDING' }
]);
```

---

**Dernière mise à jour**: 7 septembre 2024
**Version**: 1.0.0
