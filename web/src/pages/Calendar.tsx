import { Calendar } from 'lucide-react';

export default function CalendarPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="section-title">
        <Calendar className="h-8 w-8 text-amber-500" />
        Calendrier Intelligent
      </h1>
      <div className="card text-center py-12">
        <p className="text-slate-300">Calendrier interactif à mettre en place</p>
      </div>
    </div>
  );
}
