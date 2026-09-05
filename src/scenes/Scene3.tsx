import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();

  const shakeIntensity = Math.sin(frame * 0.4) * 8;

  const myrtilleScale = interpolate(frame, [0, 60], [1, 1.15], {
    easing: Easing.out(Easing.quad),
  });

  const myrtilleOpacity = 1;

  const frownAngle = interpolate(frame, [0, 150], [0, -45], {
    easing: Easing.inOut(Easing.quad),
  });

  const emotionParticles = interpolate(frame, [0, 150], [0, 1], {
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fffacd',
        position: 'relative',
        transform: `translateX(${shakeIntensity}px)`,
      }}
    >
      {/* Kitchen background - more intense */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #fff4cd 0%, #ffedaa 100%)',
          opacity: 0.8,
        }}
      />

      {/* Counter/Sink area */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '200px',
          backgroundColor: '#d3d3d3',
          borderTop: '4px solid #a9a9a9',
        }}
      />

      {/* Abricot (faded right) */}
      <div
        style={{
          position: 'absolute',
          right: '150px',
          zIndex: 9,
          opacity: 0.2,
        }}
      >
        <div
          style={{
            width: 200,
            height: 220,
            backgroundColor: '#ff8c42',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(255, 140, 66, 0.2)',
          }}
        />
      </div>

      {/* Myrtille character - OUTBURST */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          transform: `scale(${myrtilleScale})`,
          opacity: myrtilleOpacity,
          filter: `drop-shadow(0 0 ${20 * emotionParticles}px rgba(26, 26, 58, 0.6))`,
        }}
      >
        <div
          style={{
            width: 280,
            height: 300,
            backgroundColor: '#1a1a3a',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 15px 40px rgba(26, 26, 58, 0.6)',
          }}
        >
          {/* Angry eyes - wide open */}
          <div
            style={{
              position: 'absolute',
              display: 'flex',
              gap: '40px',
              top: '90px',
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                backgroundColor: '#fff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: '#000',
                  borderRadius: '50%',
                }}
              />
            </div>
            <div
              style={{
                width: 40,
                height: 40,
                backgroundColor: '#fff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: '#000',
                  borderRadius: '50%',
                }}
              />
            </div>
          </div>

          {/* Extreme angry frown */}
          <div
            style={{
              position: 'absolute',
              bottom: '60px',
              width: '100px',
              height: '50px',
              border: '4px solid #fff',
              borderTop: 'none',
              borderRadius: '0 0 50px 50px',
              transform: `rotateZ(${frownAngle}deg)`,
            }}
          />

          {/* Angry eyebrows */}
          <div
            style={{
              position: 'absolute',
              top: '70px',
              left: '60px',
              width: '30px',
              height: '8px',
              backgroundColor: '#fff',
              transform: 'rotate(-30deg)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '70px',
              right: '60px',
              width: '30px',
              height: '8px',
              backgroundColor: '#fff',
              transform: 'rotate(30deg)',
            }}
          />
        </div>

        {/* Emotion particles - anger burst effect */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '12px',
              height: '12px',
              backgroundColor: '#ff4444',
              borderRadius: '50%',
              opacity: emotionParticles * (1 - i * 0.1),
              left: '50%',
              top: '50%',
              transform: `
                translate(-50%, -50%)
                translate(${Math.cos((i / 8) * Math.PI * 2) * 150}px, ${Math.sin((i / 8) * Math.PI * 2) * 150}px)
              `,
            }}
          />
        ))}
      </div>

      {/* Subtitle text */}
      <div
        style={{
          position: 'absolute',
          bottom: '50px',
          left: '50px',
          fontSize: '32px',
          fontWeight: '700',
          color: '#d32f2f',
          opacity: interpolate(frame, [30, 80, 150], [0, 1, 1], { easing: Easing.out(Easing.cubic) }),
        }}
      >
        EXPLOSION DE COLÈRE!
      </div>
    </div>
  );
};
