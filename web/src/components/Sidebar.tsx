import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  Calendar,
  Megaphone,
  Users,
  Clock,
  FileText,
  BarChart3,
  Settings,
  Heart,
  Wind,
  Sparkles,
  Moon,
  Flame,
  Crown,
  HandHeart,
  UserCog,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuSections = [
  {
    label: 'Pilotage',
    items: [
      { icon: LayoutDashboard, label: 'Tableau de Bord', href: '/' },
      { icon: Calendar, label: 'Calendrier', href: '/calendar' }
    ]
  },
  {
    label: 'Activités',
    items: [
      { icon: Activity, label: 'Activités', href: '/activities' },
      { icon: Wind, label: 'Atmosphère de Prière', href: '/atmosphere' },
      { icon: Sparkles, label: 'Veillées de Prière', href: '/vigils' },
      { icon: Moon, label: 'Nuit de Prière', href: '/night-prayer' },
      { icon: Flame, label: 'Langues de Feu', href: '/tongues-of-fire' },
      { icon: Crown, label: 'Programmes Femmes', href: '/women-programs' },
      { icon: HandHeart, label: 'Intercession', href: '/intercession' }
    ]
  },
  {
    label: 'Organisation',
    items: [
      { icon: Megaphone, label: 'Annonces', href: '/announcements' },
      { icon: Users, label: 'Conducteurs', href: '/conductors' },
      { icon: Clock, label: 'Réunions', href: '/meetings' },
      { icon: Heart, label: 'Sujets de Prière', href: '/prayer-subjects' },
      { icon: FileText, label: 'Documents', href: '/documents' }
    ]
  },
  {
    label: 'Administration',
    items: [
      { icon: BarChart3, label: 'Espace Conseil', href: '/council' },
      { icon: UserCog, label: 'Utilisateurs', href: '/users' },
      { icon: Settings, label: 'Paramètres', href: '/settings' }
    ]
  }
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed md:sticky md:top-0 w-64 shrink-0 h-screen overflow-y-auto transition-transform duration-300 z-40 md:z-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{
          background: 'var(--bg-deep)',
          borderRight: '1px solid var(--border)'
        }}
      >
        <button
          onClick={onClose}
          className="icon-btn absolute top-4 right-4 md:hidden"
          aria-label="Fermer le menu"
        >
          <X className="h-5 w-5" />
        </button>

        <nav className="p-4 pt-14 md:pt-4 space-y-6 pb-28">
          {menuSections.map(section => (
            <div key={section.label} className="space-y-1">
              <p className="stat-label px-3 pb-1">{section.label}</p>
              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200"
                    style={
                      isActive
                        ? {
                            background: 'var(--gold-soft)',
                            color: 'var(--gold-bright)',
                            border: '1px solid var(--gold-border)',
                            fontWeight: 600
                          }
                        : {
                            color: 'var(--text-secondary)',
                            border: '1px solid transparent'
                          }
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div
          className="absolute bottom-0 left-0 right-0 p-4"
          style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-deep)' }}
        >
          <p className="text-xs" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
            MIDP v1.0.0
          </p>
          <p className="text-xs text-dim">© 2024 Tous droits réservés</p>
        </div>
      </aside>
    </>
  );
}
