import { Wind } from 'lucide-react';
import ThemedSessions from '../components/themed-sessions';

export default function AtmospherePrayer() {
  return (
    <ThemedSessions
      kind="adp"
      storageKey="midp-adp-themes"
      title="Atmosphère de Prière — à thème"
      subtitle="Saisie hebdomadaire du vendredi : thème, date, annonce et remarques."
      icon={<Wind className="h-8 w-8 text-gold" />}
      fridayOnly
      withAnnouncement
    />
  );
}
