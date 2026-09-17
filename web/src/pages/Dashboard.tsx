import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  LayoutDashboard,
  Users,
  Activity as ActivityIcon,
  TrendingUp,
  CalendarDays,
  BellRing,
  Megaphone,
  Sunrise,
  Moon,
  Wind,
  Flame,
  MoonStar,
  Sparkles,
  Crown,
  Star,
  Heart,
  ClipboardList,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  ProgramKey,
  getMonthName,
  getCurrentFiscalYear,
  getFiscalYearLabel,
  FISCAL_MONTH_ORDER,
  getCalendarYearForFiscalMonth
} from '@midp/shared';
import { useParticipation, summarizeMonth, allProgramsForMonth } from '../hooks/use-participation';
import { useCollection } from '../hooks/use-collection';
import { useReminders } from '../hooks/use-reminders';

const PALETTE = ['#d4af37', '#a78bfa', '#34d399', '#60a5fa', '#f0c75e', '#7c3aed', '#f87171', '#fbbf24', '#38bdf8'];

/** Où saisir chaque programme. */
const PROGRAM_ROUTES: Record<ProgramKey, string> = {
  matinale: '/activities',
  nocturne: '/activities',
  atmosphère: '/atmosphere',
  langues_feu: '/tongues-of-fire',
  nuit_culte: '/night-prayer',
  veillee: '/vigils',
  mère_nation: '/women-programs',
  femmes_pieds: '/women-programs',
  spécial: '/activities'
};

const PROGRAM_ICONS: Record<ProgramKey, typeof Sunrise> = {
  matinale: Sunrise,
  nocturne: Moon,
  atmosphère: Wind,
  langues_feu: Flame,
  nuit_culte: MoonStar,
  veillee: Sparkles,
  mère_nation: Crown,
  femmes_pieds: Crown,
  spécial: Star
};

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  kind: 'activité' | 'annonce';
  alarm: boolean;
}

interface ScheduleRow {
  id: string;
  date: string;
  conductorName: string;
  outcome: string;
}

interface PrayerSubjectRow {
  id: string;
  status?: string;
}

