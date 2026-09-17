import { useEffect, useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  BarChart3,
  Presentation,
  Plus,
  Trash2,
  CalendarDays,
  FileDown,
  Loader2
} from 'lucide-react';
import { getMonthName } from '@midp/shared';
import { useCollection } from '../hooks/use-collection';
import { useParticipation } from '../hooks/use-participation';
import { generateCSV, downloadCSV } from '../utils/export';

interface CouncilDate {
  id: string;
  date: string;
  note?: string;
}

const CHART_GOLD = '#d4af37';
const CHART_ROYAL = '#a78bfa';

/** Les trois derniers mois, du plus ancien au plus récent. */
function lastThreeMonths(reference = new Date()) {
  return [2, 1, 0].map(offset => {
    const date = new Date(reference.getFullYear(), reference.getMonth() - offset, 1);
    return { month: date.getMonth() + 1, year: date.getFullYear() };
  });
}

export default function Council() {
  const { items: councilDates, add: addCouncilDate, remove: removeCouncilDate } =
    useCollection<CouncilDate>('midp-council-dates');

  const { entries: allEntries, apiActivities } = useParticipation();

  const [remarks, setRemarks] = useState(() => localStorage.getItem('midp-council-remarks') || '');
  const [keywords, setKeywords] = useState(() => localStorage.getItem('midp-council-keywords') || '');
  const [conclusion, setConclusion] = useState(
    () => localStorage.getItem('midp-council-conclusion') || ''
  );
  const [newDate, setNewDate] = useState('');
  const [newNote, setNewNote] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    localStorage.setItem('midp-council-remarks', remarks);
  }, [remarks]);
  useEffect(() => {
    localStorage.setItem('midp-council-keywords', keywords);
  }, [keywords]);
  useEffect(() => {
    localStorage.setItem('midp-council-conclusion', conclusion);
  }, [conclusion]);

  const months = lastThreeMonths();

  const monthly = useMemo(
    () =>
      months.map(({ month, year }) => {
        const inMonth = allEntries.filter(entry => {
          const date = new Date(entry.date);
          return date.getMonth() + 1 === month && date.getFullYear() === year;
        });

        const participants = inMonth.reduce((sum, e) => sum + e.participants, 0);
        const sessions = inMonth.length;

        return {
          label: `${getMonthName(month)} ${year}`,
          shortLabel: getMonthName(month).slice(0, 4),
          sessions,
          participants,
          average: sessions > 0 ? Math.round(participants / sessions) : 0,
          men: inMonth.reduce((sum, e) => sum + e.men, 0),
          women: inMonth.reduce((sum, e) => sum + e.women, 0)
        };
      }),
    [allEntries, months]
  );

  const byActivity = useMemo(() => {
    const windowStart = new Date(months[0].year, months[0].month - 1, 1);
    const grouped = new Map<string, { sessions: number; participants: number; men: number; women: number }>();

    allEntries
      .filter(entry => new Date(entry.date) >= windowStart)
      .forEach(entry => {
        const current = grouped.get(entry.label) ?? { sessions: 0, participants: 0, men: 0, women: 0 };
        current.sessions += 1;
        current.participants += entry.participants;
        current.men += entry.men;
        current.women += entry.women;
        grouped.set(entry.label, current);
      });

    return [...grouped.entries()]
      .map(([name, value]) => ({
        name,
        ...value,
        average: value.sessions > 0 ? Math.round(value.participants / value.sessions) : 0
      }))
      .sort((a, b) => b.participants - a.participants);
  }, [allEntries, months]);

  const totals = monthly.reduce(
    (acc, month) => ({
      participants: acc.participants + month.participants,
      sessions: acc.sessions + month.sessions
    }),
    { participants: 0, sessions: 0 }
  );
  const globalAverage = totals.sessions > 0 ? Math.round(totals.participants / totals.sessions) : 0;

  const currentQuarter = Math.floor(new Date().getMonth() / 3) + 1;

  const handleAddCouncilDate = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newDate) return;
    addCouncilDate({ date: newDate, note: newNote } as Omit<CouncilDate, 'id'>);
    setNewDate('');
    setNewNote('');
  };

  const handleGeneratePowerPoint = async () => {
    setGenerating(true);
    try {
      // Chargée à la demande : la librairie pèse lourd dans le bundle initial.
      const { generateCouncilDeck } = await import('../utils/powerpoint');
      await generateCouncilDeck({
        quarter: currentQuarter,
        year: new Date().getFullYear(),
        monthly,
        byActivity,
        remarks,
        conclusion,
        keywords: keywords
          .split(',')
          .map(keyword => keyword.trim())
          .filter(Boolean)
      });
    } catch (error) {
      console.error('Erreur de génération PowerPoint :', error);
      window.alert("La génération du PowerPoint a échoué. Consultez la console pour le détail.");
    } finally {
      setGenerating(false);
    }
  };

  const handleExportCSV = () => {
    const csv = generateCSV({
      title: `Rapport Conseil — ${monthly.map(m => m.label).join(' / ')}`,
      activities: apiActivities
    });
    downloadCSV(csv, `MIDP_Conseil_Q${currentQuarter}_${new Date().getFullYear()}.csv`);
  };

  const tooltipStyle = {
    backgroundColor: 'var(--bg-elevated)',
    border: '1px solid var(--border-strong)',
    borderRadius: '10px',
    color: 'var(--text-primary)'
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="section-title">
            <BarChart3 className="h-8 w-8 text-gold" />
            Espace Conseil
          </h1>
          <p className="text-dim text-sm mt-2">
            Statistiques des trois derniers mois, comparaisons et rapport trimestriel.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportCSV} className="btn btn-secondary">
            <FileDown className="h-5 w-5" />
            CSV
          </button>
          <button onClick={handleGeneratePowerPoint} disabled={generating} className="btn btn-royal">
            {generating ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Presentation className="h-5 w-5" />
            )}
            {generating ? 'Génération…' : 'Générer le PowerPoint'}
          </button>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid-4">
        <div className="stat-box">
          <span className="stat-label">Participants (3 mois)</span>
          <span className="stat-number">{totals.participants}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Séances (3 mois)</span>
          <span className="stat-number">{totals.sessions}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Moyenne par séance</span>
          <span className="stat-number-royal">{globalAverage}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Prochain conseil</span>
          <span className="stat-number-royal" style={{ fontSize: '1.25rem' }}>
            {councilDates.length > 0
              ? new Date(
                  [...councilDates].sort(
                    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
                  )[0].date
                ).toLocaleDateString('fr-FR')
              : '—'}
          </span>
        </div>
      </div>

      {/* Tableau des trois derniers mois */}
      <div className="space-y-3">
        <h2 className="section-subtitle">Statistiques des trois derniers mois</h2>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Mois</th>
                <th className="num">Séances</th>
                <th className="num">Participants</th>
                <th className="num">Moyenne</th>
                <th className="num">Hommes</th>
                <th className="num">Femmes</th>
                <th className="num">Évolution</th>
              </tr>
            </thead>
            <tbody>
              {monthly.map((month, index) => {
                const previous = monthly[index - 1];
                const delta = previous ? month.participants - previous.participants : null;
                const percent =
                  previous && previous.participants > 0
                    ? Math.round((delta! / previous.participants) * 100)
                    : null;

                return (
                  <tr key={month.label}>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{month.label}</td>
                    <td className="num">{month.sessions}</td>
                    <td className="num text-gold" style={{ fontWeight: 600 }}>
                      {month.participants}
                    </td>
                    <td className="num text-royal" style={{ fontWeight: 600 }}>
                      {month.average}
                    </td>
                    <td className="num">{month.men}</td>
                    <td className="num">{month.women}</td>
                    <td className="num">
                      {percent === null ? (
                        <span className="text-dim">—</span>
                      ) : (
                        <span className={percent >= 0 ? 'badge-success' : 'badge-danger'}>
                          {percent >= 0 ? '+' : ''}
                          {percent} %
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid-2">
        <div className="card">
          <h3 className="section-subtitle mb-4">Participation par mois</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="shortLabel" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--gold-soft)' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="participants" name="Participants" fill={CHART_GOLD} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="section-subtitle mb-4">Moyenne par séance</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="shortLabel" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="average"
                name="Moyenne"
                stroke={CHART_ROYAL}
                strokeWidth={2.5}
                dot={{ fill: CHART_ROYAL, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Répartition par activité */}
      {byActivity.length > 0 && (
        <div className="space-y-3">
          <h2 className="section-subtitle">Répartition par activité</h2>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Activité</th>
                  <th className="num">Séances</th>
                  <th className="num">Participants</th>
                  <th className="num">Moyenne</th>
                </tr>
              </thead>
              <tbody>
                {byActivity.map(activity => (
                  <tr key={activity.name}>
                    <td style={{ color: 'var(--text-primary)' }}>{activity.name}</td>
                    <td className="num">{activity.sessions}</td>
                    <td className="num text-gold" style={{ fontWeight: 600 }}>
                      {activity.participants}
                    </td>
                    <td className="num">{activity.average}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dates des conseils */}
      <div className="card space-y-4">
        <h2 className="section-subtitle flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-gold" />
          Dates des conseils
        </h2>

        <form onSubmit={handleAddCouncilDate} className="flex flex-wrap gap-2">
          <input
            type="date"
            value={newDate}
            onChange={e => setNewDate(e.target.value)}
            className="input"
            style={{ maxWidth: '13rem' }}
            required
          />
          <input
            type="text"
            value={newNote}
            onChange={e => setNewNote(e.target.value)}
            placeholder="Note (facultatif)"
            className="input"
            style={{ maxWidth: '20rem' }}
          />
          <button type="submit" className="btn btn-secondary">
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
        </form>

        {councilDates.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {[...councilDates]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map(council => (
                <span key={council.id} className="inline-flex items-center gap-1">
                  <span className="badge-primary">
                    {new Date(council.date).toLocaleDateString('fr-FR')}
                    {council.note ? ` — ${council.note}` : ''}
                  </span>
                  <button
                    onClick={() => removeCouncilDate(council.id)}
                    className="icon-btn icon-btn-danger"
                    style={{ padding: '0.25rem' }}
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </span>
              ))}
          </div>
        ) : (
          <p className="text-dim text-sm">Aucune date de conseil enregistrée.</p>
        )}
      </div>

      {/* Remarques avant génération */}
      <div className="card-gold space-y-5">
        <h2 className="section-subtitle">Remarques et mots-clés du rapport</h2>
        <p className="text-dim text-sm">
          Ce contenu alimente les pages « Remarques » et « Conclusion » du PowerPoint généré.
        </p>

        <div>
          <label className="label">Remarques du Conseil</label>
          <textarea
            value={remarks}
            onChange={e => setRemarks(e.target.value)}
            rows={5}
            className="input"
            style={{ resize: 'vertical' }}
            placeholder="Observations, décisions et points d'attention du trimestre"
          />
        </div>

        <div>
          <label className="label">Mots-clés (séparés par des virgules)</label>
          <input
            type="text"
            value={keywords}
            onChange={e => setKeywords(e.target.value)}
            className="input"
            placeholder="fidélité, croissance, intercession"
          />
        </div>

        <div>
          <label className="label">Conclusion</label>
          <textarea
            value={conclusion}
            onChange={e => setConclusion(e.target.value)}
            rows={4}
            className="input"
            style={{ resize: 'vertical' }}
            placeholder="Laissez vide pour une conclusion générée à partir des chiffres"
          />
        </div>

        <button onClick={handleGeneratePowerPoint} disabled={generating} className="btn btn-royal w-full">
          {generating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Presentation className="h-5 w-5" />}
          {generating ? 'Génération en cours…' : 'Générer le rapport PowerPoint'}
        </button>
      </div>
    </div>
  );
}
