import { Flame } from 'lucide-react';
import SlotPlanning from '../components/slot-planning';

export default function TonguesOfFire() {
  return (
    <SlotPlanning
      type="langues_feu"
      storageKey="midp-langues-feu"
      title="Langues de Feu"
      subtitle="Planning des conducteurs et relevé des connectés par créneau horaire."
      icon={<Flame className="h-8 w-8 text-gold" />}
    />
  );
}
