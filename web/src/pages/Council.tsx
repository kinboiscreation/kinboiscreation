import { BarChart3, Download, TrendingUp, FileJson, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Activity, ACTIVITY_NAMES } from '@midp/shared';
import { generateCSV, downloadCSV, generateJSON, downloadJSON, generateHTMLReport, exportToPDF } from '../utils/export';

export default function Council() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [quarter, setQuarter] = useState(1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchCouncilData();
  }, [quarter, year]);

  const fetchCouncilData = async () => {
    try {
      const response = await fetch('/api/activities?limit=500');
      const data = await response.json();

      const currentYear = new Date().getFullYear();
      const months = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [10, 11, 12]
      ][quarter - 1];

      const quarterActivities = data.activities.filter((a: Activity) => {
        const date = new Date(a.date);
        return date.getFullYear() === year && months.includes(date.getMonth() + 1);
      });

      setActivities(quarterActivities);

      // Calculate quarterly stats
      const quarterStats: any = {};
      quarterActivities.forEach((activity: Activity) => {
        if (!quarterStats[activity.type]) {
          quarterStats[activity.type] = {
            count: 0,
            totalParticipants: 0,
            menTotal: 0,
            womenTotal: 0
          };
        }
        quarterStats[activity.type].count += 1;
        quarterStats[activity.type].totalParticipants += activity.totalParticipants || 0;
        quarterStats[activity.type].menTotal += activity.menCount || 0;
        quarterStats[activity.type].womenTotal += activity.womenCount || 0;
      });

      Object.keys(quarterStats).forEach(key => {
        const s = quarterStats[key];
        s.average = s.count > 0 ? Math.round(s.totalParticipants / s.count) : 0;
      });

      setStats(quarterStats);
    } catch (error) {
      console.error('Error fetching council data:', error);
    }
  };

  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExportCSV = () => {
    const filename = `MIDP_Rapport_Q${quarter}_${year}.csv`;
    const csv = generateCSV({
      title: `Rapport Trimestriel Q${quarter} ${year} - MIDP`,
      activities
    });
    downloadCSV(csv, filename);
  };

  const handleExportJSON = () => {
    const filename = `MIDP_Rapport_Q${quarter}_${year}.json`;
    const json = generateJSON({
      title: `Rapport Trimestriel Q${quarter} ${year} - MIDP`,
      activities,
      stats
    });
    downloadJSON(json, filename);
  };

  const handleExportPDF = () => {
    const filename = `MIDP_Rapport_Q${quarter}_${year}.pdf`;
    const html = generateHTMLReport({
      title: `Rapport Trimestriel Q${quarter} ${year} - MIDP`,
      activities,
      stats
    });
    exportToPDF(html, filename);
  };

  const totalParticipants = Object.values(stats || {}).reduce(
    (sum: number, s: any) => sum + (s.totalParticipants || 0),
    0
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="section-title">
          <BarChart3 className="h-8 w-8 text-amber-500" />
          Espace Conseil
        </h1>
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="btn btn-primary"
          >
            <Download className="h-5 w-5" />
            Exporter Rapport
          </button>
          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-10">
              <button
                onClick={() => {
                  handleExportCSV();
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-slate-700 flex items-center gap-2 text-slate-300"
              >
                <FileText className="h-4 w-4" />
                Exporter en CSV
              </button>
              <button
                onClick={() => {
                  handleExportJSON();
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-slate-700 flex items-center gap-2 text-slate-300"
              >
                <FileJson className="h-4 w-4" />
                Exporter en JSON
              </button>
              <button
                onClick={() => {
                  handleExportPDF();
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-slate-700 flex items-center gap-2 text-slate-300 border-t border-slate-700"
              >
                <FileText className="h-4 w-4" />
                Imprimer/PDF
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quarter Selection */}
      <div className="card p-6">
        <div className="flex items-center gap-4">
          <select
            value={quarter}
            onChange={(e) => setQuarter(Number(e.target.value))}
            className="input w-fit"
          >
            <option value={1}>Q1 (Jan-Mar)</option>
            <option value={2}>Q2 (Avr-Jun)</option>
            <option value={3}>Q3 (Jul-Sep)</option>
            <option value={4}>Q4 (Oct-Déc)</option>
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="input w-fit"
          >
            {[...Array(5)].map((_, i) => (
              <option key={i} value={new Date().getFullYear() - i}>
                {new Date().getFullYear() - i}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="stat-box">
          <div className="text-sm text-slate-400">Sessions</div>
          <div className="stat-number text-2xl">{activities.length}</div>
        </div>
        <div className="stat-box">
          <div className="text-sm text-slate-400">Participants Total</div>
          <div className="stat-number text-2xl text-amber-400">{totalParticipants}</div>
        </div>
        <div className="stat-box">
          <div className="text-sm text-slate-400">Moyenne/Session</div>
          <div className="stat-number text-2xl text-green-400">
            {activities.length > 0 ? Math.round(totalParticipants / activities.length) : 0}
          </div>
        </div>
      </div>

      {/* Activity Statistics */}
      {stats && Object.keys(stats).length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Statistiques par Type</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="px-4 py-3 text-left text-slate-300 font-semibold">Type</th>
                  <th className="px-4 py-3 text-center text-slate-300 font-semibold">Sessions</th>
                  <th className="px-4 py-3 text-center text-slate-300 font-semibold">Participants</th>
                  <th className="px-4 py-3 text-center text-slate-300 font-semibold">Moyenne</th>
                  <th className="px-4 py-3 text-center text-slate-300 font-semibold">Hommes</th>
                  <th className="px-4 py-3 text-center text-slate-300 font-semibold">Femmes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {Object.entries(stats).map(([type, s]: [string, any]) => (
                  <tr key={type} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 text-slate-100">
                      {ACTIVITY_NAMES[type as keyof typeof ACTIVITY_NAMES]}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-300">{s.count}</td>
                    <td className="px-4 py-3 text-center text-amber-400">{s.totalParticipants}</td>
                    <td className="px-4 py-3 text-center text-green-400">{s.average}</td>
                    <td className="px-4 py-3 text-center text-blue-300">{s.menTotal}</td>
                    <td className="px-4 py-3 text-center text-pink-300">{s.womenTotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {activities.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-slate-400">Aucune données pour cette période</p>
        </div>
      )}
    </div>
  );
}
