import { Megaphone, Plus, Trash2, Edit, Send } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  scheduledFor?: string;
  reminderType?: 'tuesday' | 'none';
  aiGenerated?: boolean;
  createdAt: string;
  createdBy: string;
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    scheduledFor: '',
    reminderType: 'tuesday'
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/announcements?status=all&limit=100');
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status: formData.scheduledFor ? 'draft' : 'published'
        })
      });

      if (!response.ok) throw new Error('Failed to create announcement');

      setFormData({ title: '', content: '', scheduledFor: '', reminderType: 'tuesday' });
      setShowForm(false);
      await fetchAnnouncements();
    } catch (error) {
      console.error('Error creating announcement:', error);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      const response = await fetch(`/api/announcements/${id}/publish`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to publish announcement');
      await fetchAnnouncements();
    } catch (error) {
      console.error('Error publishing announcement:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) return;

    try {
      const response = await fetch(`/api/announcements/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete announcement');
      await fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/20 text-green-300';
      case 'draft':
        return 'bg-yellow-500/20 text-yellow-300';
      default:
        return 'bg-slate-500/20 text-slate-300';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="section-title">
          <Megaphone className="h-8 w-8 text-amber-500" />
          Annonces
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          <Plus className="h-5 w-5" />
          Nouvelle Annonce
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-8">
          <h2 className="section-subtitle mb-6">Créer une Annonce</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">Titre</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Titre de l'annonce"
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">Contenu</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Contenu de l'annonce"
                className="input resize-none"
                rows={5}
                required
              />
            </div>

            <div>
              <label className="label">Planifier pour (optionnel)</label>
              <input
                type="datetime-local"
                value={formData.scheduledFor}
                onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label className="label">Type de rappel</label>
              <select
                value={formData.reminderType}
                onChange={(e) => setFormData({ ...formData, reminderType: e.target.value })}
                className="input"
              >
                <option value="none">Pas de rappel</option>
                <option value="tuesday">Mardi (pour dimanche)</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" className="btn btn-primary flex-1">
                Créer Annonce
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

      {/* Announcements List */}
      {isLoading ? (
        <div className="card text-center py-12">
          <div className="animate-spin mx-auto">
            <div className="h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full"></div>
          </div>
        </div>
      ) : announcements.length > 0 ? (
        <div className="space-y-4">
          {announcements.map(announcement => (
            <div key={announcement.id} className="card p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{announcement.title}</h3>
                    <span className={`badge ${getStatusColor(announcement.status)}`}>
                      {announcement.status}
                    </span>
                  </div>
                  <p className="text-slate-300 mb-3">{announcement.content}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span>Par {announcement.createdBy}</span>
                    <span>
                      {new Date(announcement.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                    {announcement.scheduledFor && (
                      <span>
                        Prévu: {new Date(announcement.scheduledFor).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {announcement.status === 'draft' && (
                    <button
                      onClick={() => handlePublish(announcement.id)}
                      className="p-2 hover:bg-green-500/20 rounded-lg transition-colors"
                      title="Publier"
                    >
                      <Send className="h-4 w-4 text-green-400" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(announcement.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-slate-400">Aucune annonce</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary mt-4 mx-auto"
          >
            <Plus className="h-5 w-5" />
            Créer la première annonce
          </button>
        </div>
      )}
    </div>
  );
}
