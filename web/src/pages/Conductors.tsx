import { Users, Plus, Trash2, Edit, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Conductor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'conductor' | 'assistant';
  status: 'active' | 'inactive';
  joinDate: string;
  specializations: string[];
  assignmentCount?: number;
}

export default function Conductors() {
  const [conductors, setConductors] = useState<Conductor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'conductor' as const,
    specializations: [] as string[]
  });

  useEffect(() => {
    fetchConductors();
  }, []);

  const fetchConductors = async () => {
    try {
      setIsLoading(true);
      // Fetch from local storage or API
      const stored = localStorage.getItem('conductors');
      if (stored) {
        setConductors(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error fetching conductors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newConductor: Conductor = {
      id: Date.now().toString(),
      ...formData,
      status: 'active',
      joinDate: new Date().toISOString()
    };

    const updated = [...conductors, newConductor];
    setConductors(updated);
    localStorage.setItem('conductors', JSON.stringify(updated));

    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'conductor',
      specializations: []
    });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce conducteur ?')) return;

    const updated = conductors.filter(c => c.id !== id);
    setConductors(updated);
    localStorage.setItem('conductors', JSON.stringify(updated));
  };

  const handleToggleStatus = (id: string) => {
    const updated = conductors.map(c =>
      c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c
    );
    setConductors(updated);
    localStorage.setItem('conductors', JSON.stringify(updated));
  };

  const activeCount = conductors.filter(c => c.status === 'active').length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="section-title">
          <Users className="h-8 w-8 text-amber-500" />
          Conducteurs
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          <Plus className="h-5 w-5" />
          Ajouter Conducteur
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="stat-box">
          <div className="text-sm text-slate-400">Total Conducteurs</div>
          <div className="stat-number text-2xl">{conductors.length}</div>
        </div>
        <div className="stat-box">
          <div className="text-sm text-slate-400">Actifs</div>
          <div className="stat-number text-2xl text-green-400">{activeCount}</div>
        </div>
        <div className="stat-box">
          <div className="text-sm text-slate-400">Inactifs</div>
          <div className="stat-number text-2xl text-red-400">
            {conductors.length - activeCount}
          </div>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-8">
          <h2 className="section-subtitle mb-6">Ajouter un Conducteur</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Prénom</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Prénom"
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">Nom</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Nom"
                  className="input"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@exemple.com"
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">Téléphone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+33 6 XX XX XX XX"
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="label">Rôle</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="input"
              >
                <option value="conductor">Conducteur</option>
                <option value="assistant">Assistant</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" className="btn btn-primary flex-1">
                Ajouter Conducteur
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

      {/* Conductors List */}
      {isLoading ? (
        <div className="card text-center py-12">
          <div className="animate-spin mx-auto">
            <div className="h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full"></div>
          </div>
        </div>
      ) : conductors.length > 0 ? (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-4 py-3 text-left text-slate-300 font-semibold">Nom</th>
                <th className="px-4 py-3 text-left text-slate-300 font-semibold">Email</th>
                <th className="px-4 py-3 text-left text-slate-300 font-semibold">Rôle</th>
                <th className="px-4 py-3 text-center text-slate-300 font-semibold">Statut</th>
                <th className="px-4 py-3 text-center text-slate-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {conductors.map(conductor => (
                <tr key={conductor.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-3 text-slate-100">
                    {conductor.firstName} {conductor.lastName}
                  </td>
                  <td className="px-4 py-3 text-slate-300">{conductor.email}</td>
                  <td className="px-4 py-3 text-slate-300 text-sm">
                    {conductor.role === 'conductor' ? 'Conducteur' : 'Assistant'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggleStatus(conductor.id)}
                      className={`badge ${
                        conductor.status === 'active'
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {conductor.status === 'active' ? 'Actif' : 'Inactif'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors">
                        <Calendar className="h-4 w-4 text-blue-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(conductor.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-slate-400">Aucun conducteur</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary mt-4 mx-auto"
          >
            <Plus className="h-5 w-5" />
            Ajouter le premier conducteur
          </button>
        </div>
      )}
    </div>
  );
}
