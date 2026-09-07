import { Clock, Plus } from 'lucide-react';

export default function Meetings() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="section-title">
          <Clock className="h-8 w-8 text-amber-500" />
          Réunions
        </h1>
        <button className="btn btn-primary">
          <Plus className="h-5 w-5" />
          Nouvelle Réunion
        </button>
      </div>
      <div className="card text-center py-12">
        <p className="text-slate-300">Gestion des réunions à mettre en place</p>
      </div>
    </div>
  );
}
