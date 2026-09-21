import React from 'react';
import { Audio, Sequence } from 'remotion';

/**
 * Audio Layer for Cinematic Version
 * Dialogues + Background music synchronized to frames
 */

export const AudioLayerCinematic: React.FC = () => {
  return (
    <>
      {/* ========== DIALOGUE SEQUENCES ========== */}

      {/* Scene 1-2 (0-240s): Myrtille's entrance and anger pacing */}
      {/* Dialogue: "Non mais franchement… C'est pas possible… Quel manque de respect…" */}
      <Sequence from={90} durationInFrames={180}>
        <Audio
          src="/audio/myrtille-anger-01.mp3"
          volume={0.9}
        />
      </Sequence>

      {/* Scene 3 (240-360s): Abricot calls out */}
      {/* Dialogue: "Myrtille… Qu'est-ce qui t'arrive ?" */}
      <Sequence from={270} durationInFrames={90}>
        <Audio
          src="/audio/abricot-calls-01.mp3"
          volume={0.85}
        />
      </Sequence>

      {/* Scene 4 (360-510s): The wound revealed */}
      {/* Dialogue Myrtille: "Il m'a humiliée devant tout le monde…" */}
      <Sequence from={390} durationInFrames={120}>
        <Audio
          src="/audio/myrtille-wound-02.mp3"
          volume={0.9}
        />
      </Sequence>

      {/* Scene 5 (510-660s): Peak anger about Poire */}
      {/* Dialogue: "Poire! Il m'a humiliée! J'ai envie d'aller lui répondre tout de suite!" */}
      <Sequence from={510} durationInFrames={150}>
        <Audio
          src="/audio/myrtille-peak-anger-03.mp3"
          volume={0.95}
        />
      </Sequence>

      {/* Scene 6 (660-840s): The turning point - Abricot's wisdom */}
      {/* Abricot: "Ne le fais pas maintenant. Quand on parle sous la colère..." */}
      <Sequence from={690} durationInFrames={150}>
        <Audio
          src="/audio/abricot-wisdom-turning-point.mp3"
          volume={0.85}
        />
      </Sequence>

      {/* Scene 7 (840-1020s): Calm begins - continued wisdom */}
      {/* Abricot: "Tu parleras mieux… quand la colère ne parlera plus à ta place." */}
      <Sequence from={870} durationInFrames={120}>
        <Audio
          src="/audio/abricot-wisdom-continued.mp3"
          volume={0.8}
        />
      </Sequence>

      {/* Scene 8 (1020-1140s): Mastery - Myrtille's resolution */}
      {/* Myrtille: "Je vais d'abord me calmer… Et ensuite… je lui parlerai." */}
      <Sequence from={1050} durationInFrames={90}>
        <Audio
          src="/audio/myrtille-resolution-final.mp3"
          volume={0.9}
        />
      </Sequence>

      {/* ========== BACKGROUND MUSIC ========== */}

      {/* Full 40-second background music (volume 30% to not overpower dialogue) */}
      <Audio
        src="/audio/background-music-emotional-journey.mp3"
        volume={0.3}
      />

      {/* ========== AMBIENT SOUNDS ========== */}

      {/* Door slam + breathing (0-3s) */}
      <Sequence from={0} durationInFrames={90}>
        <Audio
          src="/audio/ambient-entrance-door-breathing.mp3"
          volume={0.6}
        />
      </Sequence>

      {/* Quiet room ambience - escalating tension (3-22s) */}
      <Sequence from={90} durationInFrames={390}>
        <Audio
          src="/audio/ambient-room-quiet.mp3"
          volume={0.2}
        />
      </Sequence>

      {/* Silence moment - only breathing (22-28s) */}
      <Sequence from={660} durationInFrames={180}>
        <Audio
          src="/audio/ambient-silence-breathing.mp3"
          volume={0.4}
        />
      </Sequence>

      {/* Calm peaceful ambience (28-40s) */}
      <Sequence from={840} durationInFrames={360}>
        <Audio
          src="/audio/ambient-peaceful-resolution.mp3"
          volume={0.25}
        />
      </Sequence>
    </>
  );
};
