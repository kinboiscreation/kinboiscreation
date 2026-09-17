import { useCallback, useEffect, useState } from 'react';

/**
 * Collection persistée localement, synchronisée entre les onglets ouverts.
 * Remplaçable par Firestore sans changer l'API consommée par les pages.
 */
export function useCollection<T extends { id: string }>(storageKey: string, initial: T[] = []) {
  const [items, setItems] = useState<T[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? (JSON.parse(stored) as T[]) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [storageKey, items]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === storageKey && event.newValue) {
        setItems(JSON.parse(event.newValue) as T[]);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [storageKey]);

  const add = useCallback((item: Omit<T, 'id'>) => {
    const created = { ...item, id: crypto.randomUUID() } as T;
    setItems(prev => [created, ...prev]);
    return created;
  }, []);

  const update = useCallback((id: string, patch: Partial<T>) => {
    setItems(prev => prev.map(item => (item.id === id ? { ...item, ...patch } : item)));
  }, []);

  const remove = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  return { items, add, update, remove, setItems };
}
