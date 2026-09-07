import { Menu, LogOut, Settings, Bell } from 'lucide-react';

interface NavigationProps {
  onMenuClick: () => void;
}

export default function Navigation({ onMenuClick }: NavigationProps) {
  return (
    <nav className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700/50 backdrop-blur-md sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors duration-200 md:hidden"
            >
              <Menu className="h-6 w-6 text-amber-500" />
            </button>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white">🙏</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">MIDP</h1>
                <p className="text-xs text-slate-400">Ministère d'Intercession</p>
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors duration-200 relative group">
              <Bell className="h-5 w-5 text-slate-300 group-hover:text-amber-500" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors duration-200">
              <Settings className="h-5 w-5 text-slate-300 hover:text-amber-500" />
            </button>

            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-700/50">
              <div className="text-right">
                <p className="text-sm font-medium text-white">Admin</p>
                <p className="text-xs text-slate-400">Super Admin</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold">
                A
              </div>
            </div>

            <button className="p-2 hover:bg-red-500/20 rounded-lg transition-colors duration-200">
              <LogOut className="h-5 w-5 text-red-400 hover:text-red-300" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
