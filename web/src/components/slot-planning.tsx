import { useState } from 'react';
import { Plus, Trash2, Clock, Users, AlertCircle, X } from 'lucide-react';
import {
  SlotSession,
  SlotSessionType,
  SlotAttendance,
  createEmptySlots,
  sumSlots
} from '@midp/shared';
import { useCollection } from '../hooks/use-collection';
import MonthlySummaryTable from './monthly-summary-table';

interface SlotPlanningProps {
  type: SlotSessionType;
  storageKey: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  /** La Nuit de prière de préparation au culte se tient uniquement le dimanche. */
  sundayOnly?: boolean;
}

export default function SlotPlanning({
  type,
  storageKey,
  title,
  subtitle,
  icon,
  sundayOnly = false
}: SlotPlanningProps) {
  const { items: sessions, add, remove } = useCollection<SlotSession>(storageKey);
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState('');
  const [conductorName, setConductorName] = useState('');
  const [remarks, setRemarks] = useState('');
  const [slots, setSlots] = useState<SlotAttendance[]>(createEmptySlots);
  const [error, setError] = useState('');

  const resetForm = () => {
    setDate('');
    setConductorName('');
    setRemarks('');
    setSlots(createEmptySlots());
    setError('');
  };

  const updateSlot = (index: number, field: keyof Omit<SlotAttendance, 'slot'>, value: string) => {
    const numeric = Math.max(0, Number(value) || 0);
    setSlots(prev =>
      prev.map((slot, i) => {
        if (i !== index) return slot;
        const next = { ...slot, [field]: numeric };
        if (field === 'men' || field === 'women') {
          next.total = next.men + next.women;
        }
        return next;
      })
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!date) {
      setError('La date est obligatoire.');
      return;
    }

    if (sundayOnly && new Date(date).getDay() !== 0) {
      setError('Cette activité se tient uniquement le dimanche.');
      return;
    }

    const invalidSlot = slots.find(slot => slot.men + slot.women > slot.total);
    if (invalidSlot) {
      setError(`Créneau ${invalidSlot.slot} : hommes + femmes dépasse le total.`);
      return;
    }

    add({ type, date, conductorName, slots, remarks } as Omit<SlotSession, 'id'>);
    resetForm();
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Supprimer cette séance ?')) remove(id);
  };

  const sorted = [...sessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const monthlyEntries = sessions.map(session => {
    const totals = sumSlots(session.slots);
    return {
      date: session.date,
      totalParticipants: totals.total,
      menCount: totals.men,
      womenCount: totals.women
    };
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="section-title">
            {icon}
            {title}
          </h1>
          <p className="text-dim text-sm mt-2">{subtitle}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus className="h-5 w-5" />
          Nouvelle séance
        </button>
      </div>

      {showForm && (
        <div className="card-gold space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="section-subtitle">Enregistrer une séance</h2>
            <button onClick={() => setShowForm(false)} className="icon-btn" aria-label="Fermer">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid-2">
              <div>
                <label className="label">Date {sundayOnly && '(dimanche)'}</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">Conducteur planifié</label>
                <input
                  type="text"
                  value={conductorName}
                  onChange={e => setConductorName(e.target.value)}
                  placeholder="Nom du conducteur"
                  className="input"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="label flex items-center gap-2">
                <Clock className="h-4 w-4 text-gold" />
                Connectés par créneau horaire
              </label>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Créneau</th>
                      <th className="num">Hommes</th>
                      <th className="num">Femmes</th>
                      <th className="num">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slots.map((slot, index) => (
                      <tr key={slot.slot}>
                        <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{slot.slot}</td>
                        <td className="num">
                          <input
                            type="number"
                            min={0}
                            value={slot.men}
                            onChange={e => updateSlot(index, 'men', e.target.value)}
                            className="input text-center"
                            style={{ maxWidth: '7rem', margin: '0 auto' }}
                          />
                        </td>
                        <td className="num">
                          <input
                            type="number"
                            min={0}
                            value={slot.women}
                            onChange={e => updateSlot(index, 'women', e.target.value)}
                            className="input text-center"
                            style={{ maxWidth: '7rem', margin: '0 auto' }}
                          />
                        </td>
                        <td className="num">
                          <input
                            type="number"
                            min={0}
                            value={slot.total}
                            onChange={e => updateSlot(index, 'total', e.target.value)}
                            className="input text-center text-gold"
                            style={{ maxWidth: '7rem', margin: '0 auto', fontWeight: 600 }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-dim text-xs">
                Le total se calcule automatiquement à partir des hommes et des femmes ; il reste
                modifiable si le détail par genre n'est pas connu.
              </p>
            </div>

            <div>
              <label className="label">Remarques</label>
              <textarea
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                rows={3}
                className="input"
                style={{ resize: 'vertical' }}
                placeholder="Observations sur la séance"
              />
            </div>

            {error && (
              <div className="badge-danger w-full justify-start py-2 px-3">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button type="submit" className="btn btn-primary flex-1">
                Enregistrer la séance
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForm();
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

      {sorted.length > 0 ? (
        <div className="space-y-4">
          {sorted.map(session => {
            const totals = sumSlots(session.slots);
            return (
              <div key={session.id} className="card space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="section-subtitle">
                      {new Date(session.date).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                    {session.conductorName && (
                      <p className="text-dim text-sm mt-1">Conducteur : {session.conductorName}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="badge-primary">
                      <Users className="h-3 w-3" />
                      {totals.total} connectés
                    </span>
                    <button
                      onClick={() => handleDelete(session.id)}
                      className="icon-btn icon-btn-danger"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="table-wrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Créneau</th>
                        <th className="num">Hommes</th>
                        <th className="num">Femmes</th>
                        <th className="num">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {session.slots.map(slot => (
                        <tr key={slot.slot}>
                          <td style={{ color: 'var(--text-primary)' }}>{slot.slot}</td>
                          <td className="num">{slot.men}</td>
                          <td className="num">{slot.women}</td>
                          <td className="num text-gold" style={{ fontWeight: 600 }}>
                            {slot.total}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Total</td>
                        <td className="num" style={{ fontWeight: 700 }}>{totals.men}</td>
                        <td className="num" style={{ fontWeight: 700 }}>{totals.women}</td>
                        <td className="num text-royal" style={{ fontWeight: 700 }}>{totals.total}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {session.remarks && (
                  <p className="text-soft text-sm">
                    <span className="text-dim">Remarques : </span>
                    {session.remarks}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <p>Aucune séance enregistrée.</p>
          <button onClick={() => setShowForm(true)} className="btn btn-primary mt-4 mx-auto">
            <Plus className="h-5 w-5" />
            Enregistrer la première séance
          </button>
        </div>
      )}

      <MonthlySummaryTable entries={monthlyEntries} title="Synthèse mensuelle automatique" />
    </div>
  );
}
