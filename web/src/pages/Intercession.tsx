import { useState } from 'react';
import { HandHeart, Plus, Trash2, X, AlertCircle, Compass, Eye } from 'lucide-react';
import { IntercessionPlanning } from '@midp/shared';
import { useCollection } from '../hooks/use-collection';

function mondayOf(date: Date): string {
  const copy = new Date(date);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  return copy.toISOString().slice(0, 10);
}

const emptyForm = {
  weekStart: mondayOf(new Date()),
  conductorName: '',
  directives: '',
  revelations: ''
};

export default function Intercession() {
  const { items: plannings, add, remove } = useCollection<IntercessionPlanning>('midp-intercession');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const setField = (key: keyof typeof emptyForm, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!form.conductorName.trim()) {
      setError('Le nom du conducteur est obligatoire.');
      return;
    }
    if (!form.weekStart) {
      setError('La semaine est obligatoire.');
      return;
    }

    add({
      ...form,
      weekStart: mondayOf(new Date(form.weekStart)),
      createdAt: new Date().toISOString()
    } as Omit<IntercessionPlanning, 'id'>);
    setForm({ ...emptyForm, weekStart: mondayOf(new Date()) });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Supprimer ce planning ?')) remove(id);
  };

  const sorted = [...plannings].sort(
    (a, b) => new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime()
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="section-title">
            <HandHeart className="h-8 w-8 text-gold" />
            Temps de Prière — Intercession
          </h1>
          <p className="text-dim text-sm mt-2">
            Planning hebdomadaire du lundi : conducteur, directives et révélations reçues.
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus className="h-5 w-5" />
          Nouveau planning
        </button>
      </div>

      {showForm && (
        <div className="card-gold space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="section-subtitle">Planning de la semaine</h2>
            <button onClick={() => setShowForm(false)} className="icon-btn" aria-label="Fermer">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid-2">
              <div>
                <label className="label">Semaine du (lundi)</label>
                <input
                  type="date"
                  value={form.weekStart}
                  onChange={e => setField('weekStart', e.target.value)}
                  className="input"
                  required
                />
                <p className="text-dim text-xs mt-1">
                  La date est ramenée automatiquement au lundi de la semaine choisie.
                </p>
              </div>
              <div>
                <label className="label">Conducteur</label>
                <input
                  type="text"
                  value={form.conductorName}
                  onChange={e => setField('conductorName', e.target.value)}
                  placeholder="Nom du conducteur"
                  className="input"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Directives données au conducteur</label>
              <textarea
                value={form.directives}
                onChange={e => setField('directives', e.target.value)}
                rows={4}
                className="input"
                style={{ resize: 'vertical' }}
                placeholder="Consignes et orientations pour la semaine"
              />
            </div>

            <div>
              <label className="label">Révélations reçues</label>
              <textarea
                value={form.revelations}
                onChange={e => setField('revelations', e.target.value)}
                rows={4}
                className="input"
                style={{ resize: 'vertical' }}
                placeholder="Révélations partagées durant les temps de prière"
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
                Enregistrer le planning
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm({ ...emptyForm, weekStart: mondayOf(new Date()) });
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
          {sorted.map(planning => {
            const start = new Date(planning.weekStart);
            const end = new Date(start);
            end.setDate(end.getDate() + 6);

            return (
              <div key={planning.id} className="card space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="section-subtitle">
                      Semaine du {start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} au{' '}
                      {end.toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </h3>
                    <p className="text-dim text-sm mt-1">Conducteur : {planning.conductorName}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(planning.id)}
                    className="icon-btn icon-btn-danger"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {planning.directives && (
                  <div>
                    <p className="text-dim text-xs uppercase tracking-wider flex items-center gap-1 mb-1">
                      <Compass className="h-3 w-3" />
                      Directives
                    </p>
                    <p className="text-soft text-sm whitespace-pre-line">{planning.directives}</p>
                  </div>
                )}

                {planning.revelations && (
                  <div>
                    <p className="text-dim text-xs uppercase tracking-wider flex items-center gap-1 mb-1">
                      <Eye className="h-3 w-3" />
                      Révélations
                    </p>
                    <p className="text-soft text-sm whitespace-pre-line">{planning.revelations}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <p>Aucun planning enregistré.</p>
          <button onClick={() => setShowForm(true)} className="btn btn-primary mt-4 mx-auto">
            <Plus className="h-5 w-5" />
            Créer le premier planning
          </button>
        </div>
      )}
    </div>
  );
}
