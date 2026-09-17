// ============= Types d'activités =============
export type ActivityType =
  | 'matinale'
  | 'nocturne'
  | 'atmosphère'
  | 'langues_feu'
  | 'nuit_culte'
  | 'mère_nation'
  | 'femmes_pieds'
  | 'spécial';

// ============= Interfaces principales =============
export interface Activity {
  id: string;
  type: ActivityType;
  name: string;
  date: Date;
  totalParticipants: number;
  menCount: number;
  womenCount: number;
  sessionNumber: number;
  monthlyAverage?: number;
  remarks?: string;
  conductorId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MonthlyStats {
  month: number;
  year: number;
  activityType: ActivityType;
  totalParticipants: number;
  sessionCount: number;
  averageParticipants: number;
  monthlyRemarks?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  scheduledFor?: Date;
  reminderEnabled: boolean;
  reminderType?: 'weekly' | 'custom' | 'event';
  status: 'draft' | 'published' | 'archived';
  aiGenerated?: boolean;
  createdBy: string;
}

export interface Conductor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  activities: ActivityType[];
  joinDate: Date;
  status: 'active' | 'inactive';
}

export interface ConductorSchedule {
  id: string;
  week: number;
  year: number;
  conductorId: string;
  activityType: ActivityType;
  scheduleDate: Date;
  attended?: boolean;
  absenceReason?: string;
  lateMinutes?: number;
}

