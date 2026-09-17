import { useState } from 'react';
import Navigation from './Navigation';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 min-w-0">
          <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
