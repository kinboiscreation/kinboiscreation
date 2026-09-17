import { useState } from 'react';
import { UserCog, Plus, Trash2, Shield, X, AlertCircle, Check } from 'lucide-react';
import {
  UserRole,
  ROLE_LABELS,
  ROLE_DESCRIPTIONS,
  ROLE_PERMISSIONS,
  PERMISSION_LABELS,
  UserPermission
} from '@midp/shared';
import { useCollection } from '../hooks/use-collection';

interface AppUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: 'active' | 'inactive';
  joinDate: string;
}

const ROLES = Object.keys(ROLE_LABELS) as UserRole[];
const ALL_PERMISSIONS = Object.values(UserPermission);

const ROOT_ADMIN_EMAIL = 'admin@midp.fr';

const emptyForm = {
  name: '',
  email: '',
  role: 'member' as UserRole
};

export default function UserManagement() {
  const { items: users, add, update, remove } = useCollection<AppUser>('midp-users', [
    {
      id: 'root',
      email: ROOT_ADMIN_EMAIL,
      name: 'Administrateur principal',
      role: 'admin_senior',
      status: 'active',
      joinDate: new Date().toISOString()
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!form.name.trim() || !form.email.trim()) {
      setError('Le nom et l\'email sont obligatoires.');
      return;
    }
    if (users.some(user => user.email.toLowerCase() === form.email.trim().toLowerCase())) {
      setError('Un utilisateur possède déjà cette adresse email.');
      return;
    }

    add({
      ...form,
      email: form.email.trim(),
      status: 'active',
      joinDate: new Date().toISOString()
    } as Omit<AppUser, 'id'>);

    setForm(emptyForm);
    setShowForm(false);
  };

  const isRoot = (user: AppUser) => user.id === 'root';

  const handleDelete = (user: AppUser) => {
    if (isRoot(user)) return;
    if (window.confirm(`Supprimer ${user.name} ?`)) remove(user.id);
  };

  const seniorCount = users.filter(u => u.role === 'admin_senior' && u.status === 'active').length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="section-title">
            <UserCog className="h-8 w-8 text-gold" />
            Gestion des Utilisateurs
          </h1>
          <p className="text-dim text-sm mt-2">
            Quatre niveaux d'accès, chacun limité aux autorisations qui lui sont attribuées.
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus className="h-5 w-5" />
          Ajouter un utilisateur
        </button>
      </div>

      <div className="grid-4">
        <div className="stat-box">
          <span className="stat-label">Total</span>
          <span className="stat-number">{users.length}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Actifs</span>
          <span className="stat-number">{users.filter(u => u.status === 'active').length}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Admins senior</span>
          <span className="stat-number-royal">{seniorCount}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Lecteurs</span>
          <span className="stat-number-royal">{users.filter(u => u.role === 'reader').length}</span>
        </div>
      </div>

      {showForm && (
        <div className="card-gold space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="section-subtitle">Nouvel utilisateur</h2>
            <button onClick={() => setShowForm(false)} className="icon-btn" aria-label="Fermer">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid-2">
              <div>
                <label className="label">Nom</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="input"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Rôle</label>
              <select
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value as UserRole })}
                className="input"
              >
                {ROLES.map(role => (
                  <option key={role} value={role}>
                    {ROLE_LABELS[role]}
                  </option>
                ))}
              </select>
              <p className="text-dim text-xs mt-2">{ROLE_DESCRIPTIONS[form.role]}</p>
            </div>

            {error && (
              <div className="badge-danger w-full justify-start py-2 px-3">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button type="submit" className="btn btn-primary flex-1">
                Ajouter
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

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th className="num">Statut</th>
              <th>Inscription</th>
              <th className="num">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                  {user.name}
                  {isRoot(user) && <span className="badge-primary ml-2">Principal</span>}
                </td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={e => update(user.id, { role: e.target.value as UserRole })}
                    className="input text-xs"
                    style={{ padding: '0.35rem 0.5rem', minWidth: '11rem' }}
                    disabled={isRoot(user)}
                  >
                    {ROLES.map(role => (
                      <option key={role} value={role}>
                        {ROLE_LABELS[role]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="num">
                  <button
                    onClick={() =>
                      !isRoot(user) &&
                      update(user.id, { status: user.status === 'active' ? 'inactive' : 'active' })
                    }
                    className={user.status === 'active' ? 'badge-success' : 'badge-danger'}
                    disabled={isRoot(user)}
                  >
                    {user.status === 'active' ? 'Actif' : 'Inactif'}
                  </button>
                </td>
                <td className="text-xs">{new Date(user.joinDate).toLocaleDateString('fr-FR')}</td>
                <td className="num">
                  <button
                    onClick={() => handleDelete(user)}
                    className="icon-btn icon-btn-danger"
                    disabled={isRoot(user)}
                    style={isRoot(user) ? { opacity: 0.35, cursor: 'not-allowed' } : undefined}
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

      <div className="card space-y-4">
        <h3 className="section-subtitle flex items-center gap-2">
          <Shield className="h-5 w-5 text-gold" />
          Matrice des autorisations
        </h3>

        <div className="table-wrap" style={{ boxShadow: 'none' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Autorisation</th>
                {ROLES.map(role => (
                  <th key={role} className="num">
                    {ROLE_LABELS[role]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALL_PERMISSIONS.map(permission => (
                <tr key={permission}>
                  <td style={{ color: 'var(--text-primary)' }}>{PERMISSION_LABELS[permission]}</td>
                  {ROLES.map(role => (
                    <td key={role} className="num">
                      {ROLE_PERMISSIONS[role].includes(permission) ? (
                        <Check className="h-4 w-4 inline" style={{ color: 'var(--success)' }} />
                      ) : (
                        <span className="text-dim">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-2">
          {ROLES.map(role => (
            <p key={role} className="text-sm">
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                {ROLE_LABELS[role]}
              </span>
              <span className="text-dim"> — {ROLE_DESCRIPTIONS[role]}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