export interface Meeting {
  id: string;
  title: string;
  date: Date;
  time: string;
  location: 'church' | 'zoom' | 'hybrid';
  zoomLink?: string;
  agenda: string;
  remarks?: string;
  attendees: MeetingAttendee[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MeetingAttendee {
  userId: string;
  name: string;
  status: 'present' | 'absent' | 'justified' | 'unknown';
  remarks?: string;
}

export interface Document {
  id: string;
  title: string;
  type: 'pdf' | 'word' | 'excel' | 'ppt';
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
  category: 'prayer_subjects' | 'presentation' | 'report' | 'other';
  accessibleTo: UserRole[];
}

export interface PrayerSubject {
  id: string;
  week: number;
  year: number;
  subject: string;
  responsible: string;
  documentUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CouncilMeeting {
  id: string;
  date: Date;
  stats: MonthlyStats[];
  remarks?: string;
  reportUrl?: string;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export type UserRole = 'admin_senior' | 'admin' | 'member' | 'reader';

export interface SyncData {
  userId: string;
  timestamp: Date;
  activities: Activity[];
  announcements: Announcement[];
  schedules: ConductorSchedule[];
  meetings: Meeting[];
}

// ============= Enums =============
export enum UserPermission {
  VIEW_DASHBOARD = 'view_dashboard',
  CREATE_ACTIVITY = 'create_activity',
  EDIT_ACTIVITY = 'edit_activity',
  DELETE_ACTIVITY = 'delete_activity',
  CREATE_ANNOUNCEMENT = 'create_announcement',
  EDIT_ANNOUNCEMENT = 'edit_announcement',
  MANAGE_USERS = 'manage_users',
  VIEW_REPORTS = 'view_reports',
  GENERATE_POWERPOINT = 'generate_powerpoint'
}

export const ROLE_PERMISSIONS: Record<UserRole, UserPermission[]> = {
  admin_senior: [
    UserPermission.VIEW_DASHBOARD,
    UserPermission.CREATE_ACTIVITY,
    UserPermission.EDIT_ACTIVITY,
    UserPermission.DELETE_ACTIVITY,
    UserPermission.CREATE_ANNOUNCEMENT,
    UserPermission.EDIT_ANNOUNCEMENT,
    UserPermission.MANAGE_USERS,
    UserPermission.VIEW_REPORTS,
    UserPermission.GENERATE_POWERPOINT
  ],
  admin: [
    UserPermission.VIEW_DASHBOARD,
    UserPermission.CREATE_ACTIVITY,
    UserPermission.EDIT_ACTIVITY,
    UserPermission.DELETE_ACTIVITY,
    UserPermission.CREATE_ANNOUNCEMENT,
    UserPermission.EDIT_ANNOUNCEMENT,
    UserPermission.VIEW_REPORTS,
    UserPermission.GENERATE_POWERPOINT
  ],
  member: [
    UserPermission.VIEW_DASHBOARD,
    UserPermission.CREATE_ACTIVITY
  ],
  reader: [
    UserPermission.VIEW_DASHBOARD
  ]
};

export const ROLE_LABELS: Record<UserRole, string> = {
  admin_senior: 'Administrateur senior',
  admin: 'Administrateur',
  member: 'Membre',
  reader: 'Lecteur'
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  admin_senior:
    "Accès à toutes les fonctionnalités, peut modifier et ajouter tout dans l'application.",
  admin: "Accès à toutes les fonctionnalités, sans pouvoir modifier l'application.",
  member: 'Peut uniquement saisir les chiffres de participants et le nombre de séances.',
  reader: 'Consultation seule, aucune modification possible.'
};

export const PERMISSION_LABELS: Record<UserPermission, string> = {
  [UserPermission.VIEW_DASHBOARD]: 'Consulter le tableau de bord',
  [UserPermission.CREATE_ACTIVITY]: 'Saisir une activité',
  [UserPermission.EDIT_ACTIVITY]: 'Modifier une activité',
  [UserPermission.DELETE_ACTIVITY]: 'Supprimer une activité',
  [UserPermission.CREATE_ANNOUNCEMENT]: 'Créer une annonce',
  [UserPermission.EDIT_ANNOUNCEMENT]: 'Modifier une annonce',
  [UserPermission.MANAGE_USERS]: 'Gérer les utilisateurs',
  [UserPermission.VIEW_REPORTS]: 'Consulter les rapports',
  [UserPermission.GENERATE_POWERPOINT]: 'Générer les présentations'
};

// ============= Constants =============
export const ACTIVITY_NAMES: Record<ActivityType, string> = {
  matinale: 'Matinaux de Prière',
  nocturne: 'Nocturnes de Prière',
  atmosphère: 'Atmosphère de Prière',
  langues_feu: 'Langues de Feu',
  nuit_culte: 'Nuit de Prière de préparation au culte',
  mère_nation: 'Comme une Mère dans la Nation',
  femmes_pieds: 'Femmes aux Pieds du Maître',
  spécial: 'Programmes spéciaux'
};

/**
 * Programme du ministère : les huit activités du §1, plus les veillées qui
 * disposent de leur propre rubrique. Sert de clé stable pour regrouper les
 * chiffres quelle que soit leur source de saisie.
 */
export type ProgramKey = ActivityType | 'veillee';

export const PROGRAM_NAMES: Record<ProgramKey, string> = {
  matinale: 'Matinaux de Prière',
  nocturne: 'Nocturnes de Prière',
  atmosphère: 'Atmosphère de Prière',
  langues_feu: 'Langues de Feu',
  nuit_culte: 'Nuit de Prière de préparation au culte',
  mère_nation: 'Comme une Mère dans la Nation',
  femmes_pieds: 'Femmes aux Pieds du Maître',
  spécial: 'Programmes spéciaux',
  veillee: 'Veillées de Prière'
};

/** Libellé court, pour les axes de graphiques et les cartes compactes. */
export const PROGRAM_SHORT_NAMES: Record<ProgramKey, string> = {
  matinale: 'Matinaux',
  nocturne: 'Nocturnes',
  atmosphère: 'Atmosphère',
  langues_feu: 'Langues de Feu',
  nuit_culte: 'Nuit de Prière',
  mère_nation: 'Mère dans la Nation',
  femmes_pieds: 'Femmes aux Pieds',
  spécial: 'Programmes spéciaux',
  veillee: 'Veillées'
};

export const PROGRAM_ORDER: ProgramKey[] = [
  'matinale',
  'nocturne',
  'atmosphère',
  'langues_feu',
  'nuit_culte',
  'veillee',
  'mère_nation',
  'femmes_pieds',
  'spécial'
];

export const PRAYER_SLOTS = [
  '00h00 - 01h00',
  '01h00 - 02h00',
  '02h00 - 03h00'
];

export const FISCAL_YEAR_START_MONTH = 8; // August

// ============= Utility Functions =============
export function getPermissionsForRole(role: UserRole): UserPermission[] {
  return ROLE_PERMISSIONS[role];
}

export function canUserPerformAction(role: UserRole, action: UserPermission): boolean {
  return ROLE_PERMISSIONS[role].includes(action);
}

export function calculateMonthlyAverage(totalParticipants: number, sessionCount: number): number {
  return sessionCount > 0 ? Math.round(totalParticipants / sessionCount) : 0;
}

export function getCurrentFiscalYear(): number {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1-12
  return currentMonth >= FISCAL_YEAR_START_MONTH ? now.getFullYear() : now.getFullYear() - 1;
}

export function getMonthName(month: number, lang: 'fr' | 'en' = 'fr'): string {
  const months_fr = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const months_en = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return lang === 'fr' ? months_fr[month - 1] : months_en[month - 1];
}

// ============= Créneaux horaires (Nuit de culte / Langues de Feu) =============
export type SlotSessionType = 'nuit_culte' | 'langues_feu';

export interface SlotAttendance {
  slot: string;
  total: number;
  men: number;
  women: number;
}

export interface SlotSession {
  id: string;
  type: SlotSessionType;
  date: string;
  conductorName?: string;
  slots: SlotAttendance[];
  remarks?: string;
}

export function createEmptySlots(): SlotAttendance[] {
  return PRAYER_SLOTS.map(slot => ({ slot, total: 0, men: 0, women: 0 }));
}

export function sumSlots(slots: SlotAttendance[]): SlotAttendance {
  return slots.reduce(
    (acc, s) => ({
      slot: 'Total',
      total: acc.total + (s.total || 0),
      men: acc.men + (s.men || 0),
      women: acc.women + (s.women || 0)
    }),
    { slot: 'Total', total: 0, men: 0, women: 0 }
  );
}

// ============= Sessions à thème (ADP / Veillées) =============
export type ThemedSessionKind = 'adp' | 'veillee';

export interface ThemedSession {
  id: string;
  kind: ThemedSessionKind;
  theme: string;
  date: string;
  time?: string;
  announcement?: string;
  remarks?: string;
  documentName?: string;
  documentUrl?: string;
  totalParticipants: number;
  menCount: number;
  womenCount: number;
  reminderEnabled?: boolean;
}

// ============= Programmes des femmes =============
export type WomenProgramType = 'mère_nation' | 'femmes_pieds' | 'spécial_femmes';

export const WOMEN_PROGRAM_NAMES: Record<WomenProgramType, string> = {
  mère_nation: 'Comme une Mère dans la Nation',
  femmes_pieds: 'Femmes aux Pieds du Maître',
  spécial_femmes: 'Programmes spéciaux des femmes'
};

export interface WomenProgram {
  id: string;
  programType: WomenProgramType;
  theme: string;
  date: string;
  conductors: string;
  mode: 'zoom' | 'présentiel';
  zoomLink?: string;
  totalParticipants: number;
  menCount: number;
  womenCount: number;
  remarks?: string;
}

// ============= Réunions (§8) =============
export type AttendanceStatus = 'present' | 'justified' | 'absent';

export const ATTENDANCE_LABELS: Record<AttendanceStatus, string> = {
  present: 'Présent',
  justified: 'Absence justifiée',
  absent: 'Non présent'
};

export interface MeetingAttendance {
  name: string;
  status: AttendanceStatus;
  reason?: string;
}

export interface MeetingRecord {
  id: string;
  title: string;
  date: string;
  time: string;
  location: 'église' | 'zoom';
  zoomLink?: string;
  agenda?: string;
  remarks?: string;
  attendees: MeetingAttendance[];
  reminderEnabled: boolean;
}

// ============= Conducteurs et planning hebdomadaire =============
export interface ConductorRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'conductor' | 'assistant';
  status: 'active' | 'inactive';
  joinDate: string;
}

/** Issue d'une assignation : le rapport mensuel s'appuie dessus. */
export type ScheduleOutcome = 'pending' | 'conducted' | 'absent' | 'late';

export const SCHEDULE_OUTCOME_LABELS: Record<ScheduleOutcome, string> = {
  pending: 'À venir',
  conducted: 'A conduit',
  absent: 'Absent',
  late: 'En retard'
};

export interface ScheduleEntry {
  id: string;
  conductorId: string;
  conductorName: string;
  activityType: ActivityType;
  date: string;
  outcome: ScheduleOutcome;
  absenceReason?: string;
  lateMinutes?: number;
}

export interface ConductorMonthlyStat {
  conductorId: string;
  conductorName: string;
  planned: number;
  conducted: number;
  absent: number;
  late: number;
  totalLateMinutes: number;
  absenceReasons: string[];
  reliability: number;
}

/** Rapport mensuel exigé au §9, calculé à partir des assignations. */
export function buildConductorReport(
  entries: ScheduleEntry[],
  month: number,
  year: number
): ConductorMonthlyStat[] {
  const inMonth = entries.filter(entry => {
    const date = new Date(entry.date);
    return date.getMonth() + 1 === month && date.getFullYear() === year;
  });

  const byConductor = new Map<string, ConductorMonthlyStat>();

  inMonth.forEach(entry => {
    const stat = byConductor.get(entry.conductorId) ?? {
      conductorId: entry.conductorId,
      conductorName: entry.conductorName,
      planned: 0,
      conducted: 0,
      absent: 0,
      late: 0,
      totalLateMinutes: 0,
      absenceReasons: [],
      reliability: 0
    };

    stat.planned += 1;
    if (entry.outcome === 'conducted') stat.conducted += 1;
    if (entry.outcome === 'late') {
      stat.late += 1;
      stat.conducted += 1;
      stat.totalLateMinutes += entry.lateMinutes || 0;
    }
    if (entry.outcome === 'absent') {
      stat.absent += 1;
      if (entry.absenceReason) stat.absenceReasons.push(entry.absenceReason);
    }

    byConductor.set(entry.conductorId, stat);
  });

  return [...byConductor.values()]
    .map(stat => ({
      ...stat,
      reliability: stat.planned > 0 ? Math.round((stat.conducted / stat.planned) * 100) : 0
    }))
    .sort((a, b) => b.planned - a.planned);
}

// ============= Planning intercession (§14) =============
export interface IntercessionPlanning {
  id: string;
  weekStart: string;
  conductorName: string;
  directives?: string;
  revelations?: string;
  createdAt: string;
}

// ============= Rappels / alarmes =============
export type ReminderSource = 'announcement' | 'meeting' | 'veillee' | 'event' | 'custom';

export interface Reminder {
  id: string;
  title: string;
  message?: string;
  dueAt: string;
  recurrence: 'none' | 'weekly';
  weekday?: number;
  sourceType: ReminderSource;
  sourceId?: string;
  acknowledged: boolean;
}

// ============= Calendrier fiscal (août → juillet) =============
export const FISCAL_MONTH_ORDER: number[] = [8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7];

export function getFiscalYearLabel(fiscalYear: number): string {
  return `${fiscalYear} - ${fiscalYear + 1}`;
}

export function getCalendarYearForFiscalMonth(month: number, fiscalYear: number): number {
  return month >= FISCAL_YEAR_START_MONTH ? fiscalYear : fiscalYear + 1;
}

export function monthlySummary(entries: Array<{ totalParticipants: number }>) {
  const sessionCount = entries.length;
  const totalParticipants = entries.reduce((sum, e) => sum + (e.totalParticipants || 0), 0);
  return {
    sessionCount,
    totalParticipants,
    average: calculateMonthlyAverage(totalParticipants, sessionCount)
  };
}
