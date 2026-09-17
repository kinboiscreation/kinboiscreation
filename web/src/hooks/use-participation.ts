import { useEffect, useMemo, useState } from 'react';
import {
  ACTIVITY_NAMES,
  WOMEN_PROGRAM_NAMES,
  ActivityType,
  ThemedSession,
  SlotSession,
  WomenProgram,
  sumSlots
} from '@midp/shared';
import { useCollection } from './use-collection';

export interface ParticipationEntry {
  date: string;
  label: string;
  participants: number;
  men: number;
  women: number;
}

/**
 * Réunit la participation de toutes les sources du ministère : activités
 * enregistrées via l'API, sessions à thème, créneaux horaires et programmes
 * des femmes. Sert le tableau de bord, le calendrier et l'espace Conseil.
 */
export function useParticipation() {
  const { items: adp } = useCollection<ThemedSession>('midp-adp-themes');
  const { items: vigils } = useCollection<ThemedSession>('midp-veillees');
  const { items: nightPrayer } = useCollection<SlotSession>('midp-nuit-culte');
  const { items: tongues } = useCollection<SlotSession>('midp-langues-feu');
  const { items: womenPrograms } = useCollection<WomenProgram>('midp-women-programs');

  const [apiActivities, setApiActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/activities?limit=500')
      .then(response => (response.ok ? response.json() : { activities: [] }))
      .then(data => {
        if (!cancelled) setApiActivities(data.activities || []);
      })
      .catch(() => {
        if (!cancelled) setApiActivities([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const entries = useMemo<ParticipationEntry[]>(() => {
    const all: ParticipationEntry[] = [];

    apiActivities.forEach(activity => {
      all.push({
        date: activity.date,
        label: ACTIVITY_NAMES[activity.type as ActivityType] || activity.type,
        participants: activity.totalParticipants || 0,
        men: activity.menCount || 0,
        women: activity.womenCount || 0
      });
    });

    [...adp, ...vigils].forEach(session => {
      all.push({
        date: session.date,
        label: session.kind === 'adp' ? 'Atmosphère de Prière' : 'Veillées de Prière',
        participants: session.totalParticipants || 0,
        men: session.menCount || 0,
        women: session.womenCount || 0
      });
    });

    [...nightPrayer, ...tongues].forEach(session => {
      const totals = sumSlots(session.slots);
      all.push({
        date: session.date,
        label: session.type === 'nuit_culte' ? 'Nuit de Prière' : 'Langues de Feu',
        participants: totals.total,
        men: totals.men,
        women: totals.women
      });
    });

    womenPrograms.forEach(program => {
      all.push({
        date: program.date,
        label: WOMEN_PROGRAM_NAMES[program.programType],
        participants: program.totalParticipants || 0,
        men: program.menCount || 0,
        women: program.womenCount || 0
      });
    });

    return all.filter(entry => !Number.isNaN(new Date(entry.date).getTime()));
  }, [apiActivities, adp, vigils, nightPrayer, tongues, womenPrograms]);

  return { entries, loading, apiActivities };
}

/** Agrège une liste d'entrées pour un mois calendaire donné. */
export function summarizeMonth(entries: ParticipationEntry[], month: number, year: number) {
  const inMonth = entries.filter(entry => {
    const date = new Date(entry.date);
    return date.getMonth() + 1 === month && date.getFullYear() === year;
  });

  const participants = inMonth.reduce((sum, entry) => sum + entry.participants, 0);
  const sessions = inMonth.length;

  return {
    sessions,
    participants,
    average: sessions > 0 ? Math.round(participants / sessions) : 0,
    men: inMonth.reduce((sum, entry) => sum + entry.men, 0),
    women: inMonth.reduce((sum, entry) => sum + entry.women, 0),
    entries: inMonth
  };
}
