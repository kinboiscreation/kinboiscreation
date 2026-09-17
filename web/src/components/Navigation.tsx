import { Menu, LogOut, Bell, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from './logo';
import { useTheme } from '../contexts/theme-context';

interface NavigationProps {
  onMenuClick: () => void;
}

export default function Navigation({ onMenuClick }: NavigationProps) {
  const { theme, toggleTheme } = useTheme();
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
      style={{
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)'
      }}
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

            <button className="icon-btn relative" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              <span
                className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full animate-pulse-glow"
                style={{ background: 'var(--danger)' }}
              />
            </button>

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
