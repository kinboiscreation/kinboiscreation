import { Heart, Plus, Trash2, CheckCircle, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PrayerSubject {
  id: string;
  title: string;
  description: string;
  category: 'personal' | 'family' | 'ministry' | 'nation' | 'healing' | 'guidance';
  status: 'active' | 'answered' | 'archived';
  createdAt: string;
  targetDate?: string;
  priority: 'high' | 'medium' | 'low';
}

export default function PrayerSubjects() {
  const [subjects, setSubjects] = useState<PrayerSubject[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('active');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'ministry' as const,
    targetDate: '',
    priority: 'medium' as const
  });

  useEffect(() => {
    const stored = localStorage.getItem('prayerSubjects');
    if (stored) setSubjects(JSON.parse(stored));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newSubject: PrayerSubject = {
      id: Date.now().toString(),
      ...formData,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    const updated = [...subjects, newSubject];
    setSubjects(updated);
    localStorage.setItem('prayerSubjects', JSON.stringify(updated));

    setFormData({
      title: '',
      description: '',
      category: 'ministry',
      targetDate: '',
      priority: 'medium'
    });
    setShowForm(false);
  };

  const handleMarkAnswered = (id: string) => {
    const updated = subjects.map(s =>
      s.id === id ? { ...s, status: 'answered' } : s
    );
    setSubjects(updated);
    localStorage.setItem('prayerSubjects', JSON.stringify(updated));
  };

  const handleDelete = (id: string) => {
    const updated = subjects.filter(s => s.id !== id);
    setSubjects(updated);
    localStorage.setItem('prayerSubjects', JSON.stringify(updated));
  };

  const categoryLabels: Record<string, string> = {
    personal: 'Personnel',
    family: 'Famille',
    ministry: 'Ministère',
    nation: 'Nation',
    healing: 'Guérison',
    guidance: 'Direction'
  };

  const filteredSubjects = subjects.filter(s =>
    filterStatus === 'all' ? true : s.status === filterStatus
  );

  const activeCount = subjects.filter(s => s.status === 'active').length;
  const answeredCount = subjects.filter(s => s.status === 'answered').length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="section-title">
          <Heart className="h-8 w-8 text-amber-500" />
          Sujets de Prière
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          <Plus className="h-5 w-5" />
          Ajouter Sujet
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="stat-box">
          <div className="text-sm text-slate-400">Total</div>
          <div className="stat-number text-2xl">{subjects.length}</div>
        </div>
        <div className="stat-box">
          <div className="text-sm text-slate-400">Actifs</div>
          <div className="stat-number text-2xl text-blue-400">{activeCount}</div>
        </div>
        <div className="stat-box">
          <div className="text-sm text-slate-400">Répondus</div>
          <div className="stat-number text-2xl text-green-400">{answeredCount}</div>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-8">
          <h2 className="section-subtitle mb-6">Ajouter un Sujet de Prière</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">Titre</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Titre du sujet de prière"
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Détails du sujet de prière"
                className="input resize-none"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="label">Catégorie</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="input"
                >
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Priorité</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="input"
                >
                  <option value="high">Haute</option>
                  <option value="medium">Moyenne</option>
                  <option value="low">Basse</option>
                </select>
              </div>

              <div>
                <label className="label">Date Cible</label>
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  className="input"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" className="btn btn-primary flex-1">
                Ajouter Sujet
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn btn-secondary flex-1"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter */}
      <div className="card p-4">
        <div className="flex gap-2 flex-wrap">
          {['active', 'answered', 'all'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === status
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-700/30 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              {status === 'active' ? 'Actifs' : status === 'answered' ? 'Répondus' : 'Tous'}
            </button>
          ))}
        </div>
      </div>

      {/* Subjects List */}
      {filteredSubjects.length > 0 ? (
        <div className="space-y-4">
          {filteredSubjects.map(subject => (
            <div key={subject.id} className="card p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{subject.title}</h3>
                    <span className={`badge text-xs ${
                      subject.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                      subject.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-green-500/20 text-green-300'
                    }`}>
                      {subject.priority === 'high' ? 'Haute' : subject.priority === 'medium' ? 'Moyenne' : 'Basse'}
                    </span>
                  </div>
                  <p className="text-slate-300">{subject.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm mb-3">
                <div className="flex items-center gap-3">
                  <span className="badge bg-slate-700/50 text-slate-300">
                    {categoryLabels[subject.category]}
                  </span>
                  {subject.targetDate && (
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="h-4 w-4" />
                      {new Date(subject.targetDate).toLocaleDateString('fr-FR')}
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-500">
                  {new Date(subject.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {subject.status === 'active' && (
                  <button
                    onClick={() => handleMarkAnswered(subject.id)}
                    className="flex-1 btn btn-secondary text-sm py-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Marquer comme répondu
                  </button>
                )}
                <button
                  onClick={() => handleDelete(subject.id)}
                  className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-slate-400">
            {filterStatus === 'all'
              ? 'Aucun sujet de prière'
              : `Aucun sujet de prière ${filterStatus === 'active' ? 'actif' : 'répondu'}`}
          </p>
        </div>
      )}
    </div>
  );
}
