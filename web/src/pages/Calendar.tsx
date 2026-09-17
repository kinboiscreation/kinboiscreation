import { useMemo, useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  BellRing,
  Megaphone,
  CalendarPlus,
  X
} from 'lucide-react';
import {
  FISCAL_MONTH_ORDER,
  FISCAL_YEAR_START_MONTH,
  getCurrentFiscalYear,
  getFiscalYearLabel,
  getCalendarYearForFiscalMonth,
  getMonthName
} from '@midp/shared';
import { useCollection } from '../hooks/use-collection';
import { useReminders } from '../hooks/use-reminders';
import { useParticipation, summarizeMonth } from '../hooks/use-participation';

const DAYS_OF_WEEK = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  kind: 'activité' | 'annonce';
  note?: string;
  alarm: boolean;
}

const emptyEvent = {
  title: '',
  date: '',
  time: '',
  kind: 'activité' as 'activité' | 'annonce',
  note: '',
  alarm: true
};

export default function CalendarPage() {
  const { entries } = useParticipation();
  const { items: events, add: addEvent, remove: removeEvent } = useCollection<CalendarEvent>(
    'midp-calendar-events'
  );
  const { schedule } = useReminders();

  const today = new Date();
  const [fiscalYear, setFiscalYear] = useState(getCurrentFiscalYear());
  const [monthIndex, setMonthIndex] = useState(() =>
    FISCAL_MONTH_ORDER.indexOf(today.getMonth() + 1)
  );
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyEvent);

  const month = FISCAL_MONTH_ORDER[monthIndex];
  const year = getCalendarYearForFiscalMonth(month, fiscalYear);

  const summary = useMemo(() => summarizeMonth(entries, month, year), [entries, month, year]);

  /** Détail du mois par programme. */
  const byProgram = useMemo(() => {
    const grouped = new Map<string, { sessions: number; participants: number }>();
    summary.entries.forEach(entry => {
      const current = grouped.get(entry.label) ?? { sessions: 0, participants: 0 };
      current.sessions += 1;
      current.participants += entry.participants;
      grouped.set(entry.label, current);
    });
    return [...grouped.entries()]
      .map(([name, value]) => ({
        name,
        ...value,
        average: value.sessions > 0 ? Math.round(value.participants / value.sessions) : 0
      }))
      .sort((a, b) => b.participants - a.participants);
  }, [summary.entries]);

  /** Vue annuelle août → juillet. */
  const fiscalOverview = useMemo(
    () =>
      FISCAL_MONTH_ORDER.map(fiscalMonth => {
        const calendarYear = getCalendarYearForFiscalMonth(fiscalMonth, fiscalYear);
        const monthSummary = summarizeMonth(entries, fiscalMonth, calendarYear);
        return {
          month: fiscalMonth,
          year: calendarYear,
          label: getMonthName(fiscalMonth),
          ...monthSummary
        };
      }),
    [entries, fiscalYear]
  );

  const goPrevious = () => {
    if (monthIndex === 0) {
      setFiscalYear(fiscalYear - 1);
      setMonthIndex(FISCAL_MONTH_ORDER.length - 1);
    } else {
      setMonthIndex(monthIndex - 1);
    }
  };

  const goNext = () => {
    if (monthIndex === FISCAL_MONTH_ORDER.length - 1) {
      setFiscalYear(fiscalYear + 1);
      setMonthIndex(0);
    } else {
      setMonthIndex(monthIndex + 1);
    }
  };

  const handleAddEvent = (submitEvent: React.FormEvent) => {
    submitEvent.preventDefault();
    if (!form.title.trim() || !form.date) return;

    const created = addEvent(form as Omit<CalendarEvent, 'id'>);

    if (form.alarm) {
      const dueAt = new Date(`${form.date}T${form.time || '08:00'}`);
      schedule({
        title: form.title,
        message: form.note,
        dueAt: dueAt.toISOString(),
        sourceType: 'event',
        sourceId: created.id
      });
    }

    setForm(emptyEvent);
    setShowForm(false);
  };

  /* --- Construction de la grille, semaine commençant lundi --- */
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstWeekday = (new Date(year, month - 1, 1).getDay() + 6) % 7;
  const cells: (number | null)[] = [
    ...Array<null>(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ];

  const entriesForDay = (day: number) =>
    summary.entries.filter(entry => new Date(entry.date).getDate() === day);

  const eventsForDay = (day: number) =>
    events.filter(event => {
      const date = new Date(event.date);
      return (
        date.getDate() === day && date.getMonth() + 1 === month && date.getFullYear() === year
      );
    });

  const isToday = (day: number) =>
    today.getDate() === day && today.getMonth() + 1 === month && today.getFullYear() === year;

  const upcomingEvents = [...events]
    .filter(event => new Date(event.date) >= new Date(today.toDateString()))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="section-title">
            <CalendarIcon className="h-8 w-8 text-gold" />
            Calendrier Intelligent
          </h1>
          <p className="text-dim text-sm mt-2">
            Année {getFiscalYearLabel(fiscalYear)}, démarrant au mois d'août.
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus className="h-5 w-5" />
          Ajouter un événement
        </button>
      </div>

      {showForm && (
        <div className="card-gold space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="section-subtitle">Nouvel événement ou annonce</h2>
            <button onClick={() => setShowForm(false)} className="icon-btn" aria-label="Fermer">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleAddEvent} className="space-y-5">
            <div className="grid-2">
              <div>
                <label className="label">Intitulé</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">Type</label>
                <select
                  value={form.kind}
                  onChange={e => setForm({ ...form, kind: e.target.value as 'activité' | 'annonce' })}
                  className="input"
                >
                  <option value="activité">Activité à venir</option>
                  <option value="annonce">Annonce importante</option>
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div>
                <label className="label">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">Heure du rappel</label>
                <input
                  type="time"
                  value={form.time}
                  onChange={e => setForm({ ...form, time: e.target.value })}
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="label">Note</label>
              <textarea
                value={form.note}
                onChange={e => setForm({ ...form, note: e.target.value })}
                rows={2}
                className="input"
                style={{ resize: 'vertical' }}
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.alarm}
                onChange={e => setForm({ ...form, alarm: e.target.checked })}
                className="checkbox"
              />
              <span className="text-soft text-sm">Programmer une alarme de rappel</span>
            </label>

            <div className="flex gap-3">
              <button type="submit" className="btn btn-primary flex-1">
                <CalendarPlus className="h-4 w-4" />
                Ajouter
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm(emptyEvent);
                  setShowForm(false);
                }}
                className="btn btn-secondary flex-1"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grille mensuelle */}
      <div className="card space-y-5">
        <div className="flex items-center justify-between gap-3">
          <button onClick={goPrevious} className="icon-btn" aria-label="Mois précédent">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="text-center">
            <h2 className="section-subtitle">
              {getMonthName(month)} {year}
            </h2>
            {month === FISCAL_YEAR_START_MONTH && (
              <span className="badge-royal mt-1">Début de l'année</span>
            )}
          </div>
          <button onClick={goNext} className="icon-btn" aria-label="Mois suivant">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {DAYS_OF_WEEK.map(day => (
            <div key={day} className="p-2 text-center stat-label">
              {day}
            </div>
          ))}

          {cells.map((day, index) => {
            if (day === null) return <div key={`empty-${index}`} />;

            const dayEntries = entriesForDay(day);
            const dayEvents = eventsForDay(day);
            const total = dayEntries.reduce((sum, entry) => sum + entry.participants, 0);

            return (
              <div
                key={day}
                className="p-1.5 rounded-lg min-h-[4.5rem] text-xs"
                style={{
                  background: isToday(day) ? 'var(--gold-soft)' : 'var(--bg-surface)',
                  border: `1px solid ${isToday(day) ? 'var(--gold-border)' : 'var(--border)'}`
                }}
              >
                <div
                  className="font-semibold mb-1"
                  style={{ color: isToday(day) ? 'var(--gold-bright)' : 'var(--text-primary)' }}
                >
                  {day}
                </div>

                {dayEntries.slice(0, 2).map((entry, i) => (
                  <div
                    key={i}
                    className="truncate rounded px-1 mb-0.5"
                    style={{ background: 'var(--royal-soft)', color: 'var(--royal-bright)' }}
                    title={`${entry.label} — ${entry.participants} participants`}
                  >
                    {entry.label}
                  </div>
                ))}
                {dayEntries.length > 2 && (
                  <div className="text-dim px-1">+{dayEntries.length - 2} autres</div>
                )}

                {dayEvents.map(event => (
                  <div
                    key={event.id}
                    className="truncate rounded px-1 mb-0.5 flex items-center gap-0.5"
                    style={{ background: 'var(--gold-soft)', color: 'var(--gold-bright)' }}
                    title={event.title}
                  >
                    {event.alarm && <BellRing className="h-2.5 w-2.5 shrink-0" />}
                    {event.title}
                  </div>
                ))}

                {total > 0 && <div className="text-gold px-1 mt-0.5">{total} pers.</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Statistiques du mois */}
      <div className="grid-4">
        <div className="stat-box">
          <span className="stat-label">Participants du mois</span>
          <span className="stat-number">{summary.participants}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Séances du mois</span>
          <span className="stat-number">{summary.sessions}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Moyenne du mois</span>
          <span className="stat-number-royal">{summary.average}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Hommes / Femmes</span>
          <span className="stat-number-royal" style={{ fontSize: '1.5rem' }}>
            {summary.men} / {summary.women}
          </span>
        </div>
      </div>

      {byProgram.length > 0 && (
        <div className="space-y-3">
          <h2 className="section-subtitle">Statistiques par programme — {getMonthName(month)}</h2>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Programme</th>
                  <th className="num">Séances</th>
                  <th className="num">Participants</th>
                  <th className="num">Moyenne</th>
                </tr>
              </thead>
              <tbody>
                {byProgram.map(program => (
                  <tr key={program.name}>
                    <td style={{ color: 'var(--text-primary)' }}>{program.name}</td>
                    <td className="num">{program.sessions}</td>
                    <td className="num text-gold" style={{ fontWeight: 600 }}>
                      {program.participants}
                    </td>
                    <td className="num text-royal" style={{ fontWeight: 600 }}>
                      {program.average}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Événements à venir */}
      {upcomingEvents.length > 0 && (
        <div className="card space-y-3">
          <h2 className="section-subtitle">Activités et annonces à venir</h2>
          {upcomingEvents.map(event => (
            <div
              key={event.id}
              className="flex items-start justify-between gap-3 py-2"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={event.kind === 'annonce' ? 'badge-primary' : 'badge-royal'}>
                    {event.kind === 'annonce' ? (
                      <Megaphone className="h-3 w-3" />
                    ) : (
                      <CalendarIcon className="h-3 w-3" />
                    )}
                    {event.kind}
                  </span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{event.title}</span>
                  {event.alarm && <BellRing className="h-3.5 w-3.5 text-gold" />}
                </div>
                <p className="text-dim text-xs mt-1">
                  {new Date(event.date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                  })}
                  {event.time && ` à ${event.time}`}
                  {event.note && ` — ${event.note}`}
                </p>
              </div>
              <button
                onClick={() => removeEvent(event.id)}
                className="icon-btn icon-btn-danger"
                aria-label="Supprimer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Vue annuelle août → juillet */}
      <div className="space-y-3">
        <h2 className="section-subtitle">
          Année {getFiscalYearLabel(fiscalYear)} — vue d'ensemble
        </h2>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Mois</th>
                <th className="num">Séances</th>
                <th className="num">Participants</th>
                <th className="num">Moyenne</th>
              </tr>
            </thead>
            <tbody>
              {fiscalOverview.map(row => (
                <tr
                  key={`${row.month}-${row.year}`}
                  style={
                    row.month === month && row.year === year
                      ? { background: 'var(--gold-soft)' }
                      : undefined
                  }
                >
                  <td style={{ color: 'var(--text-primary)' }}>
                    {row.label} {row.year}
                  </td>
                  <td className="num">{row.sessions}</td>
                  <td className="num text-gold">{row.participants}</td>
                  <td className="num">{row.average}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
