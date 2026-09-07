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
  X
} from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Tableau de Bord', href: '/' },
  { icon: Activity, label: 'Activités', href: '/activities' },
  { icon: Calendar, label: 'Calendrier', href: '/calendar' },
  { icon: Megaphone, label: 'Annonces', href: '/announcements' },
  { icon: Users, label: 'Conducteurs', href: '/conductors' },
  { icon: Clock, label: 'Réunions', href: '/meetings' },
  { icon: FileText, label: 'Documents', href: '/documents' },
  { icon: BarChart3, label: 'Conseil', href: '/council' },
  { icon: Heart, label: 'Sujets de Prière', href: '/prayer-subjects' },
  { icon: Settings, label: 'Paramètres', href: '/settings' }
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed md:relative w-64 h-screen md:h-auto bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-md border-r border-slate-700/50 transition-transform duration-300 z-40 md:z-0',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Close Button Mobile */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-700/50 rounded-lg transition-colors md:hidden"
        >
          <X className="h-5 w-5 text-slate-300" />
        </button>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2 mt-8 md:mt-0">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300',
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-500/20'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-amber-400'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50 bg-gradient-to-t from-slate-950 to-transparent">
          <div className="text-xs text-slate-400 space-y-1">
            <p className="font-medium text-slate-300">MIDP v1.0.0</p>
            <p>© 2024 Tous droits réservés</p>
          </div>
        </div>
      </aside>
    </>
  );
}
