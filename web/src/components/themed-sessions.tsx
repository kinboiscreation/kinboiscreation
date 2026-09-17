import { useState } from 'react';
import { Plus, Trash2, X, AlertCircle, Paperclip, BellRing, ExternalLink } from 'lucide-react';
import { ThemedSession, ThemedSessionKind } from '@midp/shared';
import { useCollection } from '../hooks/use-collection';
import MonthlySummaryTable from './monthly-summary-table';

interface ThemedSessionsProps {
  kind: ThemedSessionKind;
  storageKey: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  /** L'Atmosphère de prière se tient le vendredi. */
  fridayOnly?: boolean;
  /** Les veillées précisent une heure et joignent les sujets de prière. */
  withTime?: boolean;
  withDocument?: boolean;
  withAnnouncement?: boolean;
}

const emptyForm = {
  theme: '',
  date: '',
  time: '',
  announcement: '',
  remarks: '',
  documentName: '',
  documentUrl: '',
  totalParticipants: 0,
  menCount: 0,
  womenCount: 0,
  reminderEnabled: false
};

export default function ThemedSessions({
  kind,
  storageKey,
  title,
  subtitle,
  icon,
  fridayOnly = false,
  withTime = false,
  withDocument = false,
  withAnnouncement = false
}: ThemedSessionsProps) {
  const { items: sessions, add, remove } = useCollection<ThemedSession>(storageKey);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const setField = <K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setField('documentName', file.name);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!form.theme.trim()) {
      setError('Le thème est obligatoire.');
      return;
    }
    if (!form.date) {
      setError('La date est obligatoire.');
      return;
    }
    if (fridayOnly && new Date(form.date).getDay() !== 5) {
      setError("L'Atmosphère de prière se tient le vendredi.");
      return;
    }
    if (form.menCount + form.womenCount > form.totalParticipants) {
      setError('Hommes + femmes dépasse le nombre total de participants.');
      return;
    }

    add({ ...form, kind } as Omit<ThemedSession, 'id'>);
    setForm(emptyForm);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Supprimer cette séance ?')) remove(id);
  };

  const sorted = [...sessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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
            <div>
              <label className="label">Thème</label>
              <input
                type="text"
                value={form.theme}
                onChange={e => setField('theme', e.target.value)}
                placeholder="Thème de la séance"
                className="input"
                required
              />
            </div>

            <div className="grid-2">
              <div>
                <label className="label">Date {fridayOnly && '(vendredi)'}</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setField('date', e.target.value)}
                  className="input"
                  required
                />
              </div>
              {withTime && (
                <div>
                  <label className="label">Heure</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={e => setField('time', e.target.value)}
                    className="input"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="label">Participants</label>
                <input
                  type="number"
                  min={0}
                  value={form.totalParticipants}
                  onChange={e => setField('totalParticipants', Math.max(0, Number(e.target.value) || 0))}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Hommes</label>
                <input
                  type="number"
                  min={0}
                  value={form.menCount}
                  onChange={e => setField('menCount', Math.max(0, Number(e.target.value) || 0))}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Femmes</label>
                <input
                  type="number"
                  min={0}
                  value={form.womenCount}
                  onChange={e => setField('womenCount', Math.max(0, Number(e.target.value) || 0))}
                  className="input"
                />
              </div>
            </div>

            {withAnnouncement && (
              <div>
                <label className="label">Annonce</label>
                <textarea
                  value={form.announcement}
                  onChange={e => setField('announcement', e.target.value)}
                  rows={3}
                  className="input"
                  style={{ resize: 'vertical' }}
                  placeholder="Annonce liée à cette séance"
                />
              </div>
            )}

            {withDocument && (
              <div className="grid-2">
                <div>
                  <label className="label">Sujets de prière (PowerPoint / PDF)</label>
                  <input
                    type="file"
                    accept=".pdf,.ppt,.pptx,.doc,.docx"
                    onChange={handleFile}
                    className="input"
                  />
                  {form.documentName && (
                    <p className="text-dim text-xs mt-2 flex items-center gap-1">
                      <Paperclip className="h-3 w-3" />
                      {form.documentName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="label">Lien du document partagé</label>
                  <input
                    type="url"
                    value={form.documentUrl}
                    onChange={e => setField('documentUrl', e.target.value)}
                    placeholder="https://..."
                    className="input"
                  />
                </div>
              </div>
            )}

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
              <span className="text-soft text-sm">Activer un rappel pour cette séance</span>
            </label>

            {error && (
              <div className="badge-danger w-full justify-start py-2 px-3">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button type="submit" className="btn btn-primary flex-1">
                Enregistrer
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
          {sorted.map(session => (
            <div key={session.id} className="card space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="section-subtitle">{session.theme}</h3>
                  <p className="text-dim text-sm mt-1">
                    {new Date(session.date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                    {session.time && ` — ${session.time}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {session.reminderEnabled && (
                    <span className="badge-royal">
                      <BellRing className="h-3 w-3" />
                      Rappel
                    </span>
                  )}
                  <span className="badge-primary">{session.totalParticipants} participants</span>
                  <button
                    onClick={() => handleDelete(session.id)}
                    className="icon-btn icon-btn-danger"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="badge-neutral">Hommes : {session.menCount}</span>
                <span className="badge-neutral">Femmes : {session.womenCount}</span>
                {session.documentName && (
                  <span className="badge-neutral">
                    <Paperclip className="h-3 w-3" />
                    {session.documentName}
                  </span>
                )}
                {session.documentUrl && (
                  <a
                    href={session.documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="badge-info"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Ouvrir le document
                  </a>
                )}
              </div>

              {session.announcement && (
                <p className="text-soft text-sm">
                  <span className="text-dim">Annonce : </span>
                  {session.announcement}
                </p>
              )}
              {session.remarks && (
                <p className="text-soft text-sm">
                  <span className="text-dim">Remarques : </span>
                  {session.remarks}
                </p>
              )}
            </div>
          ))}
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

      <MonthlySummaryTable entries={sessions} title="Synthèse mensuelle automatique" />
    </div>
  );
}
