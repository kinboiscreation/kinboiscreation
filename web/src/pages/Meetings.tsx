import { Clock, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  notes: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export default function Meetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    attendees: 0,
    notes: ''
  });

  useEffect(() => {
    const stored = localStorage.getItem('meetings');
    if (stored) setMeetings(JSON.parse(stored));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newMeeting: Meeting = {
      id: Date.now().toString(),
      ...formData,
      attendees: Number(formData.attendees),
      status: 'scheduled'
    };
    const updated = [...meetings, newMeeting];
    setMeetings(updated);
    localStorage.setItem('meetings', JSON.stringify(updated));
    setFormData({ title: '', date: '', time: '', location: '', attendees: 0, notes: '' });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    const updated = meetings.filter(m => m.id !== id);
    setMeetings(updated);
    localStorage.setItem('meetings', JSON.stringify(updated));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="section-title">
          <Clock className="h-8 w-8 text-amber-500" />
          Réunions
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          <Plus className="h-5 w-5" />
          Nouvelle Réunion
        </button>
      </div>

      {showForm && (
        <div className="card p-8">
          <h2 className="section-subtitle mb-6">Planifier une Réunion</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">Titre</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">Heure</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="input"
                  required
                />
              </div>
            </div>
            <div>
              <label className="label">Lieu</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="input"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button type="submit" className="btn btn-primary flex-1">
                Créer Réunion
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn btn-secondary flex-1"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {meetings.length > 0 ? (
        <div className="space-y-4">
          {meetings.map(meeting => (
            <div key={meeting.id} className="card p-6">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{meeting.title}</h3>
                  <div className="space-y-1 text-sm text-slate-300">
                    <p>📅 {new Date(meeting.date).toLocaleDateString('fr-FR')} à {meeting.time}</p>
                    <p>📍 {meeting.location}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(meeting.id)}
                  className="p-2 hover:bg-red-500/20 rounded-lg"
                >
                  <Trash2 className="h-4 w-4 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-slate-400">Aucune réunion planifiée</p>
        </div>
      )}
    </div>
  );
}
