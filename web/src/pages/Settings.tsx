import { Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="section-title">
        <SettingsIcon className="h-8 w-8 text-amber-500" />
        Paramètres
      </h1>
      <div className="card text-center py-12">
        <p className="text-slate-300">Paramètres de l'application à mettre en place</p>
      </div>
    </div>
  );
}
