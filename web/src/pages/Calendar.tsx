import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Activity, ACTIVITY_NAMES } from '@midp/shared';

const DAYS_OF_WEEK = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const monthIndex = currentDate.getMonth();
  const year = currentDate.getFullYear();

  useEffect(() => {
    fetchCalendarData();
  }, [monthIndex, year]);

  const fetchCalendarData = async () => {
    try {
      setIsLoading(true);
      const month = monthIndex + 1;

      // Fetch activities for the month
      const activitiesRes = await fetch(`/api/activities?limit=500`);
      const activitiesData = await activitiesRes.json();

      // Filter by current month/year
      const monthActivities = activitiesData.activities.filter((a: Activity) => {
        const actDate = new Date(a.date);
        return actDate.getMonth() === monthIndex && actDate.getFullYear() === year;
      });

      setActivities(monthActivities);

      // Fetch monthly stats
      const statsRes = await fetch(`/api/stats/monthly/${year}/${month}`);
      const statsData = await statsRes.json();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getActivitiesForDay = (day: number) => {
    return activities.filter(a => {
      const actDate = new Date(a.date);
      return actDate.getDate() === day;
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(year, monthIndex - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, monthIndex + 1));
  };

  const today = new Date();
  const isCurrentMonth = today.getMonth() === monthIndex && today.getFullYear() === year;

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const calendarDays = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // Add days of month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="section-title">
        <Calendar className="h-8 w-8 text-amber-500" />
        Calendrier Intelligent
      </h1>

      {/* Month Navigation */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-amber-500" />
          </button>
          <h2 className="text-2xl font-semibold text-white">
            {MONTHS[monthIndex]} {year}
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-amber-500" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-6">
          {/* Day headers */}
          {DAYS_OF_WEEK.map(day => (
            <div
              key={day}
              className="p-3 text-center font-semibold text-slate-300 text-sm"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {calendarDays.map((day, index) => {
            const dayActivities = day ? getActivitiesForDay(day) : [];
            const isToday = isCurrentMonth && day === today.getDate();

            return (
              <div
                key={index}
                className={`p-2 rounded-lg text-xs transition-all ${
                  day === null
                    ? 'bg-transparent'
                    : isToday
                    ? 'bg-amber-500/30 border border-amber-500/50'
                    : 'bg-slate-700/30 hover:bg-slate-700/50'
                }`}
              >
                {day && (
                  <div className="space-y-1">
                    <div className={`font-semibold ${isToday ? 'text-amber-400' : 'text-slate-200'}`}>
                      {day}
                    </div>
                    {dayActivities.length > 0 && (
                      <div className="space-y-0.5">
                        {dayActivities.slice(0, 2).map(activity => (
                          <div
                            key={activity.id}
                            className="bg-amber-500/20 text-amber-300 px-1 py-0.5 rounded text-xs truncate"
                            title={ACTIVITY_NAMES[activity.type as keyof typeof ACTIVITY_NAMES]}
                          >
                            {ACTIVITY_NAMES[activity.type as keyof typeof ACTIVITY_NAMES]?.substring(0, 8)}
                          </div>
                        ))}
                        {dayActivities.length > 2 && (
                          <div className="text-slate-400 text-xs px-1">
                            +{dayActivities.length - 2}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Statistics */}
      {stats && (
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Statistiques du Mois</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats).map(([type, stat]: [string, any]) => (
              <div key={type} className="stat-box">
                <div className="text-sm text-slate-400 truncate">
                  {ACTIVITY_NAMES[type as keyof typeof ACTIVITY_NAMES]}
                </div>
                <div className="stat-number text-2xl">{stat.sessionCount}</div>
                <div className="text-xs text-slate-500">séances</div>
                <div className="text-xs text-amber-400 mt-2">Moy: {stat.average}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activities List for Selected Month */}
      {activities.length > 0 && (
        <div className="card overflow-x-auto">
          <h3 className="text-lg font-semibold text-white mb-4">Activités du Mois</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-4 py-3 text-left text-slate-300 font-semibold">Date</th>
                <th className="px-4 py-3 text-left text-slate-300 font-semibold">Type</th>
                <th className="px-4 py-3 text-center text-slate-300 font-semibold">Participants</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {activities
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map(activity => (
                  <tr key={activity.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 text-slate-300">
                      {new Date(activity.date).toLocaleDateString('fr-FR', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short'
                      })}
                    </td>
                    <td className="px-4 py-3 text-slate-100">
                      {ACTIVITY_NAMES[activity.type as keyof typeof ACTIVITY_NAMES]}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="badge badge-primary">{activity.totalParticipants}</span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && activities.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-slate-400">Aucune activité ce mois-ci</p>
        </div>
      )}
    </div>
  );
}
