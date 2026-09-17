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
