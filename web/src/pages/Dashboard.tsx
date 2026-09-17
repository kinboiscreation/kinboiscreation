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
  Megaphone
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMonthName, getCurrentFiscalYear, getFiscalYearLabel, FISCAL_MONTH_ORDER, getCalendarYearForFiscalMonth } from '@midp/shared';
import { useParticipation, summarizeMonth } from '../hooks/use-participation';
import { useCollection } from '../hooks/use-collection';
import { useReminders } from '../hooks/use-reminders';

const PALETTE = ['#d4af37', '#a78bfa', '#34d399', '#60a5fa', '#f0c75e', '#7c3aed', '#f87171'];

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  kind: 'activité' | 'annonce';
  alarm: boolean;
}

export default function Dashboard() {
  const { entries, loading } = useParticipation();
  const { items: events } = useCollection<CalendarEvent>('midp-calendar-events');
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
    const participants = inWeek.reduce((sum, entry) => sum + entry.participants, 0);
    const sessions = inWeek.length;

    return {
      participants,
      sessions,
      menAverage: sessions > 0 ? Math.round(inWeek.reduce((s, e) => s + e.men, 0) / sessions) : 0,
      womenAverage: sessions > 0 ? Math.round(inWeek.reduce((s, e) => s + e.women, 0) / sessions) : 0,
      entries: inWeek
    };
  }, [entries]);

  const monthSummary = useMemo(
    () => summarizeMonth(entries, month, year),
    [entries, month, year]
  );

  /* --- Répartition par programme sur le mois --- */
  const distribution = useMemo(() => {
    const grouped = new Map<string, number>();
    monthSummary.entries.forEach(entry => {
      grouped.set(entry.label, (grouped.get(entry.label) || 0) + entry.participants);
    });
    return [...grouped.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [monthSummary.entries]);

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

  /* --- Statistiques annuelles (année fiscale août → juillet) --- */
  const annual = useMemo(() => {
    let participants = 0;
    let sessions = 0;
    FISCAL_MONTH_ORDER.forEach(fiscalMonth => {
      const calendarYear = getCalendarYearForFiscalMonth(fiscalMonth, fiscalYear);
      const summary = summarizeMonth(entries, fiscalMonth, calendarYear);
      participants += summary.participants;
      sessions += summary.sessions;
    });
    return {
      participants,
      sessions,
      average: sessions > 0 ? Math.round(participants / sessions) : 0
    };
  }, [entries, fiscalYear]);

  const topPrograms = distribution.slice(0, 5);

  const upcomingEvents = [...events]
    .filter(event => new Date(event.date) >= new Date(today.toDateString()))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

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

  const hasData = entries.length > 0;

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

      {/* Rappels échus */}
      {due.length > 0 && (
        <div className="card-gold flex items-start gap-3">
          <BellRing className="h-5 w-5 text-gold shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="section-subtitle">
              {due.length} rappel{due.length > 1 ? 's' : ''} à traiter
            </p>
            <p className="text-dim text-sm mt-1">
              {due
                .slice(0, 3)
                .map(reminder => reminder.title)
                .join(' · ')}
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
        </div>
      </div>

      {!hasData && (
        <div className="empty-state space-y-3">
          <p>Aucune donnée de participation enregistrée pour le moment.</p>
          <p className="text-sm">
            Commencez par saisir une séance depuis les pages des programmes — les statistiques,
            graphiques et synthèses se calculent ensuite automatiquement.
          </p>
          <div className="flex flex-wrap gap-2 justify-center pt-2">
            <Link to="/activities" className="btn btn-primary">
              Saisir une activité
            </Link>
            <Link to="/atmosphere" className="btn btn-secondary">
              Atmosphère de Prière
            </Link>
            <Link to="/night-prayer" className="btn btn-secondary">
              Nuit de Prière
            </Link>
          </div>
        </div>
      )}

      {hasData && (
        <>
          <div className="grid-2">
            <div className="card">
              <h2 className="section-subtitle mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-gold" />
                Participation par programme — {getMonthName(month)}
              </h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={distribution.slice(0, 7)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="name"
                    stroke="var(--text-muted)"
                    fontSize={10}
                    tickFormatter={(value: string) => value.slice(0, 12)}
                  />
                  <YAxis stroke="var(--text-muted)" fontSize={12} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--gold-soft)' }} />
                  <Bar dataKey="value" name="Participants" fill={PALETTE[0]} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h2 className="section-subtitle mb-4 flex items-center gap-2">
                <ActivityIcon className="h-5 w-5 text-gold" />
                Répartition
              </h2>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={topPrograms}
                    cx="50%"
                    cy="50%"
                    outerRadius={92}
                    dataKey="value"
                    label={({ percent }: any) => `${Math.round((percent || 0) * 100)}%`}
                    labelLine={false}
                  >
                    {topPrograms.map((_, index) => (
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

          <div className="space-y-3">
            <h2 className="section-subtitle">Programmes du mois</h2>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Programme</th>
                    <th className="num">Participants</th>
                  </tr>
                </thead>
                <tbody>
                  {distribution.map((program, index) => (
                    <tr key={program.name}>
                      <td style={{ color: 'var(--text-primary)' }}>
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-full mr-2"
                          style={{ background: PALETTE[index % PALETTE.length] }}
                        />
                        {program.name}
                      </td>
                      <td className="num text-gold" style={{ fontWeight: 600 }}>
                        {program.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Activités à venir et rappels */}
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
                    {new Date(event.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short'
                    })}
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
                    {new Date(reminder.dueAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short'
                    })}
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
