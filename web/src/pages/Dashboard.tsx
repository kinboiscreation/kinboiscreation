import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Activity, Calendar } from 'lucide-react';

export default function Dashboard() {
  const [weeklyStats, setWeeklyStats] = useState<any>(null);
  const [monthlyStats, setMonthlyStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setWeeklyStats({
        total: 1250,
        sessions: 15,
        menAvg: 42,
        womenAvg: 38,
        activities: [
          { name: 'Matinaux', value: 85 },
          { name: 'Nocturnes', value: 120 },
          { name: 'Atmosphère', value: 95 },
          { name: 'Langues Feu', value: 140 },
          { name: 'Nuit Culte', value: 200 },
          { name: 'Mère Nation', value: 110 },
          { name: 'Femmes Pieds', value: 105 },
        ]
      });

      setMonthlyStats({
        trend: [
          { week: 'S1', participants: 245, avg: 81 },
          { week: 'S2', participants: 310, avg: 103 },
          { week: 'S3', participants: 298, avg: 99 },
          { week: 'S4', participants: 397, avg: 132 }
        ],
        topActivities: [
          { name: 'Nuit Culte', sessions: 4, avg: 50 },
          { name: 'Langues Feu', sessions: 4, avg: 35 },
          { name: 'Nocturnes', sessions: 5, avg: 24 },
        ]
      });

      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin">
          <div className="h-12 w-12 border-4 border-amber-500 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  const COLORS = ['#f59e0b', '#f97316', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="section-title">
          <BarChart3 className="h-8 w-8 text-amber-500" />
          Tableau de Bord Intelligent
        </h1>
        <p className="text-slate-400">
          Bienvenue ! Voici un aperçu de vos activités de cette semaine
        </p>
      </div>

      {/* Key Statistics */}
      <div className="grid-4">
        <div className="stat-box">
          <Users className="h-8 w-8 text-amber-500" />
          <div className="stat-number">{weeklyStats.total}</div>
          <div className="stat-label">Participants</div>
          <div className="text-xs text-emerald-400 mt-2">↑ 12% cette semaine</div>
        </div>

        <div className="stat-box">
          <Activity className="h-8 w-8 text-amber-500" />
          <div className="stat-number">{weeklyStats.sessions}</div>
          <div className="stat-label">Séances</div>
          <div className="text-xs text-emerald-400 mt-2">Tous en cours</div>
        </div>

        <div className="stat-box">
          <Users className="h-8 w-8 text-blue-400" />
          <div className="stat-number">{weeklyStats.menAvg}</div>
          <div className="stat-label">Hommes (moy)</div>
          <div className="text-xs text-slate-400 mt-2">par séance</div>
        </div>

        <div className="stat-box">
          <Users className="h-8 w-8 text-pink-400" />
          <div className="stat-number">{weeklyStats.womenAvg}</div>
          <div className="stat-label">Femmes (moy)</div>
          <div className="text-xs text-slate-400 mt-2">par séance</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid-2">
        {/* Activities Distribution */}
        <div className="card">
          <h2 className="section-subtitle flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-amber-500" />
            Distribution des Activités
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyStats.activities}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#f1f5f9'
                }}
              />
              <Bar dataKey="value" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="card">
          <h2 className="section-subtitle flex items-center gap-2">
            <Activity className="h-5 w-5 text-amber-500" />
            Répartition par Activité
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={weeklyStats.activities.slice(0, 5)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {weeklyStats.activities.slice(0, 5).map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#f1f5f9'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="card">
        <h2 className="section-subtitle flex items-center gap-2">
          <Calendar className="h-5 w-5 text-amber-500" />
          Tendance du Mois
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyStats.trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="week" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
                color: '#f1f5f9'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="participants"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ fill: '#f59e0b', r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="avg"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Activities */}
      <div className="card">
        <h2 className="section-subtitle">Top Activités du Mois</h2>
        <div className="space-y-3">
          {monthlyStats.topActivities.map((activity: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                <span className="font-medium">{activity.name}</span>
              </div>
              <div className="text-right">
                <div className="text-amber-400 font-bold">{activity.avg}</div>
                <div className="text-xs text-slate-400">{activity.sessions} séances</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
