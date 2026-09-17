import { useCallback, useEffect, useState } from 'react';
import { Reminder, ReminderSource } from '@midp/shared';
import { useCollection } from './use-collection';

const TICK_MS = 60_000;

/** Prochaine occurrence d'un jour de semaine donné, à l'heure indiquée. */
export function nextWeekday(weekday: number, hour = 9, minute = 0): string {
  const now = new Date();
  const target = new Date(now);
  target.setHours(hour, minute, 0, 0);

  const delta = (weekday - now.getDay() + 7) % 7;
  target.setDate(target.getDate() + delta);
  if (delta === 0 && target <= now) target.setDate(target.getDate() + 7);

  return target.toISOString();
}

export function useReminders() {
  const { items: reminders, add, update, remove } = useCollection<Reminder>('midp-reminders');
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), TICK_MS);
    return () => clearInterval(interval);
  }, []);

  const due = reminders.filter(
    reminder => !reminder.acknowledged && new Date(reminder.dueAt).getTime() <= now
  );

  const upcoming = [...reminders]
    .filter(reminder => !reminder.acknowledged && new Date(reminder.dueAt).getTime() > now)
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());

  /** Un rappel hebdomadaire se reprogramme au lieu d'être clôturé. */
  const acknowledge = useCallback(
    (reminder: Reminder) => {
      if (reminder.recurrence === 'weekly') {
        const next = new Date(reminder.dueAt);
        next.setDate(next.getDate() + 7);
        update(reminder.id, { dueAt: next.toISOString() });
        return;
      }
      update(reminder.id, { acknowledged: true });
    },
    [update]
  );

  const schedule = useCallback(
    (input: {
      title: string;
      message?: string;
      dueAt: string;
      sourceType: ReminderSource;
      sourceId?: string;
      recurrence?: 'none' | 'weekly';
      weekday?: number;
    }) =>
      add({
        ...input,
        recurrence: input.recurrence ?? 'none',
        acknowledged: false
      } as Omit<Reminder, 'id'>),
    [add]
  );

  return { reminders, due, upcoming, schedule, acknowledge, remove };
}
