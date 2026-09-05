import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';

/**
 * MYRTILLE & ABRICOT - LA COLÈRE
 * Version cinématographique complète
 * 40 secondes / 30 FPS / 1200 frames
 */

export const CinematicVersion: React.FC = () => {
  const frame = useCurrentFrame();

  // Camera shake effect (decreases over time)
  const shakeIntensity = interpolate(frame, [0, 150, 600, 1200], [8, 4, 1, 0], {
    easing: Easing.inOut(Easing.quad),
  });
  const cameraShake = Math.sin(frame * 0.15) * shakeIntensity + Math.cos(frame * 0.08) * (shakeIntensity * 0.5);

  // Light intensity (increases toward end - more calm)
  const lightIntensity = interpolate(frame, [0, 600, 1200], [0.7, 0.8, 1], {
    easing: Easing.out(Easing.quad),
  });

  // Myrtille entrance (0-3s / 0-90 frames)
  const myrtilleEntranceOpacity = interpolate(frame, [0, 30], [0, 1], {
    easing: Easing.out(Easing.cubic),
  });
  const myrtilleEntranceX = interpolate(frame, [0, 90], [-300, 0], {
    easing: Easing.out(Easing.cubic),
  });

  // Myrtille pacing (3-8s / 90-240 frames)
  const pacingMovement = Math.sin((frame - 90) * 0.02) * 100;

  // Abricot appearance (8-12s / 240-360 frames)
  const abricotAppearOpacity = interpolate(frame, [240, 270], [0, 1], {
    easing: Easing.out(Easing.cubic),
  });

  // Tension/closeness (12-22s / 360-660 frames - fields get tighter)
  const frameCloseness = interpolate(frame, [360, 660], [0, 1], {
    easing: Easing.inOut(Easing.quad),
  });

  // Turning point (22-28s / 660-840 frames - Myrtille stops)
  const turningPointFreeze = interpolate(frame, [660, 840], [0, 1], {
    easing: Easing.out(Easing.cubic),
  });

  // Calming phase (28-34s / 840-1020 frames - both together)
  const calmingPhaseProgress = interpolate(frame, [840, 1020], [0, 1], {
    easing: Easing.out(Easing.cubic),
  });

  // Final mastery phase (34-38s / 1020-1140 frames - camera perfectly still)
  const masteryPhase = interpolate(frame, [1020, 1140], [0, 1], {
    easing: Easing.out(Easing.cubic),
  });

  // Message opacity (38-40s / 1140-1200 frames)
  const finalMessageOpacity = interpolate(frame, [1140, 1160, 1180, 1200], [0, 1, 1, 0], {
    easing: Easing.inOut(Easing.cubic),
  });

  // Dialogue visibility based on time
  const dialogue1Opacity = interpolate(frame, [180, 210, 450, 480], [0, 1, 1, 0]); // "Non mais franchement..."
  const dialogue2Opacity = interpolate(frame, [300, 330, 450, 480], [0, 1, 1, 0]); // "Abricot - Myrtille..."
  const dialogue3Opacity = interpolate(frame, [480, 510, 660, 690], [0, 1, 1, 0]); // "Qu'est-ce qui s'est passé"
  const dialogue4Opacity = interpolate(frame, [660, 690, 840, 870], [0, 1, 1, 0]); // Poire/humiliée
  const dialogue5Opacity = interpolate(frame, [840, 870, 1020, 1050], [0, 1, 1, 0]); // "Ne le fais pas maintenant"
  const dialogue6Opacity = interpolate(frame, [1020, 1050, 1140, 1170], [0, 1, 1, 0]); // Wisdom about anger
  const dialogue7Opacity = interpolate(frame, [1140, 1170, 1200, 1200], [0, 1, 1, 0]); // Final acceptance

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#d4c4b0',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        transform: `translateX(${cameraShake}px)`,
        filter: `brightness(${lightIntensity})`,
      }}
    >
      {/* Background interior - living room */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/characters/5cf4972a-image.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15,
        }}
      />

      {/* ========== SECTION 0-3s: ENTRANCE ==========*/}

      {/* Myrtille entering */}
      <div
        style={{
          position: 'absolute',
          left: myrtilleEntranceX,
          top: 50,
          width: 600,
          height: 700,
          opacity: myrtilleEntranceOpacity,
          backgroundImage: 'url(/characters/5cf4972a-image.png)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      />

      {/* ========== SECTION 3-8s: PACING & ANGER ==========*/}

      {/* Myrtille pacing back and forth */}
      <div
        style={{
          position: 'absolute',
          left: 200 + pacingMovement * (frame > 90 ? 1 : 0),
          top: 100,
          width: 500,
          height: 650,
          opacity: interpolate(frame, [90, 150, 600], [1, 1, 0.3]),
          backgroundImage: 'url(/characters/5cf4972a-image.png)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          display: frame < 90 ? 'none' : 'block',
        }}
      />

      {/* Dialogue text - "Non mais franchement..." */}
      <div
        style={{
          position: 'absolute',
          left: 150,
          top: 200,
          fontSize: 28,
          color: '#fff',
          backgroundColor: 'rgba(0,0,0,0.6)',
          padding: '15px 25px',
          borderRadius: 8,
          opacity: dialogue1Opacity,
          maxWidth: 500,
        }}
      >
        "Non mais franchement… C'est pas possible…"
      </div>

      {/* ========== SECTION 8-12s: CONTRAST - ABRICOT APPEARS ==========*/}

      {/* Abricot sitting (right side) */}
      <div
        style={{
          position: 'absolute',
          right: 100 + frameCloseness * 50,
          top: 150,
          width: 550,
          height: 750,
          opacity: abricotAppearOpacity,
          backgroundImage: 'url(/characters/9101eebe-image.png)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      />

      {/* Dialogue - Abricot calls */}
      <div
        style={{
          position: 'absolute',
          right: 150,
          top: 300,
          fontSize: 24,
          color: '#fff',
          backgroundColor: 'rgba(0,0,0,0.6)',
          padding: '12px 20px',
          borderRadius: 8,
          opacity: dialogue2Opacity,
        }}
      >
        "Myrtille… Qu'est-ce qui t'arrive ?"
      </div>

      {/* ========== SECTION 12-17s: THE WOUND ==========*/}

      {/* Close-up emotional moment */}
      <div
        style={{
          position: 'absolute',
          left: 300 - frameCloseness * 100,
          top: 200,
          width: 600,
          height: 700,
          opacity: interpolate(frame, [360, 420, 660], [0, 1, 1]),
          backgroundImage: 'url(/characters/bbdb3a04-image.png)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      />

      {/* Dialogue - The hurt */}
      <div
        style={{
          position: 'absolute',
          left: 100,
          top: 150,
          fontSize: 26,
          color: '#ffcccc',
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: '15px 25px',
          borderRadius: 8,
          opacity: dialogue3Opacity,
          maxWidth: 600,
        }}
      >
        "Il m'a humiliée devant tout le monde… Poire croit que je vais laisser passer ça ?"
      </div>

      {/* ========== SECTION 17-22s: THE PEAK ==========*/}

      {/* Myrtille at her angriest */}
      <div
        style={{
          position: 'absolute',
          left: 400 - frameCloseness * 200,
          top: 100,
          width: 650,
          height: 800,
          opacity: interpolate(frame, [450, 510, 780], [0, 1, 1]),
          backgroundImage: 'url(/characters/4abc2f61-image.png)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          filter: `drop-shadow(0 0 ${30 * interpolate(frame, [510, 780], [1, 0])}px rgba(255,100,100,0.5))`,
        }}
      />

      {/* Dialogue - Peak anger */}
      <div
        style={{
          position: 'absolute',
          left: 150,
          top: 250,
          fontSize: 28,
          fontWeight: 'bold',
          color: '#ff6666',
          backgroundColor: 'rgba(0,0,0,0.8)',
          padding: '15px 25px',
          borderRadius: 8,
          opacity: dialogue4Opacity,
          maxWidth: 600,
        }}
      >
        "J'ai envie d'aller lui répondre TOUT DE SUITE!"
      </div>

      {/* ========== SECTION 22-28s: THE TURNING POINT ==========*/}

      {/* Myrtille freezes - Abricot speaks wisdom */}
      <div
        style={{
          position: 'absolute',
          left: 'calc(50% - 300px)',
          top: 150,
          width: 600,
          height: 700,
          opacity: interpolate(frame, [660, 720, 1020], [0, 1, 1]),
          backgroundImage: 'url(/characters/685875f5-image.png)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      />

      {/* Silence moment - only breathing */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 32,
          fontWeight: 'bold',
          color: '#fff',
          opacity: interpolate(frame, [660, 690, 810], [0, 1, 1]),
          textAlign: 'center',
          textShadow: '0 0 20px rgba(0,0,0,0.8)',
        }}
      >
        [Silence]
      </div>

      {/* Abricot wisdom */}
      <div
        style={{
          position: 'absolute',
          right: 100,
          bottom: 150,
          fontSize: 24,
          color: '#ffd700',
          backgroundColor: 'rgba(0,0,0,0.75)',
          padding: '20px 30px',
          borderRadius: 12,
          opacity: dialogue5Opacity,
          maxWidth: 500,
          fontStyle: 'italic',
        }}
      >
        "Ne le fais pas maintenant. Quand on parle sous la colère, ce sont nos blessures qui parlent avant nous."
      </div>

      {/* ========== SECTION 28-34s: CALM BEGINS ==========*/}

      {/* Both together on couch - calming moment */}
      <div
        style={{
          position: 'absolute',
          left: 'calc(50% - 700px)',
          top: 100,
          width: 1400,
          height: 800,
          opacity: interpolate(frame, [840, 900, 1020], [0, 1, 1]),
          backgroundImage: 'url(/characters/1a12b62b-image.png)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      />

      {/* Abricot wisdom continued */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 200,
          transform: 'translateX(-50%)',
          fontSize: 26,
          color: '#fff',
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: '20px 40px',
          borderRadius: 12,
          opacity: dialogue6Opacity,
          maxWidth: 700,
          textAlign: 'center',
          fontStyle: 'italic',
        }}
      >
        "Tu parleras mieux… quand la colère ne parlera plus à ta place."
      </div>

      {/* ========== SECTION 34-38s: MASTERY ==========*/}

      {/* Final moment - Myrtille calm and resolved */}
      <div
        style={{
          position: 'absolute',
          left: 'calc(50% - 600px)',
          top: 150,
          width: 1200,
          height: 750,
          opacity: interpolate(frame, [1020, 1080, 1200], [0, 1, 1]),
          backgroundImage: 'url(/characters/df2dee75-image.png)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      />

      {/* Final dialogue - Resolution */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 100,
          transform: 'translateX(-50%)',
          fontSize: 28,
          fontWeight: '600',
          color: '#fff',
          backgroundColor: 'rgba(0,0,0,0.8)',
          padding: '20px 40px',
          borderRadius: 12,
          opacity: dialogue7Opacity,
          maxWidth: 800,
          textAlign: 'center',
        }}
      >
        "Je vais d'abord me calmer… Et ensuite… je lui parlerai."
      </div>

      {/* ========== SECTION 38-40s: FINAL MESSAGE ==========*/}

      {/* Final message on black screen */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: `rgba(0,0,0,${interpolate(frame, [1140, 1160, 1180, 1200], [0, 1, 1, 1])})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          zIndex: 1000,
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 'bold',
            color: '#fff',
            opacity: interpolate(frame, [1140, 1160, 1180, 1200], [0, 1, 1, 0]),
            textAlign: 'center',
            marginBottom: 30,
          }}
        >
          🍑 DOMINE TA COLÈRE AVANT QU'ELLE NE TE DOMINE
        </div>

        <div
          style={{
            fontSize: 32,
            color: '#ffd700',
            opacity: interpolate(frame, [1160, 1180, 1200, 1200], [0, 1, 1, 0]),
            textAlign: 'center',
            fontStyle: 'italic',
          }}
        >
          La vraie force, c'est la maîtrise de soi.
        </div>
      </div>
    </div>
  );
};
