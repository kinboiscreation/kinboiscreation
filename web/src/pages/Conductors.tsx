import { useState } from 'react';
import {
  Users,
  Plus,
  Trash2,
  X,
  AlertCircle,
  CalendarDays,
  ClipboardList,
  Clock,
  CheckCircle2,
  UserX
} from 'lucide-react';
import {
  ActivityType,
  ACTIVITY_NAMES,
  ConductorRecord,
  ScheduleEntry,
  ScheduleOutcome,
  SCHEDULE_OUTCOME_LABELS,
  buildConductorReport,
  getMonthName
} from '@midp/shared';
import { useCollection } from '../hooks/use-collection';

const ACTIVITY_TYPES = Object.keys(ACTIVITY_NAMES) as ActivityType[];

type Tab = 'database' | 'planning' | 'report';

const emptyConductor = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: 'conductor' as 'conductor' | 'assistant'
};

const emptyAssignment = {
  conductorId: '',
  activityType: 'matinale' as ActivityType,
  date: ''
};

export default function Conductors() {
  const {
    items: conductors,
    add: addConductor,
    update: updateConductor,
    remove: removeConductor
  } = useCollection<ConductorRecord>('midp-conductors');

  const {
    items: schedule,
    add: addAssignment,
    update: updateAssignment,
    remove: removeAssignment
  } = useCollection<ScheduleEntry>('midp-conductor-schedule');

  const [tab, setTab] = useState<Tab>('database');
  const [showConductorForm, setShowConductorForm] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [conductorForm, setConductorForm] = useState(emptyConductor);
  const [assignmentForm, setAssignmentForm] = useState(emptyAssignment);
  const [error, setError] = useState('');

  const now = new Date();
  const [reportMonth, setReportMonth] = useState(now.getMonth() + 1);
  const [reportYear, setReportYear] = useState(now.getFullYear());

  const activeConductors = conductors.filter(c => c.status === 'active');

  /* ---------------- Base de données des conducteurs ---------------- */

  const handleConductorSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!conductorForm.firstName.trim() || !conductorForm.lastName.trim()) {
      setError('Le prénom et le nom sont obligatoires.');
      return;
    }

    addConductor({
      ...conductorForm,
      status: 'active',
      joinDate: new Date().toISOString()
    } as Omit<ConductorRecord, 'id'>);

    setConductorForm(emptyConductor);
    setShowConductorForm(false);
  };

  const handleDeleteConductor = (id: string) => {
    if (!window.confirm('Supprimer ce conducteur et ses assignations ?')) return;
    schedule.filter(entry => entry.conductorId === id).forEach(entry => removeAssignment(entry.id));
    removeConductor(id);
  };

  /* ---------------- Planning hebdomadaire ---------------- */

  const handleAssignmentSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    const conductor = conductors.find(c => c.id === assignmentForm.conductorId);
    if (!conductor) {
      setError('Sélectionnez un conducteur.');
      return;
    }
    if (!assignmentForm.date) {
      setError('La date est obligatoire.');
      return;
    }

    addAssignment({
      ...assignmentForm,
      conductorName: `${conductor.firstName} ${conductor.lastName}`,
      outcome: 'pending'
    } as Omit<ScheduleEntry, 'id'>);

    setAssignmentForm({ ...emptyAssignment, date: assignmentForm.date });
    setShowAssignmentForm(false);
  };

  const handleOutcome = (entry: ScheduleEntry, outcome: ScheduleOutcome) => {
    if (outcome === 'absent') {
      const reason = window.prompt("Motif de l'absence :", entry.absenceReason || '');
      if (reason === null) return;
      updateAssignment(entry.id, { outcome, absenceReason: reason, lateMinutes: 0 } as Partial<ScheduleEntry>);
      return;
    }

    if (outcome === 'late') {
      const minutes = window.prompt('Retard en minutes :', String(entry.lateMinutes || 0));
      if (minutes === null) return;
      updateAssignment(entry.id, {
        outcome,
        lateMinutes: Math.max(0, Number(minutes) || 0),
        absenceReason: ''
      } as Partial<ScheduleEntry>);
      return;
    }

    updateAssignment(entry.id, { outcome, absenceReason: '', lateMinutes: 0 } as Partial<ScheduleEntry>);
  };

  const sortedSchedule = [...schedule].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const report = buildConductorReport(schedule, reportMonth, reportYear);

  const outcomeBadge = (entry: ScheduleEntry) => {
    switch (entry.outcome) {
      case 'conducted':
        return <span className="badge-success">{SCHEDULE_OUTCOME_LABELS.conducted}</span>;
      case 'absent':
        return <span className="badge-danger">{SCHEDULE_OUTCOME_LABELS.absent}</span>;
      case 'late':
        return (
          <span className="badge-warning">
            {SCHEDULE_OUTCOME_LABELS.late} ({entry.lateMinutes} min)
          </span>
        );
      default:
        return <span className="badge-neutral">{SCHEDULE_OUTCOME_LABELS.pending}</span>;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="section-title">
            <Users className="h-8 w-8 text-gold" />
            Conducteurs
          </h1>
          <p className="text-dim text-sm mt-2">
            Base des conducteurs, planning hebdomadaire et rapport mensuel automatique.
          </p>
        </div>
        {tab === 'database' && (
          <button onClick={() => setShowConductorForm(!showConductorForm)} className="btn btn-primary">
            <Plus className="h-5 w-5" />
            Ajouter un conducteur
          </button>
        )}
        {tab === 'planning' && (
          <button onClick={() => setShowAssignmentForm(!showAssignmentForm)} className="btn btn-primary">
            <Plus className="h-5 w-5" />
            Planifier
          </button>
        )}
      </div>

      <div className="tab-bar">
        <button onClick={() => setTab('database')} className={`tab ${tab === 'database' ? 'tab-active' : ''}`}>
          <Users className="h-4 w-4" />
          Base des conducteurs
        </button>
        <button onClick={() => setTab('planning')} className={`tab ${tab === 'planning' ? 'tab-active' : ''}`}>
          <CalendarDays className="h-4 w-4" />
          Planning hebdomadaire
        </button>
        <button onClick={() => setTab('report')} className={`tab ${tab === 'report' ? 'tab-active' : ''}`}>
          <ClipboardList className="h-4 w-4" />
          Rapport mensuel
        </button>
      </div>

      {error && (
        <div className="badge-danger w-full justify-start py-2 px-3">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* ---------------- Onglet base ---------------- */}
      {tab === 'database' && (
        <>
          <div className="grid-4">
            <div className="stat-box">
              <span className="stat-label">Total</span>
              <span className="stat-number">{conductors.length}</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Actifs</span>
              <span className="stat-number">{activeConductors.length}</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Inactifs</span>
              <span className="stat-number-royal">{conductors.length - activeConductors.length}</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Assignations</span>
              <span className="stat-number">{schedule.length}</span>
            </div>
          </div>

          {showConductorForm && (
            <div className="card-gold space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="section-subtitle">Nouveau conducteur</h2>
                <button onClick={() => setShowConductorForm(false)} className="icon-btn" aria-label="Fermer">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleConductorSubmit} className="space-y-6">
                <div className="grid-2">
                  <div>
                    <label className="label">Prénom</label>
                    <input
                      type="text"
                      value={conductorForm.firstName}
                      onChange={e => setConductorForm({ ...conductorForm, firstName: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Nom</label>
                    <input
                      type="text"
                      value={conductorForm.lastName}
                      onChange={e => setConductorForm({ ...conductorForm, lastName: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div>
                    <label className="label">Email</label>
                    <input
                      type="email"
                      value={conductorForm.email}
                      onChange={e => setConductorForm({ ...conductorForm, email: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Téléphone</label>
                    <input
                      type="tel"
                      value={conductorForm.phone}
                      onChange={e => setConductorForm({ ...conductorForm, phone: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Rôle</label>
                  <select
                    value={conductorForm.role}
                    onChange={e =>
                      setConductorForm({ ...conductorForm, role: e.target.value as 'conductor' | 'assistant' })
                    }
                    className="input"
                  >
                    <option value="conductor">Conducteur</option>
                    <option value="assistant">Assistant</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <button type="submit" className="btn btn-primary flex-1">
                    Ajouter
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConductorForm(false)}
                    className="btn btn-secondary flex-1"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}

          {conductors.length > 0 ? (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Contact</th>
                    <th>Rôle</th>
                    <th className="num">Statut</th>
                    <th className="num">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {conductors.map(conductor => (
                    <tr key={conductor.id}>
                      <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                        {conductor.firstName} {conductor.lastName}
                      </td>
                      <td>
                        <div className="text-xs">
                          <p>{conductor.email}</p>
                          {conductor.phone && <p className="text-dim">{conductor.phone}</p>}
                        </div>
                      </td>
                      <td>{conductor.role === 'conductor' ? 'Conducteur' : 'Assistant'}</td>
                      <td className="num">
                        <button
                          onClick={() =>
                            updateConductor(conductor.id, {
                              status: conductor.status === 'active' ? 'inactive' : 'active'
                            } as Partial<ConductorRecord>)
                          }
                          className={conductor.status === 'active' ? 'badge-success' : 'badge-danger'}
                        >
                          {conductor.status === 'active' ? 'Actif' : 'Inactif'}
                        </button>
                      </td>
                      <td className="num">
                        <button
                          onClick={() => handleDeleteConductor(conductor.id)}
                          className="icon-btn icon-btn-danger"
                          aria-label="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <p>Aucun conducteur enregistré.</p>
            </div>
          )}
        </>
      )}

      {/* ---------------- Onglet planning ---------------- */}
      {tab === 'planning' && (
        <>
          {showAssignmentForm && (
            <div className="card-gold space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="section-subtitle">Planifier un conducteur</h2>
                <button onClick={() => setShowAssignmentForm(false)} className="icon-btn" aria-label="Fermer">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {activeConductors.length === 0 ? (
                <p className="text-dim text-sm">
                  Ajoutez d'abord un conducteur actif dans la base pour pouvoir le planifier.
                </p>
              ) : (
                <form onSubmit={handleAssignmentSubmit} className="space-y-6">
                  <div className="grid-2">
                    <div>
                      <label className="label">Conducteur</label>
                      <select
                        value={assignmentForm.conductorId}
                        onChange={e => setAssignmentForm({ ...assignmentForm, conductorId: e.target.value })}
                        className="input"
                        required
                      >
                        <option value="">Sélectionner…</option>
                        {activeConductors.map(conductor => (
                          <option key={conductor.id} value={conductor.id}>
                            {conductor.firstName} {conductor.lastName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label">Date</label>
                      <input
                        type="date"
                        value={assignmentForm.date}
                        onChange={e => setAssignmentForm({ ...assignmentForm, date: e.target.value })}
                        className="input"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">Activité</label>
                    <select
                      value={assignmentForm.activityType}
                      onChange={e =>
                        setAssignmentForm({ ...assignmentForm, activityType: e.target.value as ActivityType })
                      }
                      className="input"
                    >
                      {ACTIVITY_TYPES.map(type => (
                        <option key={type} value={type}>
                          {ACTIVITY_NAMES[type]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-3">
                    <button type="submit" className="btn btn-primary flex-1">
                      Planifier
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAssignmentForm(false)}
                      className="btn btn-secondary flex-1"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {sortedSchedule.length > 0 ? (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Conducteur</th>
                    <th>Activité</th>
                    <th>Issue</th>
                    <th className="num">Marquer</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedSchedule.map(entry => (
                    <tr key={entry.id}>
                      <td style={{ color: 'var(--text-primary)' }}>
                        {new Date(entry.date).toLocaleDateString('fr-FR', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short'
                        })}
                      </td>
                      <td>{entry.conductorName}</td>
                      <td className="text-xs">{ACTIVITY_NAMES[entry.activityType]}</td>
                      <td>
                        {outcomeBadge(entry)}
                        {entry.outcome === 'absent' && entry.absenceReason && (
                          <p className="text-dim text-xs mt-1">Motif : {entry.absenceReason}</p>
                        )}
                      </td>
                      <td className="num">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOutcome(entry, 'conducted')}
                            className="icon-btn"
                            title="A conduit"
                            aria-label="A conduit"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleOutcome(entry, 'late')}
                            className="icon-btn"
                            title="En retard"
                            aria-label="En retard"
                          >
                            <Clock className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleOutcome(entry, 'absent')}
                            className="icon-btn"
                            title="Absent"
                            aria-label="Absent"
                          >
                            <UserX className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => removeAssignment(entry.id)}
                            className="icon-btn icon-btn-danger"
                            title="Supprimer"
                            aria-label="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <p>Aucune assignation planifiée.</p>
            </div>
          )}
        </>
      )}

      {/* ---------------- Onglet rapport ---------------- */}
      {tab === 'report' && (
        <>
          <div className="card flex flex-wrap items-center gap-3">
            <select
              value={reportMonth}
              onChange={e => setReportMonth(Number(e.target.value))}
              className="input"
              style={{ maxWidth: '12rem' }}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>
                  {getMonthName(month)}
                </option>
              ))}
            </select>
            <select
              value={reportYear}
              onChange={e => setReportYear(Number(e.target.value))}
              className="input"
              style={{ maxWidth: '9rem' }}
            >
              {Array.from({ length: 5 }, (_, i) => now.getFullYear() - i).map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <p className="text-dim text-sm">
              Rapport généré automatiquement à partir des assignations marquées.
            </p>
          </div>

          {report.length > 0 ? (
            <>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Conducteur</th>
                      <th className="num">Planifié</th>
                      <th className="num">A conduit</th>
                      <th className="num">Absences</th>
                      <th className="num">Retards</th>
                      <th className="num">Minutes de retard</th>
                      <th className="num">Fiabilité</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.map(stat => (
                      <tr key={stat.conductorId}>
                        <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                          {stat.conductorName}
                        </td>
                        <td className="num">{stat.planned}</td>
                        <td className="num text-gold" style={{ fontWeight: 600 }}>
                          {stat.conducted}
                        </td>
                        <td className="num">{stat.absent}</td>
                        <td className="num">{stat.late}</td>
                        <td className="num">{stat.totalLateMinutes}</td>
                        <td className="num">
                          <span
                            className={
                              stat.reliability >= 80
                                ? 'badge-success'
                                : stat.reliability >= 50
                                  ? 'badge-warning'
                                  : 'badge-danger'
                            }
                          >
                            {stat.reliability}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {report.some(stat => stat.absenceReasons.length > 0) && (
                <div className="card space-y-3">
                  <h3 className="section-subtitle">Motifs d'absence</h3>
                  {report
                    .filter(stat => stat.absenceReasons.length > 0)
                    .map(stat => (
                      <div key={stat.conductorId}>
                        <p style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                          {stat.conductorName}
                        </p>
                        <ul className="text-soft text-sm list-disc pl-5">
                          {stat.absenceReasons.map((reason, index) => (
                            <li key={index}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <p>
                Aucune assignation pour {getMonthName(reportMonth)} {reportYear}.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
