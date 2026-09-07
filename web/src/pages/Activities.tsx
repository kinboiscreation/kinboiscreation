import { Plus, Edit, Trash2, BarChart3 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Activity, ACTIVITY_NAMES } from '@midp/shared';
import ActivityForm from '../components/activity-form';

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchActivities();
    fetchStats();
  }, []);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/activities?limit=50');
      const data = await response.json();
      setActivities(data.activities || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      const response = await fetch(`/api/stats/monthly/${year}/${month}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmit = async (data: Partial<Activity>) => {
    try {
      if (editingActivity) {
        // Update activity
        console.log('Updating activity:', data);
      } else {
        // Create new activity
        const response = await fetch('/api/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Failed to create activity');

        setShowForm(false);
        await fetchActivities();
        await fetchStats();
      }
    } catch (error) {
      console.error('Error submitting activity:', error);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="section-title">
          <BarChart3 className="h-8 w-8 text-amber-500" />
          Gestion des Activités
        </h1>
        <button
          onClick={() => {
            setEditingActivity(null);
            setShowForm(!showForm);
          }}
          className="btn btn-primary"
        >
          <Plus className="h-5 w-5" />
          Nouvelle Activité
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="card p-8">
          <h2 className="section-subtitle mb-6">
            {editingActivity ? 'Modifier l\'Activité' : 'Créer une Nouvelle Activité'}
          </h2>
          <ActivityForm
            activity={editingActivity || undefined}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingActivity(null);
            }}
          />
        </div>
      )}

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats).map(([type, stat]: [string, any]) => (
            <div key={type} className="stat-box">
              <div className="text-sm text-slate-400 truncate">{ACTIVITY_NAMES[type as keyof typeof ACTIVITY_NAMES]}</div>
              <div className="stat-number text-2xl">{stat.sessionCount}</div>
              <div className="text-xs text-slate-500">séances</div>
              <div className="text-xs text-amber-400 mt-2">Moy: {stat.average}</div>
            </div>
          ))}
        </div>
      )}

      {/* Activities Table */}
      {isLoading ? (
        <div className="card text-center py-12">
          <div className="animate-spin mx-auto">
            <div className="h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full"></div>
          </div>
        </div>
      ) : activities.length > 0 ? (
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
                  <td className="px-4 py-3 text-slate-100">
                    {ACTIVITY_NAMES[activity.type as keyof typeof ACTIVITY_NAMES]}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {new Date(activity.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="badge badge-primary">{activity.totalParticipants}</span>
                  </td>
                  <td className="px-4 py-3 text-center text-blue-300">{activity.menCount}</td>
                  <td className="px-4 py-3 text-center text-pink-300">{activity.womenCount}</td>
                  <td className="px-4 py-3 text-slate-300 text-sm">{activity.remarks || '-'}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setEditingActivity(activity);
                          setShowForm(true);
                        }}
                        className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
                      >
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
      ) : (
        <div className="card text-center py-12">
          <p className="text-slate-400">Aucune activité enregistrée</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary mt-4 mx-auto"
          >
            <Plus className="h-5 w-5" />
            Créer la première activité
          </button>
        </div>
      )}
    </div>
  );
}
