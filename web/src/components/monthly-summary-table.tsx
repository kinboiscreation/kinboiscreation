import { getMonthName } from '@midp/shared';
import { BarChart3 } from 'lucide-react';

export interface MonthlyEntry {
  date: string;
  totalParticipants?: number;
  menCount?: number;
  womenCount?: number;
}

interface MonthlySummaryTableProps {
  entries: MonthlyEntry[];
  title?: string;
  /** Affiche la répartition hommes / femmes. */
  showGender?: boolean;
}

interface MonthRow {
  key: string;
  month: number;
  year: number;
  sessions: number;
  total: number;
  men: number;
  women: number;
}

/**
 * Synthèse mensuelle exigée en sous-rubrique de chaque programme :
 * nombre de participants, nombre de séances et moyenne du mois.
 */
export default function MonthlySummaryTable({
  entries,
  title = 'Synthèse mensuelle',
  showGender = true
}: MonthlySummaryTableProps) {
  const byMonth = new Map<string, MonthRow>();

  entries.forEach(entry => {
    const date = new Date(entry.date);
    if (Number.isNaN(date.getTime())) return;

    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const key = `${year}-${month}`;

    const row = byMonth.get(key) ?? { key, month, year, sessions: 0, total: 0, men: 0, women: 0 };
    row.sessions += 1;
    row.total += entry.totalParticipants || 0;
    row.men += entry.menCount || 0;
    row.women += entry.womenCount || 0;
    byMonth.set(key, row);
  });

  const rows = [...byMonth.values()].sort((a, b) =>
    b.year !== a.year ? b.year - a.year : b.month - a.month
  );

  if (rows.length === 0) {
    return (
      <div className="card">
        <h3 className="section-subtitle mb-2 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-gold" />
          {title}
        </h3>
        <p className="text-dim text-sm">Aucune donnée enregistrée pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="section-subtitle flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-gold" />
        {title}
      </h3>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Mois</th>
              <th className="num">Séances</th>
              <th className="num">Participants</th>
              <th className="num">Moyenne</th>
              {showGender && <th className="num">Hommes</th>}
              {showGender && <th className="num">Femmes</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.key}>
                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                  {getMonthName(row.month)} {row.year}
                </td>
                <td className="num">{row.sessions}</td>
                <td className="num text-gold" style={{ fontWeight: 600 }}>
                  {row.total}
                </td>
                <td className="num text-royal" style={{ fontWeight: 600 }}>
                  {Math.round(row.total / row.sessions)}
                </td>
                {showGender && <td className="num">{row.men}</td>}
                {showGender && <td className="num">{row.women}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
