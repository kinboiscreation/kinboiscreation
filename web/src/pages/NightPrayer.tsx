import { Moon } from 'lucide-react';
import SlotPlanning from '../components/slot-planning';

export default function NightPrayer() {
  return (
    <SlotPlanning
      type="nuit_culte"
      storageKey="midp-nuit-culte"
      title="Nuit de Prière — préparation au culte"
      subtitle="Séances du dimanche, relevé des connectés par créneau horaire."
      icon={<Moon className="h-8 w-8 text-gold" />}
      sundayOnly
    />
  );
}