export default function Dashboard() {
  const { entries, loading } = useParticipation();
  const { items: events } = useCollection<CalendarEvent>('midp-calendar-events');
  const { items: schedule } = useCollection<ScheduleRow>('midp-conductor-schedule');
  const { items: prayerSubjects } = useCollection<PrayerSubjectRow>('prayerSubjects');
  const { due, upcoming } = useReminders();

  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const fiscalYear = getCurrentFiscalYear();

  /* --- Semaine en cours (lundi → aujourd'hui) --- */
  const week = useMemo(() => {
    const start = new Date(today);
    const offset = (start.getDay() + 6) % 7;
    start.setDate(start.getDate() - offset);
    start.setHours(0, 0, 0, 0);

    const inWeek = entries.filter(entry => new Date(entry.date) >= start);
    const sessions = inWeek.length;

    return {
      participants: inWeek.reduce((sum, entry) => sum + entry.participants, 0),
      sessions,
      menAverage: sessions > 0 ? Math.round(inWeek.reduce((s, e) => s + e.men, 0) / sessions) : 0,
      womenAverage: sessions > 0 ? Math.round(inWeek.reduce((s, e) => s + e.women, 0) / sessions) : 0
    };
  }, [entries]);

  const monthSummary = useMemo(() => summarizeMonth(entries, month, year), [entries, month, year]);

  /** Tous les programmes du ministère, même ceux sans saisie ce mois-ci. */
  const programs = useMemo(
    () => allProgramsForMonth(entries, month, year),
    [entries, month, year]
  );

  const programsWithData = programs.filter(program => program.sessions > 0);

  /* --- Tendance hebdomadaire du mois --- */
  const trend = useMemo(() => {
    const weeks = new Map<number, { participants: number; sessions: number }>();
    monthSummary.entries.forEach(entry => {
      const weekIndex = Math.ceil(new Date(entry.date).getDate() / 7);
      const current = weeks.get(weekIndex) || { participants: 0, sessions: 0 };
      current.participants += entry.participants;
      current.sessions += 1;
      weeks.set(weekIndex, current);
    });

    return [1, 2, 3, 4, 5]
      .filter(index => weeks.has(index))
      .map(index => {
        const value = weeks.get(index)!;
        return {
          week: `S${index}`,
          participants: value.participants,
          moyenne: value.sessions > 0 ? Math.round(value.participants / value.sessions) : 0
        };
      });
  }, [monthSummary.entries]);

  /* --- Cumul de l'année fiscale (août → juillet) --- */
  const annual = useMemo(() => {
    let participants = 0;
    let sessions = 0;
    FISCAL_MONTH_ORDER.forEach(fiscalMonth => {
      const calendarYear = getCalendarYearForFiscalMonth(fiscalMonth, fiscalYear);
      const summary = summarizeMonth(entries, fiscalMonth, calendarYear);
      participants += summary.participants;
      sessions += summary.sessions;
    });
    return { participants, sessions };
  }, [entries, fiscalYear]);

  const upcomingEvents = [...events]
    .filter(event => new Date(event.date) >= new Date(today.toDateString()))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const pendingAssignments = schedule.filter(row => row.outcome === 'pending').length;
  const activeSubjects = prayerSubjects.filter(subject => subject.status !== 'answered').length;

  const tooltipStyle = {
    backgroundColor: 'var(--bg-elevated)',
    border: '1px solid var(--border-strong)',
    borderRadius: '10px',
    color: 'var(--text-primary)'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="section-title">
          <LayoutDashboard className="h-8 w-8 text-gold" />
          Tableau de Bord
        </h1>
        <p className="text-dim text-sm mt-2">
          {getMonthName(month)} {year} · Année {getFiscalYearLabel(fiscalYear)}
        </p>
      </div>

      {due.length > 0 && (
        <div className="card-gold flex items-start gap-3">
          <BellRing className="h-5 w-5 text-gold shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="section-subtitle">
              {due.length} rappel{due.length > 1 ? 's' : ''} à traiter
            </p>
            <p className="text-dim text-sm mt-1">
              {due.slice(0, 3).map(reminder => reminder.title).join(' · ')}
            </p>
          </div>
        </div>
      )}

      {/* Indicateurs de la semaine */}
      <div className="grid-4">
        <div className="stat-box">
          <Users className="h-5 w-5 text-gold" />
          <span className="stat-number">{week.participants}</span>
          <span className="stat-label">Participants cette semaine</span>
        </div>
        <div className="stat-box">
          <ActivityIcon className="h-5 w-5 text-gold" />
          <span className="stat-number">{week.sessions}</span>
          <span className="stat-label">Séances cette semaine</span>
        </div>
        <div className="stat-box">
          <Users className="h-5 w-5" style={{ color: 'var(--info)' }} />
          <span className="stat-number-royal">{week.menAverage}</span>
          <span className="stat-label">Hommes par séance</span>
        </div>
        <div className="stat-box">
          <Users className="h-5 w-5" style={{ color: 'var(--royal-bright)' }} />
          <span className="stat-number-royal">{week.womenAverage}</span>
          <span className="stat-label">Femmes par séance</span>
        </div>
      </div>

      {/* LES PROGRAMMES DU MIDP — tous, y compris ceux sans saisie */}
      <div className="space-y-4">
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <h2 className="section-subtitle">Les programmes du MIDP — {getMonthName(month)}</h2>
          <span className="text-dim text-sm">
            {monthSummary.sessions} séances · {monthSummary.participants} participants ·
            moyenne {monthSummary.average}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {programs.map(program => {
            const Icon = PROGRAM_ICONS[program.program];
            const hasData = program.sessions > 0;

            return (
              <Link
                key={program.program}
                to={PROGRAM_ROUTES[program.program]}
                className="card-hover"
                style={{ opacity: hasData ? 1 : 0.72 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        background: hasData ? 'var(--gold-soft)' : 'var(--bg-input)',
                        border: `1px solid ${hasData ? 'var(--gold-border)' : 'var(--border)'}`
                      }}
                    >
                      <Icon
                        className="h-4.5 w-4.5"
                        style={{ color: hasData ? 'var(--gold)' : 'var(--text-muted)' }}
                      />
                    </span>
                    <span
                      className="text-sm font-medium leading-tight"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {program.name}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 mt-2" style={{ color: 'var(--text-muted)' }} />
                </div>

                <div className="flex items-end justify-between gap-2 mt-4">
                  <div>
                    <p className="stat-number" style={{ fontSize: '1.75rem' }}>
                      {program.participants}
                    </p>
                    <p className="stat-label">Participants</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {program.sessions} séance{program.sessions > 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-royal" style={{ fontWeight: 600 }}>
                      moyenne {program.average}
                    </p>
                  </div>
                </div>

                {!hasData && (
                  <p className="text-dim text-xs mt-3">Aucune saisie ce mois-ci — cliquez pour saisir.</p>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Indicateurs du mois et de l'année */}
      <div className="grid-4">
        <div className="stat-box">
          <span className="stat-label">Participants du mois</span>
          <span className="stat-number">{monthSummary.participants}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Séances du mois</span>
          <span className="stat-number">{monthSummary.sessions}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Moyenne du mois</span>
          <span className="stat-number-royal">{monthSummary.average}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Participants sur l'année</span>
          <span className="stat-number-royal">{annual.participants}</span>
          <span className="text-dim text-xs">{annual.sessions} séances</span>
        </div>
      </div>

      {/* Graphiques */}
      {programsWithData.length > 0 ? (
        <>
          <div className="grid-2">
            <div className="card">
              <h2 className="section-subtitle mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-gold" />
                Participation par programme
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={programs} margin={{ bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="shortName"
                    stroke="var(--text-muted)"
                    fontSize={10}
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis stroke="var(--text-muted)" fontSize={12} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--gold-soft)' }} />
                  <Bar dataKey="participants" name="Participants" fill={PALETTE[0]} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h2 className="section-subtitle mb-4 flex items-center gap-2">
                <ActivityIcon className="h-5 w-5 text-gold" />
                Répartition
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={programsWithData}
                    cx="50%"
                    cy="45%"
                    outerRadius={92}
                    dataKey="participants"
                    nameKey="shortName"
                    label={({ percent }: any) => `${Math.round((percent || 0) * 100)}%`}
                    labelLine={false}
                  >
                    {programsWithData.map((_, index) => (
                      <Cell key={index} fill={PALETTE[index % PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {trend.length > 0 && (
            <div className="card">
              <h2 className="section-subtitle mb-4 flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-gold" />
                Tendance du mois
              </h2>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="week" stroke="var(--text-muted)" fontSize={12} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line
                    type="monotone"
                    dataKey="participants"
                    name="Participants"
                    stroke={PALETTE[0]}
                    strokeWidth={2.5}
                    dot={{ fill: PALETTE[0], r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="moyenne"
                    name="Moyenne par séance"
                    stroke={PALETTE[1]}
                    strokeWidth={2.5}
                    dot={{ fill: PALETTE[1], r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          <p>Aucune participation enregistrée ce mois-ci.</p>
          <p className="text-sm mt-2">
            Les graphiques et synthèses se calculent automatiquement dès la première saisie.
          </p>
        </div>
      )}

      {/* Organisation : annonces, sujets de prière, planning des conducteurs */}
      <div className="space-y-4">
        <h2 className="section-subtitle">Organisation</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/announcements" className="card-hover flex items-center gap-3">
            <Megaphone className="h-6 w-6 text-gold shrink-0" />
            <div className="min-w-0">
              <p style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Annonces</p>
              <p className="text-dim text-xs">Rédaction, rappel du mardi</p>
            </div>
          </Link>

          <Link to="/prayer-subjects" className="card-hover flex items-center gap-3">
            <Heart className="h-6 w-6 text-gold shrink-0" />
            <div className="min-w-0">
              <p style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Sujets de prière</p>
              <p className="text-dim text-xs">
                {activeSubjects > 0 ? `${activeSubjects} sujet(s) en cours` : 'Aucun sujet actif'}
              </p>
            </div>
          </Link>

          <Link to="/conductors" className="card-hover flex items-center gap-3">
            <ClipboardList className="h-6 w-6 text-gold shrink-0" />
            <div className="min-w-0">
              <p style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Planning conducteurs</p>
              <p className="text-dim text-xs">
                {pendingAssignments > 0
                  ? `${pendingAssignments} assignation(s) à venir`
                  : 'Aucune assignation en attente'}
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* À venir */}
      {(upcomingEvents.length > 0 || upcoming.length > 0) && (
        <div className="grid-2">
          {upcomingEvents.length > 0 && (
            <div className="card space-y-3">
              <h2 className="section-subtitle flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-gold" />
                À venir
              </h2>
              {upcomingEvents.map(event => (
                <div key={event.id} className="flex items-center gap-2 flex-wrap">
                  <span className={event.kind === 'annonce' ? 'badge-primary' : 'badge-royal'}>
                    {event.kind === 'annonce' ? (
                      <Megaphone className="h-3 w-3" />
                    ) : (
                      <CalendarDays className="h-3 w-3" />
                    )}
                    {new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </span>
                  <span className="text-soft text-sm">{event.title}</span>
                </div>
              ))}
            </div>
          )}

          {upcoming.length > 0 && (
            <div className="card space-y-3">
              <h2 className="section-subtitle flex items-center gap-2">
                <BellRing className="h-5 w-5 text-gold" />
                Prochains rappels
              </h2>
              {upcoming.slice(0, 5).map(reminder => (
                <div key={reminder.id} className="flex items-center gap-2 flex-wrap">
                  <span className="badge-neutral">
                    {new Date(reminder.dueAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </span>
                  <span className="text-soft text-sm">{reminder.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
