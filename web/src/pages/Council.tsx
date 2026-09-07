import { BarChart3 } from 'lucide-react';

export default function Council() {
  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="section-title">
        <BarChart3 className="h-8 w-8 text-amber-500" />
        Espace Conseil
      </h1>
      <div className="card text-center py-12">
        <p className="text-slate-300">Espace conseil avec rapports trimestriels à mettre en place</p>
      </div>
    </div>
  );
}
