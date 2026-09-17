export type AnnouncementTone = 'solennel' | 'chaleureux' | 'bref';

export interface ComposerInput {
  subject: string;
  activity: string;
  date: string;
  time?: string;
  place?: string;
  link?: string;
  audience?: string;
  tone: AnnouncementTone;
  extra?: string;
}

const OPENINGS: Record<AnnouncementTone, string[]> = {
  solennel: [
    'Bien-aimés en Christ,',
    'À toute la famille du MIDP,',
    'Chers frères et sœurs,'
  ],
  chaleureux: ['Bonjour à tous,', 'Chers frères et sœurs bien-aimés,', 'Famille du MIDP,'],
  bref: ['Information MIDP —', 'Annonce —', 'À noter —']
};

const CLOSINGS: Record<AnnouncementTone, string[]> = {
  solennel: [
    'Que le Seigneur nous accorde un cœur disponible pour ce temps de prière.',
    'Venons nombreux, dans un esprit de consécration.',
    "Soyons unis d'un même cœur devant le Seigneur."
  ],
  chaleureux: [
    'Nous comptons sur votre présence et votre engagement.',
    'Votre présence sera une bénédiction pour tous.',
    'Au plaisir de prier ensemble.'
  ],
  bref: ['Merci de votre ponctualité.', 'Présence souhaitée.', 'Merci de noter cette date.']
};

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/** Choix stable : une même annonce produit toujours le même texte. */
function pick(options: string[], seed: string): string {
  const hash = [...seed].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return options[hash % options.length];
}

/**
 * Assistant de rédaction : compose une annonce structurée à partir des
 * informations saisies. Le texte reste entièrement modifiable avant envoi.
 */
export function composeAnnouncement(input: ComposerInput): string {
  const seed = `${input.subject}${input.activity}${input.date}`;
  const lines: string[] = [];

  lines.push(pick(OPENINGS[input.tone], seed));
  lines.push('');

  const when = [formatDate(input.date), input.time ? `à ${input.time}` : '']
    .filter(Boolean)
    .join(' ');

  if (input.tone === 'bref') {
    lines.push(`${input.activity} — ${input.subject}`);
    lines.push(`Quand : ${when}`);
    if (input.place) lines.push(`Où : ${input.place}`);
    if (input.link) lines.push(`Lien : ${input.link}`);
  } else {
    const audience = input.audience ? ` ${input.audience}` : ' toute la famille du MIDP';
    lines.push(
      `Nous invitons${audience} à prendre part à ${input.activity}, qui se tiendra le ${when}.`
    );
    lines.push('');
    lines.push(`Thème : ${input.subject}`);
    if (input.place) lines.push(`Lieu : ${input.place}`);
    if (input.link) lines.push(`Lien de connexion : ${input.link}`);
  }

  if (input.extra?.trim()) {
    lines.push('');
    lines.push(input.extra.trim());
  }

  lines.push('');
  lines.push(pick(CLOSINGS[input.tone], seed));
  lines.push('');
  lines.push('— Le secrétariat du MIDP');

  return lines.join('\n');
}
