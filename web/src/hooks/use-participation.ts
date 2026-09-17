import { useEffect, useMemo, useState } from 'react';
import {
  PROGRAM_NAMES,
  PROGRAM_SHORT_NAMES,
  PROGRAM_ORDER,
  ProgramKey,
  ActivityType,
  ThemedSession,
  SlotSession,
  WomenProgram,
  WomenProgramType,
  sumSlots
} from '@midp/shared';
import { useCollection } from './use-collection';

export interface ParticipationEntry {
  date: string;
  program: ProgramKey;
  label: string;
  participants: number;
  men: number;
  women: number;
}

const WOMEN_PROGRAM_KEYS: Record<WomenProgramType, ProgramKey> = {
  mère_nation: 'mère_nation',
  femmes_pieds: 'femmes_pieds',
  spécial_femmes: 'spécial'
};

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
      const program = activity.type as ActivityType;
      all.push({
        date: activity.date,
        program,
        label: PROGRAM_NAMES[program] || activity.type,
        participants: activity.totalParticipants || 0,
        men: activity.menCount || 0,
        women: activity.womenCount || 0
      });
    });

    [...adp, ...vigils].forEach(session => {
      const program: ProgramKey = session.kind === 'adp' ? 'atmosphère' : 'veillee';
      all.push({
        date: session.date,
        program,
        label: PROGRAM_NAMES[program],
        participants: session.totalParticipants || 0,
        men: session.menCount || 0,
        women: session.womenCount || 0
      });
    });

    [...nightPrayer, ...tongues].forEach(session => {
      const totals = sumSlots(session.slots);
      const program: ProgramKey = session.type === 'nuit_culte' ? 'nuit_culte' : 'langues_feu';
      all.push({
        date: session.date,
        program,
        label: PROGRAM_NAMES[program],
        participants: totals.total,
        men: totals.men,
        women: totals.women
      });
    });

    womenPrograms.forEach(program => {
      const key = WOMEN_PROGRAM_KEYS[program.programType];
      all.push({
        date: program.date,
        program: key,
        label: PROGRAM_NAMES[key],
        participants: program.totalParticipants || 0,
        men: program.menCount || 0,
        women: program.womenCount || 0
      });
    });

    return all.filter(entry => !Number.isNaN(new Date(entry.date).getTime()));
  }, [apiActivities, adp, vigils, nightPrayer, tongues, womenPrograms]);

  return { entries, loading, apiActivities };
}

/**
 * Chiffres du mois pour chacun des programmes du ministère, y compris ceux
 * qui n'ont encore aucune saisie : le tableau de bord doit tous les montrer.
 */
export function allProgramsForMonth(entries: ParticipationEntry[], month: number, year: number) {
  return PROGRAM_ORDER.map(program => {
    const inMonth = entries.filter(entry => {
      if (entry.program !== program) return false;
      const date = new Date(entry.date);
      return date.getMonth() + 1 === month && date.getFullYear() === year;
    });

    const participants = inMonth.reduce((sum, entry) => sum + entry.participants, 0);
    const sessions = inMonth.length;

    return {
      program,
      name: PROGRAM_NAMES[program],
      shortName: PROGRAM_SHORT_NAMES[program],
      sessions,
      participants,
      average: sessions > 0 ? Math.round(participants / sessions) : 0,
      men: inMonth.reduce((sum, entry) => sum + entry.men, 0),
      women: inMonth.reduce((sum, entry) => sum + entry.women, 0)
    };
  });
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
