import { Users, Plus, Trash2, Shield, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'coordinator' | 'viewer';
  status: 'active' | 'inactive';
  joinDate: string;
  lastActivity?: string;
}

const roleLabels: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  coordinator: 'Coordinateur',
  viewer: 'Lecteur'
};

const roleDescriptions: Record<string, string> = {
  super_admin: 'Accès complet, gestion des utilisateurs',
  admin: 'Accès complet sauf gestion des utilisateurs',
  coordinator: 'Gestion des activités et annonces',
  viewer: 'Lecture seule'
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      email: 'admin@midp.fr',
      name: 'Administrator',
      role: 'super_admin',
      status: 'active',
      joinDate: '2024-01-01',
      lastActivity: new Date().toISOString()
    }
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'coordinator' as const
  });

  useEffect(() => {
    const stored = localStorage.getItem('users');
    if (stored) {
      setUsers(JSON.parse(stored));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newUser: User = {
      id: Date.now().toString(),
      ...formData,
      status: 'active',
      joinDate: new Date().toISOString()
    };

    const updated = [...users, newUser];
    setUsers(updated);
    localStorage.setItem('users', JSON.stringify(updated));

    setFormData({ email: '', name: '', role: 'coordinator' });
    setShowForm(false);
  };

  const handleToggleStatus = (id: string) => {
    const updated = users.map(u =>
      u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
    );
    setUsers(updated);
    localStorage.setItem('users', JSON.stringify(updated));
  };

  const handleChangeRole = (id: string, newRole: any) => {
    const updated = users.map(u =>
      u.id === id ? { ...u, role: newRole } : u
    );
    setUsers(updated);
    localStorage.setItem('users', JSON.stringify(updated));
  };

  const handleDelete = (id: string) => {
    if (id === '1') {
      alert('Impossible de supprimer le compte administrateur');
      return;
    }
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

    const updated = users.filter(u => u.id !== id);
    setUsers(updated);
    localStorage.setItem('users', JSON.stringify(updated));
  };

  const roleOptions: Array<'super_admin' | 'admin' | 'coordinator' | 'viewer'> = [
    'super_admin',
    'admin',
    'coordinator',
    'viewer'
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="section-title">
          <Users className="h-8 w-8 text-amber-500" />
          Gestion des Utilisateurs
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          <Plus className="h-5 w-5" />
          Ajouter Utilisateur
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="stat-box">
          <div className="text-sm text-slate-400">Total</div>
          <div className="stat-number text-2xl">{users.length}</div>
        </div>
        <div className="stat-box">
          <div className="text-sm text-slate-400">Actifs</div>
          <div className="stat-number text-2xl text-green-400">
            {users.filter(u => u.status === 'active').length}
          </div>
        </div>
        <div className="stat-box">
          <div className="text-sm text-slate-400">Admins</div>
          <div className="stat-number text-2xl text-blue-400">
            {users.filter(u => u.role === 'admin' || u.role === 'super_admin').length}
          </div>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-8">
          <h2 className="section-subtitle mb-6">Ajouter un Utilisateur</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Nom</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input"
                  required
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
                {roleOptions.map(role => (
                  <option key={role} value={role}>
                    {roleLabels[role]}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-400 mt-1">
                {roleDescriptions[formData.role]}
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" className="btn btn-primary flex-1">
                Ajouter Utilisateur
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

      {/* Users Table */}
      {users.length > 0 ? (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-4 py-3 text-left text-slate-300 font-semibold">Nom</th>
                <th className="px-4 py-3 text-left text-slate-300 font-semibold">Email</th>
                <th className="px-4 py-3 text-left text-slate-300 font-semibold">Rôle</th>
                <th className="px-4 py-3 text-center text-slate-300 font-semibold">Statut</th>
                <th className="px-4 py-3 text-left text-slate-300 font-semibold">Inscription</th>
                <th className="px-4 py-3 text-center text-slate-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-3 text-slate-100">{user.name}</td>
                  <td className="px-4 py-3 text-slate-300">{user.email}</td>
                  <td className="px-4 py-3 text-slate-300">
                    <select
                      value={user.role}
                      onChange={(e) => handleChangeRole(user.id, e.target.value)}
                      className="input text-sm py-1"
                      disabled={user.id === '1'}
                    >
                      {roleOptions.map(role => (
                        <option key={role} value={role}>
                          {roleLabels[role]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className={`badge ${
                        user.status === 'active'
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {user.status === 'active' ? 'Actif' : 'Inactif'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-slate-300 text-sm">
                    {new Date(user.joinDate).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={user.id === '1'}
                      className={`p-2 rounded-lg transition-colors ${
                        user.id === '1'
                          ? 'text-slate-500 cursor-not-allowed'
                          : 'hover:bg-red-500/20 text-red-400'
                      }`}
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
        <div className="card text-center py-12">
          <p className="text-slate-400">Aucun utilisateur</p>
        </div>
      )}

      {/* Role Legend */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-amber-500" />
          Rôles et Permissions
        </h3>
        <div className="space-y-3">
          {roleOptions.map(role => (
            <div key={role} className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg">
              <div className="text-amber-500 mt-1">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-white">{roleLabels[role]}</div>
                <div className="text-sm text-slate-400">{roleDescriptions[role]}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
