import { useState } from 'react';
import {
  Clock,
  Plus,
  Trash2,
  X,
  AlertCircle,
  Video,
  MapPin,
  ExternalLink,
  BellRing,
  UserPlus
} from 'lucide-react';
import {
  MeetingRecord,
  MeetingAttendance,
  AttendanceStatus,
  ATTENDANCE_LABELS
} from '@midp/shared';
import { useCollection } from '../hooks/use-collection';

const emptyForm = {
  title: '',
  date: '',
  time: '',
  location: 'église' as 'église' | 'zoom',
  zoomLink: '',
  agenda: '',
  remarks: '',
  reminderEnabled: true
};

export default function Meetings() {
  const { items: meetings, add, update, remove } = useCollection<MeetingRecord>('midp-meetings');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [attendeeDraft, setAttendeeDraft] = useState<Record<string, string>>({});

  const setField = <K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!form.title.trim()) {
      setError('Le titre est obligatoire.');
      return;
    }
    if (!form.date || !form.time) {
      setError('La date et l\'heure sont obligatoires.');
      return;
    }
    if (form.location === 'zoom' && !form.zoomLink.trim()) {
      setError('Le lien Zoom est obligatoire pour une réunion en ligne.');
      return;
    }

    add({ ...form, attendees: [] } as Omit<MeetingRecord, 'id'>);
    setForm(emptyForm);
    setShowForm(false);
  };

  const addAttendee = (meeting: MeetingRecord) => {
    const name = (attendeeDraft[meeting.id] || '').trim();
    if (!name) return;

    const attendees: MeetingAttendance[] = [...meeting.attendees, { name, status: 'present' }];
    update(meeting.id, { attendees } as Partial<MeetingRecord>);
    setAttendeeDraft(prev => ({ ...prev, [meeting.id]: '' }));
  };

  const cycleStatus = (meeting: MeetingRecord, index: number) => {
    const order: AttendanceStatus[] = ['present', 'justified', 'absent'];
    const attendees = meeting.attendees.map((attendee, i) => {
      if (i !== index) return attendee;
      const next = order[(order.indexOf(attendee.status) + 1) % order.length];
      if (next === 'justified') {
        const reason = window.prompt("Motif de l'absence justifiée :", attendee.reason || '') || '';
        return { ...attendee, status: next, reason };
      }
      return { ...attendee, status: next, reason: '' };
    });
    update(meeting.id, { attendees } as Partial<MeetingRecord>);
  };

  const removeAttendee = (meeting: MeetingRecord, index: number) => {
    const attendees = meeting.attendees.filter((_, i) => i !== index);
    update(meeting.id, { attendees } as Partial<MeetingRecord>);
  };

  const statusClass = (status: AttendanceStatus) =>
    status === 'present' ? 'badge-success' : status === 'justified' ? 'badge-warning' : 'badge-danger';

  const sorted = [...meetings].sort(
    (a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime()
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="section-title">
            <Clock className="h-8 w-8 text-gold" />
            Réunions
          </h1>
          <p className="text-dim text-sm mt-2">
            Ordre du jour, lieu ou lien Zoom, rappel et suivi des présences.
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus className="h-5 w-5" />
          Nouvelle réunion
        </button>
      </div>

      {showForm && (
        <div className="card-gold space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="section-subtitle">Planifier une réunion</h2>
            <button onClick={() => setShowForm(false)} className="icon-btn" aria-label="Fermer">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">Titre</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setField('title', e.target.value)}
                className="input"
                placeholder="Objet de la réunion"
                required
              />
            </div>

            <div className="grid-2">
              <div>
                <label className="label">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setField('date', e.target.value)}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">Heure</label>
                <input
                  type="time"
                  value={form.time}
                  onChange={e => setField('time', e.target.value)}
                  className="input"
                  required
                />
              </div>
            </div>

            <div className="grid-2">
              <div>
                <label className="label">Lieu</label>
                <select
                  value={form.location}
                  onChange={e => setField('location', e.target.value as 'église' | 'zoom')}
                  className="input"
                >
                  <option value="église">Église</option>
                  <option value="zoom">Zoom</option>
                </select>
              </div>
              {form.location === 'zoom' && (
                <div>
                  <label className="label">Lien Zoom</label>
                  <input
                    type="url"
                    value={form.zoomLink}
                    onChange={e => setField('zoomLink', e.target.value)}
                    placeholder="https://zoom.us/j/..."
                    className="input"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="label">Ordre du jour</label>
              <textarea
                value={form.agenda}
                onChange={e => setField('agenda', e.target.value)}
                rows={4}
                className="input"
                style={{ resize: 'vertical' }}
                placeholder="Points à traiter"
              />
            </div>

            <div>
              <label className="label">Remarques</label>
              <textarea
                value={form.remarks}
                onChange={e => setField('remarks', e.target.value)}
                rows={3}
                className="input"
                style={{ resize: 'vertical' }}
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.reminderEnabled}
                onChange={e => setField('reminderEnabled', e.target.checked)}
                className="checkbox"
              />
              <span className="text-soft text-sm">Activer le rappel de la réunion</span>
            </label>

            {error && (
              <div className="badge-danger w-full justify-start py-2 px-3">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button type="submit" className="btn btn-primary flex-1">
                Créer la réunion
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm(emptyForm);
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
          {sorted.map(meeting => {
            const present = meeting.attendees.filter(a => a.status === 'present').length;
            const justified = meeting.attendees.filter(a => a.status === 'justified').length;
            const absent = meeting.attendees.filter(a => a.status === 'absent').length;

            return (
              <div key={meeting.id} className="card space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="section-subtitle">{meeting.title}</h3>
                    <p className="text-dim text-sm mt-1">
                      {new Date(meeting.date).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}{' '}
                      à {meeting.time}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {meeting.reminderEnabled && (
                      <span className="badge-royal">
                        <BellRing className="h-3 w-3" />
                        Rappel
                      </span>
                    )}
                    <button
                      onClick={() => window.confirm('Supprimer cette réunion ?') && remove(meeting.id)}
                      className="icon-btn icon-btn-danger"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="badge-neutral">
                    {meeting.location === 'zoom' ? (
                      <Video className="h-3 w-3" />
                    ) : (
                      <MapPin className="h-3 w-3" />
                    )}
                    {meeting.location === 'zoom' ? 'Zoom' : 'Église'}
                  </span>
                  {meeting.zoomLink && (
                    <a href={meeting.zoomLink} target="_blank" rel="noreferrer" className="badge-info">
                      <ExternalLink className="h-3 w-3" />
                      Rejoindre
                    </a>
                  )}
                  <span className="badge-success">{present} présents</span>
                  <span className="badge-warning">{justified} justifiés</span>
                  <span className="badge-danger">{absent} non présents</span>
                </div>

                {meeting.agenda && (
                  <div>
                    <p className="stat-label mb-1">Ordre du jour</p>
                    <p className="text-soft text-sm whitespace-pre-line">{meeting.agenda}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="stat-label">Présences</p>

                  {meeting.attendees.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {meeting.attendees.map((attendee, index) => (
                        <span key={index} className="inline-flex items-center gap-1">
                          <button
                            onClick={() => cycleStatus(meeting, index)}
                            className={statusClass(attendee.status)}
                            title={`${ATTENDANCE_LABELS[attendee.status]} — cliquer pour changer`}
                          >
                            {attendee.name}
                            {attendee.reason ? ` (${attendee.reason})` : ''}
                          </button>
                          <button
                            onClick={() => removeAttendee(meeting, index)}
                            className="icon-btn icon-btn-danger"
                            style={{ padding: '0.25rem' }}
                            aria-label={`Retirer ${attendee.name}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={attendeeDraft[meeting.id] || ''}
                      onChange={e =>
                        setAttendeeDraft(prev => ({ ...prev, [meeting.id]: e.target.value }))
                      }
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addAttendee(meeting);
                        }
                      }}
                      placeholder="Nom du participant"
                      className="input"
                      style={{ maxWidth: '18rem' }}
                    />
                    <button onClick={() => addAttendee(meeting)} className="btn btn-secondary">
                      <UserPlus className="h-4 w-4" />
                      Ajouter
                    </button>
                  </div>
                  <p className="text-dim text-xs">
                    Cliquez sur un nom pour basculer entre présent, absence justifiée et non présent.
                  </p>
                </div>

                {meeting.remarks && (
                  <p className="text-soft text-sm">
                    <span className="text-dim">Remarques : </span>
                    {meeting.remarks}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <p>Aucune réunion planifiée.</p>
          <button onClick={() => setShowForm(true)} className="btn btn-primary mt-4 mx-auto">
            <Plus className="h-5 w-5" />
            Planifier la première réunion
          </button>
        </div>
      )}
    </div>
  );
}
