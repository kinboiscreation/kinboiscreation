import { Settings as SettingsIcon, LogOut, Bell, Lock, User } from 'lucide-react';
import { useState } from 'react';

export default function Settings() {
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || 'admin@midp.fr');
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    activityReminders: true,
    tuesdayAnnouncements: true,
    weeklyReport: true
  });
  const [darkMode, setDarkMode] = useState(true);

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      window.location.reload();
    }
  };

  const handleSaveNotifications = () => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
    alert('Préférences de notification sauvegardées');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="section-title">
        <SettingsIcon className="h-8 w-8 text-amber-500" />
        Paramètres
      </h1>

      {/* Profile Settings */}
      <div className="card p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-xl font-bold">
            A
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Profil Admin</h2>
            <p className="text-slate-400">{userEmail}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="input"
            />
          </div>

          <button className="btn btn-primary w-full">
            <User className="h-5 w-5" />
            Mettre à jour le Profil
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card p-8">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Bell className="h-6 w-6 text-amber-500" />
          Notifications
        </h2>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.emailNotifications}
              onChange={(e) => setNotifications({
                ...notifications,
                emailNotifications: e.target.checked
              })}
              className="w-4 h-4 rounded bg-slate-800 border border-slate-600 cursor-pointer accent-amber-500"
            />
            <span className="text-slate-300">Notifications par email</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.activityReminders}
              onChange={(e) => setNotifications({
                ...notifications,
                activityReminders: e.target.checked
              })}
              className="w-4 h-4 rounded bg-slate-800 border border-slate-600 cursor-pointer accent-amber-500"
            />
            <span className="text-slate-300">Rappels d'activité</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.tuesdayAnnouncements}
              onChange={(e) => setNotifications({
                ...notifications,
                tuesdayAnnouncements: e.target.checked
              })}
              className="w-4 h-4 rounded bg-slate-800 border border-slate-600 cursor-pointer accent-amber-500"
            />
            <span className="text-slate-300">Annonces du mardi</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.weeklyReport}
              onChange={(e) => setNotifications({
                ...notifications,
                weeklyReport: e.target.checked
              })}
              className="w-4 h-4 rounded bg-slate-800 border border-slate-600 cursor-pointer accent-amber-500"
            />
            <span className="text-slate-300">Rapport hebdomadaire</span>
          </label>
        </div>

        <button
          onClick={handleSaveNotifications}
          className="btn btn-primary w-full mt-6"
        >
          Sauvegarder les Préférences
        </button>
      </div>

      {/* Theme Settings */}
      <div className="card p-8">
        <h2 className="text-xl font-semibold text-white mb-6">Apparence</h2>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
            className="w-4 h-4 rounded bg-slate-800 border border-slate-600 cursor-pointer accent-amber-500"
          />
          <span className="text-slate-300">Mode sombre</span>
        </label>
      </div>

      {/* Security Settings */}
      <div className="card p-8">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Lock className="h-6 w-6 text-amber-500" />
          Sécurité
        </h2>

        <button className="btn btn-secondary w-full">
          Changer le Mot de Passe
        </button>
      </div>

      {/* Logout */}
      <div className="card p-8">
        <button
          onClick={handleLogout}
          className="btn bg-red-500 hover:bg-red-600 text-white w-full"
        >
          <LogOut className="h-5 w-5" />
          Se Déconnecter
        </button>
      </div>

      {/* About */}
      <div className="card text-center p-8">
        <p className="text-slate-400">
          MIDP - Ministère d'Intercession et de Développement de la Prière
        </p>
        <p className="text-slate-500 text-sm mt-2">Version 1.0.0</p>
      </div>
    </div>
  );
}
