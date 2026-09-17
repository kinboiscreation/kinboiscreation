import { Sparkles } from 'lucide-react';
import ThemedSessions from '../components/themed-sessions';

export default function Vigils() {
  return (
    <ThemedSessions
      kind="veillee"
      storageKey="midp-veillees"
      title="Veillées de Prière"
      subtitle="Thème, date, heure, sujets de prière joints et rappel."
      icon={<Sparkles className="h-8 w-8 text-gold" />}
      withTime
      withDocument
    />
  );
}
