import { useState } from 'react';
import { Crown, Plus, Trash2, X, AlertCircle, Video, MapPin, ExternalLink } from 'lucide-react';
import { WomenProgram, WomenProgramType, WOMEN_PROGRAM_NAMES } from '@midp/shared';
import { useCollection } from '../hooks/use-collection';
import MonthlySummaryTable from '../components/monthly-summary-table';

const PROGRAM_TYPES = Object.keys(WOMEN_PROGRAM_NAMES) as WomenProgramType[];

const emptyForm = {
  programType: 'mère_nation' as WomenProgramType,
  theme: '',
  date: '',
  conductors: '',
  mode: 'présentiel' as 'zoom' | 'présentiel',
  zoomLink: '',
  totalParticipants: 0,
  menCount: 0,
  womenCount: 0,
  remarks: ''
};

export default function WomenPrograms() {
  const { items: programs, add, remove } = useCollection<WomenProgram>('midp-women-programs');
  const [activeTab, setActiveTab] = useState<WomenProgramType | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const setField = <K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

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
    if (form.mode === 'zoom' && !form.zoomLink.trim()) {
      setError('Le lien Zoom est obligatoire pour une séance en ligne.');
      return;
    }
    if (form.menCount + form.womenCount > form.totalParticipants) {
      setError('Hommes + femmes dépasse le nombre total de participants.');
      return;
    }

    add(form as Omit<WomenProgram, 'id'>);
    setForm(emptyForm);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Supprimer ce programme ?')) remove(id);
  };

  const visible = programs
    .filter(program => activeTab === 'all' || program.programType === activeTab)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="section-title">
            <Crown className="h-8 w-8 text-gold" />
            Programmes des Femmes
          </h1>
          <p className="text-dim text-sm mt-2">
            Comme une Mère dans la Nation, Femmes aux Pieds du Maître et programmes spéciaux.
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus className="h-5 w-5" />
          Nouveau programme
        </button>
      </div>

      <div className="tab-bar">
        <button
          onClick={() => setActiveTab('all')}
          className={`tab ${activeTab === 'all' ? 'tab-active' : ''}`}
        >
          Tous
        </button>
        {PROGRAM_TYPES.map(type => (
          <button
            key={type}
            onClick={() => setActiveTab(type)}
            className={`tab ${activeTab === type ? 'tab-active' : ''}`}
          >
            {WOMEN_PROGRAM_NAMES[type]}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="card-gold space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="section-subtitle">Enregistrer un programme</h2>
            <button onClick={() => setShowForm(false)} className="icon-btn" aria-label="Fermer">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid-2">
              <div>
                <label className="label">Programme</label>
                <select
                  value={form.programType}
                  onChange={e => setField('programType', e.target.value as WomenProgramType)}
                  className="input"
                >
                  {PROGRAM_TYPES.map(type => (
                    <option key={type} value={type}>
                      {WOMEN_PROGRAM_NAMES[type]}
                    </option>
                  ))}
                </select>
              </div>
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
            </div>

            <div>
              <label className="label">Thème</label>
              <input
                type="text"
                value={form.theme}
                onChange={e => setField('theme', e.target.value)}
                placeholder="Thème du programme"
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">Conductrices</label>
              <input
                type="text"
                value={form.conductors}
                onChange={e => setField('conductors', e.target.value)}
                placeholder="Noms séparés par des virgules"
                className="input"
              />
            </div>

            <div className="grid-2">
              <div>
                <label className="label">Mode</label>
                <select
                  value={form.mode}
                  onChange={e => setField('mode', e.target.value as 'zoom' | 'présentiel')}
                  className="input"
                >
                  <option value="présentiel">Présentiel</option>
                  <option value="zoom">Zoom</option>
                </select>
              </div>
              {form.mode === 'zoom' && (
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

      {visible.length > 0 ? (
        <div className="space-y-4">
          {visible.map(program => (
            <div key={program.id} className="card space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="badge-royal mb-2">{WOMEN_PROGRAM_NAMES[program.programType]}</span>
                  <h3 className="section-subtitle">{program.theme}</h3>
                  <p className="text-dim text-sm mt-1">
                    {new Date(program.date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge-primary">{program.totalParticipants} participants</span>
                  <button
                    onClick={() => handleDelete(program.id)}
                    className="icon-btn icon-btn-danger"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="badge-neutral">
                  {program.mode === 'zoom' ? (
                    <Video className="h-3 w-3" />
                  ) : (
                    <MapPin className="h-3 w-3" />
                  )}
                  {program.mode === 'zoom' ? 'Zoom' : 'Présentiel'}
                </span>
                {program.conductors && (
                  <span className="badge-neutral">Conductrices : {program.conductors}</span>
                )}
                <span className="badge-neutral">Femmes : {program.womenCount}</span>
                {program.zoomLink && (
                  <a href={program.zoomLink} target="_blank" rel="noreferrer" className="badge-info">
                    <ExternalLink className="h-3 w-3" />
                    Rejoindre
                  </a>
                )}
              </div>

              {program.remarks && (
                <p className="text-soft text-sm">
                  <span className="text-dim">Remarques : </span>
                  {program.remarks}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>Aucun programme enregistré.</p>
        </div>
      )}

      <MonthlySummaryTable
        entries={programs.filter(p => activeTab === 'all' || p.programType === activeTab)}
        title={
          activeTab === 'all'
            ? 'Synthèse mensuelle — tous programmes'
            : `Synthèse mensuelle — ${WOMEN_PROGRAM_NAMES[activeTab]}`
        }
      />
    </div>
  );
}
