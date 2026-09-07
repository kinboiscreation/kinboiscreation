import { useState } from 'react';
import { Save, X } from 'lucide-react';
import { Activity, ActivityType, ACTIVITY_NAMES } from '@midp/shared';

interface ActivityFormProps {
  activity?: Activity;
  onSubmit: (data: Partial<Activity>) => Promise<void>;
  onCancel?: () => void;
}

const ACTIVITY_TYPES: ActivityType[] = [
  'matinale',
  'nocturne',
  'atmosphère',
  'langues_feu',
  'nuit_culte',
  'mère_nation',
  'femmes_pieds',
  'spécial'
];

export default function ActivityForm({ activity, onSubmit, onCancel }: ActivityFormProps) {
  const [formData, setFormData] = useState({
    type: activity?.type || 'matinale' as ActivityType,
    date: activity?.date ? new Date(activity.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    totalParticipants: activity?.totalParticipants || 0,
    menCount: activity?.menCount || 0,
    womenCount: activity?.womenCount || 0,
    sessionNumber: activity?.sessionNumber || 1,
    remarks: activity?.remarks || ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalParticipants' || name === 'menCount' || name === 'womenCount' || name === 'sessionNumber'
        ? Number(value)
        : value
    }));
  };

  const handleAutoCalculate = () => {
    const men = Number(formData.menCount);
    const women = Number(formData.womenCount);
    setFormData(prev => ({
      ...prev,
      totalParticipants: men + women
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validation
      if (!formData.type || !formData.date) {
        throw new Error('Type et date sont obligatoires');
      }

      if (formData.totalParticipants < 0) {
        throw new Error('Le nombre de participants ne peut pas être négatif');
      }

      const total = formData.menCount + formData.womenCount;
      if (total > formData.totalParticipants && total > 0) {
        throw new Error('Le nombre d\'hommes + femmes dépasse le total');
      }

      await onSubmit({
        ...formData,
        date: new Date(formData.date)
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la soumission');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
          {error}
        </div>
      )}

      {/* Type d'activité */}
      <div>
        <label className="label">Type d'Activité *</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="input"
          required
        >
          <option value="">Sélectionner une activité</option>
          {ACTIVITY_TYPES.map(type => (
            <option key={type} value={type}>
              {ACTIVITY_NAMES[type]}
            </option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div>
        <label className="label">Date *</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="input"
          required
        />
      </div>

      {/* Nombre de participants */}
      <div className="grid-2">
        <div>
          <label className="label">Total de Participants *</label>
          <input
            type="number"
            name="totalParticipants"
            value={formData.totalParticipants}
            onChange={handleChange}
            className="input"
            min="0"
            required
          />
        </div>

        <div>
          <label className="label">Numéro de Séance</label>
          <input
            type="number"
            name="sessionNumber"
            value={formData.sessionNumber}
            onChange={handleChange}
            className="input"
            min="1"
          />
        </div>
      </div>

      {/* Hommes & Femmes */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="label mb-0">Répartition par Genre</label>
          <button
            type="button"
            onClick={handleAutoCalculate}
            className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
          >
            Calculer automatiquement
          </button>
        </div>

        <div className="grid-2">
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Hommes</label>
            <input
              type="number"
              name="menCount"
              value={formData.menCount}
              onChange={handleChange}
              className="input"
              min="0"
              placeholder="0"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400 mb-2 block">Femmes</label>
            <input
              type="number"
              name="womenCount"
              value={formData.womenCount}
              onChange={handleChange}
              className="input"
              min="0"
              placeholder="0"
            />
          </div>
        </div>

        <div className="mt-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
          <div className="text-sm text-slate-400">
            <div className="flex justify-between">
              <span>Hommes:</span>
              <span className="text-blue-400 font-medium">{formData.menCount}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Femmes:</span>
              <span className="text-pink-400 font-medium">{formData.womenCount}</span>
            </div>
            <div className="flex justify-between mt-2 pt-2 border-t border-slate-700/50">
              <span className="text-white">Total calculé:</span>
              <span className={`font-bold ${formData.menCount + formData.womenCount === formData.totalParticipants ? 'text-emerald-400' : 'text-amber-400'}`}>
                {formData.menCount + formData.womenCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Remarques */}
      <div>
        <label className="label">Remarques</label>
        <textarea
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          placeholder="Ajouter des remarques ou observations..."
          className="input resize-none"
          rows={3}
        />
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary flex-1"
        >
          {isLoading ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              Enregistrer
            </>
          )}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            <X className="h-5 w-5" />
            Annuler
          </button>
        )}
      </div>

      {/* Info helper */}
      <div className="text-xs text-slate-500 border-t border-slate-700/50 pt-4">
        <p>✓ Les champs marqués d'un * sont obligatoires</p>
        <p>✓ Les statistiques se mettront à jour automatiquement</p>
      </div>
    </form>
  );
}
