import { useState } from 'react';
import { Menu, LogOut, Bell, Sun, Moon, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from './logo';
import { useTheme } from '../contexts/theme-context';
import { useReminders } from '../hooks/use-reminders';

interface NavigationProps {
  onMenuClick: () => void;
}

export default function Navigation({ onMenuClick }: NavigationProps) {
  const { theme, toggleTheme } = useTheme();
  const { due, upcoming, acknowledge, remove } = useReminders();
  const [panelOpen, setPanelOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Se déconnecter ?')) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      window.location.reload();
    }
  };

  const userEmail = localStorage.getItem('userEmail') || 'admin@midp.fr';

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-xl"
      style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}
    >
      <div className="px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={onMenuClick} className="icon-btn md:hidden" aria-label="Ouvrir le menu">
              <Menu className="h-6 w-6" />
            </button>
            <Logo size="medium" showText showSubtext />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="icon-btn"
              aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
              title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <div className="relative">
              <button
                onClick={() => setPanelOpen(!panelOpen)}
                className="icon-btn relative"
                aria-label={`Rappels (${due.length} en attente)`}
              >
                <Bell className="h-5 w-5" />
                {due.length > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 min-w-[1.05rem] h-[1.05rem] px-1 rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse-glow"
                    style={{ background: 'var(--danger)', color: '#fff' }}
                  >
                    {due.length}
                  </span>
                )}
              </button>

              {panelOpen && (
                <div
                  className="absolute right-0 mt-2 w-80 rounded-xl overflow-hidden z-50"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-strong)',
                    boxShadow: 'var(--shadow-lg)'
                  }}
                >
                  <div
                    className="px-4 py-3 flex items-center justify-between"
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Rappels
                    </span>
                    <button onClick={() => setPanelOpen(false)} className="icon-btn" style={{ padding: '0.25rem' }}>
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {due.length === 0 && upcoming.length === 0 && (
                      <p className="px-4 py-6 text-sm text-center text-dim">Aucun rappel programmé.</p>
                    )}

                    {due.map(reminder => (
                      <div
                        key={reminder.id}
                        className="px-4 py-3 flex items-start gap-2"
                        style={{ borderBottom: '1px solid var(--border)', background: 'var(--gold-soft)' }}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                            {reminder.title}
                          </p>
                          {reminder.message && (
                            <p className="text-xs text-dim mt-0.5 line-clamp-2">{reminder.message}</p>
                          )}
                          <p className="text-[11px] text-gold mt-1">
                            Échu le {new Date(reminder.dueAt).toLocaleDateString('fr-FR')}
                            {reminder.recurrence === 'weekly' && ' · hebdomadaire'}
                          </p>
                        </div>
                        <button
                          onClick={() => acknowledge(reminder)}
                          className="icon-btn"
                          style={{ padding: '0.25rem' }}
                          title="Marquer comme traité"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => remove(reminder.id)}
                          className="icon-btn icon-btn-danger"
                          style={{ padding: '0.25rem' }}
                          title="Supprimer"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}

                    {upcoming.slice(0, 6).map(reminder => (
                      <div key={reminder.id} className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {reminder.title}
                        </p>
                        <p className="text-[11px] text-dim mt-0.5">
                          Prévu le{' '}
                          {new Date(reminder.dueAt).toLocaleDateString('fr-FR', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short'
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div
              className="hidden sm:flex items-center gap-3 pl-3 ml-1"
              style={{ borderLeft: '1px solid var(--border)' }}
            >
              <div className="text-right">
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Administrateur
                </p>
                <p className="text-xs text-dim">{userEmail}</p>
              </div>
              <button
                onClick={() => navigate('/settings')}
                className="h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm"
                style={{
                  background: 'linear-gradient(135deg, var(--gold-deep), var(--gold-bright))',
                  color: '#10131f'
                }}
                aria-label="Profil"
              >
                A
              </button>
            </div>

            <button onClick={handleLogout} className="icon-btn icon-btn-danger" aria-label="Déconnexion">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
