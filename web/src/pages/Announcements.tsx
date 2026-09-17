import { useEffect, useState } from 'react';
import {
  Megaphone,
  Plus,
  Trash2,
  Send,
  X,
  AlertCircle,
  Sparkles,
  PenLine,
  BellRing,
  RefreshCw
} from 'lucide-react';
import { composeAnnouncement, AnnouncementTone } from '../utils/announcement-composer';
import { useReminders, nextWeekday } from '../hooks/use-reminders';

interface Announcement {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  scheduledFor?: string;
  createdAt: string;
  createdBy: string;
}

const TUESDAY = 2;

const emptyComposer = {
  subject: '',
  activity: 'Atmosphère de Prière',
  date: '',
  time: '',
  place: '',
  link: '',
  audience: '',
  tone: 'chaleureux' as AnnouncementTone,
  extra: ''
};

const ACTIVITY_SUGGESTIONS = [
  'Matinaux de Prière',
  'Nocturnes de Prière',
  'Atmosphère de Prière',
  'Langues de Feu',
  'Nuit de Prière de préparation au culte',
  'Comme une Mère dans la Nation',
  'Femmes aux Pieds du Maître',
  'Veillée de Prière',
  'Programme spécial'
];

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState<'manual' | 'assistant'>('assistant');
  const [composer, setComposer] = useState(emptyComposer);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [scheduledFor, setScheduledFor] = useState('');
  const [tuesdayReminder, setTuesdayReminder] = useState(true);
  const [error, setError] = useState('');

  const { schedule } = useReminders();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/announcements?status=all&limit=100');
      const data = await response.json();
      setAnnouncements(Array.isArray(data) ? data : []);
    } catch {
      setAnnouncements([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompose = () => {
    if (!composer.subject.trim() || !composer.date) {
      setError('Le thème et la date sont nécessaires pour composer une annonce.');
      return;
    }
    setError('');
    setContent(composeAnnouncement(composer));
    if (!title.trim()) setTitle(`${composer.activity} — ${composer.subject}`);
  };

  const resetForm = () => {
    setComposer(emptyComposer);
    setTitle('');
    setContent('');
    setScheduledFor('');
    setTuesdayReminder(true);
    setError('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Le titre et le contenu sont obligatoires.');
      return;
    }

    try {
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          scheduledFor: scheduledFor || undefined,
          reminderType: tuesdayReminder ? 'tuesday' : 'none'
        })
      });

      if (!response.ok) throw new Error('Échec de la création');

      if (tuesdayReminder) {
        schedule({
          title: `Envoyer au secrétariat : ${title}`,
          message: "Rappel hebdomadaire du mardi pour la transmission des annonces.",
          dueAt: nextWeekday(TUESDAY, 9),
          recurrence: 'weekly',
          weekday: TUESDAY,
          sourceType: 'announcement'
        });
      }

      if (scheduledFor) {
        schedule({
          title: `Annonce programmée : ${title}`,
          message: content.slice(0, 160),
          dueAt: new Date(scheduledFor).toISOString(),
          sourceType: 'announcement'
        });
      }

      resetForm();
      setShowForm(false);
      await fetchAnnouncements();
    } catch {
      setError(
        "L'annonce n'a pas pu être enregistrée. Vérifiez que le service backend et Firebase sont configurés."
      );
    }
  };

  const handlePublish = async (id: string) => {
    try {
      const response = await fetch(`/api/announcements/${id}/publish`, { method: 'PUT' });
      if (!response.ok) throw new Error();
      await fetchAnnouncements();
    } catch {
      setError("La publication a échoué.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer cette annonce ?')) return;
    try {
      const response = await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error();
      await fetchAnnouncements();
    } catch {
      setError('La suppression a échoué.');
    }
  };

  const statusBadge = (status: Announcement['status']) => {
    if (status === 'published') return 'badge-success';
    if (status === 'draft') return 'badge-warning';
    return 'badge-neutral';
  };

  const setComposerField = <K extends keyof typeof emptyComposer>(
    key: K,
    value: (typeof emptyComposer)[K]
  ) => setComposer(prev => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="section-title">
            <Megaphone className="h-8 w-8 text-gold" />
            Annonces
          </h1>
          <p className="text-dim text-sm mt-2">
            Communications officielles, rappel du mardi pour le secrétariat et assistant de rédaction.
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus className="h-5 w-5" />
          Nouvelle annonce
        </button>
      </div>

      {showForm && (
        <div className="card-gold space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="section-subtitle">Créer une annonce</h2>
            <button onClick={() => setShowForm(false)} className="icon-btn" aria-label="Fermer">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="tab-bar">
            <button
              onClick={() => setMode('assistant')}
              className={`tab ${mode === 'assistant' ? 'tab-active' : ''}`}
            >
              <Sparkles className="h-4 w-4" />
              Assistant de rédaction
            </button>
            <button
              onClick={() => setMode('manual')}
              className={`tab ${mode === 'manual' ? 'tab-active' : ''}`}
            >
              <PenLine className="h-4 w-4" />
              Rédaction manuelle
            </button>
          </div>

          {mode === 'assistant' && (
            <div
              className="space-y-5 p-5 rounded-xl"
              style={{ background: 'var(--royal-soft)', border: '1px solid var(--royal-border)' }}
            >
              <p className="text-dim text-xs">
                Renseignez les informations, l'assistant compose une annonce structurée que vous
                pouvez ensuite modifier librement.
              </p>

              <div className="grid-2">
                <div>
                  <label className="label">Activité</label>
                  <input
                    list="activity-suggestions"
                    value={composer.activity}
                    onChange={e => setComposerField('activity', e.target.value)}
                    className="input"
                  />
                  <datalist id="activity-suggestions">
                    {ACTIVITY_SUGGESTIONS.map(suggestion => (
                      <option key={suggestion} value={suggestion} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="label">Thème</label>
                  <input
                    type="text"
                    value={composer.subject}
                    onChange={e => setComposerField('subject', e.target.value)}
                    placeholder="Thème de la rencontre"
                    className="input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="label">Date</label>
                  <input
                    type="date"
                    value={composer.date}
                    onChange={e => setComposerField('date', e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Heure</label>
                  <input
                    type="time"
                    value={composer.time}
                    onChange={e => setComposerField('time', e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Ton</label>
                  <select
                    value={composer.tone}
                    onChange={e => setComposerField('tone', e.target.value as AnnouncementTone)}
                    className="input"
                  >
                    <option value="chaleureux">Chaleureux</option>
                    <option value="solennel">Solennel</option>
                    <option value="bref">Bref</option>
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label className="label">Lieu</label>
                  <input
                    type="text"
                    value={composer.place}
                    onChange={e => setComposerField('place', e.target.value)}
                    placeholder="Église, salle, ou en ligne"
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Lien de connexion</label>
                  <input
                    type="url"
                    value={composer.link}
                    onChange={e => setComposerField('link', e.target.value)}
                    placeholder="https://..."
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="label">Public visé</label>
                <input
                  type="text"
                  value={composer.audience}
                  onChange={e => setComposerField('audience', e.target.value)}
                  placeholder="toute la famille du MIDP, les femmes, les intercesseurs…"
                  className="input"
                />
              </div>

              <div>
                <label className="label">Précisions à inclure</label>
                <textarea
                  value={composer.extra}
                  onChange={e => setComposerField('extra', e.target.value)}
                  rows={2}
                  className="input"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button type="button" onClick={handleCompose} className="btn btn-royal w-full">
                <RefreshCw className="h-4 w-4" />
                Composer l'annonce
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Titre</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="input"
                placeholder="Titre de l'annonce"
                required
              />
            </div>

            <div>
              <label className="label">Contenu</label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={10}
                className="input"
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
                placeholder="Contenu de l'annonce"
                required
              />
            </div>

            <div>
              <label className="label">Programmer l'annonce (facultatif)</label>
              <input
                type="datetime-local"
                value={scheduledFor}
                onChange={e => setScheduledFor(e.target.value)}
                className="input"
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={tuesdayReminder}
                onChange={e => setTuesdayReminder(e.target.checked)}
                className="checkbox mt-0.5"
              />
              <span className="text-soft text-sm">
                Rappel chaque mardi pour l'envoi au secrétariat
                <span className="block text-dim text-xs">
                  Un rappel hebdomadaire est créé et se reprogramme automatiquement chaque semaine.
                </span>
              </span>
            </label>

            {error && (
              <div className="badge-danger w-full justify-start py-2 px-3">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button type="submit" className="btn btn-primary flex-1">
                Enregistrer l'annonce
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

      {isLoading ? (
        <div className="card flex justify-center py-12">
          <div className="spinner" />
        </div>
      ) : announcements.length > 0 ? (
        <div className="space-y-4">
          {announcements.map(announcement => (
            <div key={announcement.id} className="card space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="section-subtitle">{announcement.title}</h3>
                    <span className={statusBadge(announcement.status)}>{announcement.status}</span>
                  </div>
                  <p className="text-dim text-xs mt-1">
                    {announcement.createdBy} ·{' '}
                    {new Date(announcement.createdAt).toLocaleDateString('fr-FR')}
                    {announcement.scheduledFor && (
                      <>
                        {' · '}
                        <BellRing className="h-3 w-3 inline" /> prévu le{' '}
                        {new Date(announcement.scheduledFor).toLocaleDateString('fr-FR')}
                      </>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {announcement.status === 'draft' && (
                    <button
                      onClick={() => handlePublish(announcement.id)}
                      className="icon-btn"
                      title="Publier"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(announcement.id)}
                    className="icon-btn icon-btn-danger"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-soft text-sm whitespace-pre-line">{announcement.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>Aucune annonce enregistrée.</p>
          <button onClick={() => setShowForm(true)} className="btn btn-primary mt-4 mx-auto">
            <Plus className="h-5 w-5" />
            Créer la première annonce
          </button>
        </div>
      )}
    </div>
  );
}
