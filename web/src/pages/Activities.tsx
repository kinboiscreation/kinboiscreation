import { Plus, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function Activities() {
  const [activities, setActivities] = useState<any[]>([
    {
      id: 1,
      type: 'Matinaux de Prière',
      date: '2024-09-06',
      participants: 85,
      men: 45,
      women: 40,
      remarks: 'Bonne participation'
    },
    {
      id: 2,
      type: 'Nocturnes de Prière',
      date: '2024-09-05',
      participants: 120,
      men: 65,
      women: 55,
      remarks: 'Très bon accueil'
    }
  ]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="section-title">Gestion des Activités</h1>
        <button className="btn btn-primary">
          <Plus className="h-5 w-5" />
          Nouvelle Activité
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="px-4 py-3 text-left text-slate-300 font-semibold">Type</th>
              <th className="px-4 py-3 text-left text-slate-300 font-semibold">Date</th>
              <th className="px-4 py-3 text-center text-slate-300 font-semibold">Participants</th>
              <th className="px-4 py-3 text-center text-slate-300 font-semibold">Hommes</th>
              <th className="px-4 py-3 text-center text-slate-300 font-semibold">Femmes</th>
              <th className="px-4 py-3 text-left text-slate-300 font-semibold">Remarques</th>
              <th className="px-4 py-3 text-center text-slate-300 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {activities.map((activity) => (
              <tr key={activity.id} className="hover:bg-slate-700/30 transition-colors">
                <td className="px-4 py-3 text-slate-100">{activity.type}</td>
                <td className="px-4 py-3 text-slate-300">{activity.date}</td>
                <td className="px-4 py-3 text-center">
                  <span className="badge badge-primary">{activity.participants}</span>
                </td>
                <td className="px-4 py-3 text-center text-blue-300">{activity.men}</td>
                <td className="px-4 py-3 text-center text-pink-300">{activity.women}</td>
                <td className="px-4 py-3 text-slate-300">{activity.remarks}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors">
                      <Edit className="h-4 w-4 text-blue-400" />
                    </button>
                    <button className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
