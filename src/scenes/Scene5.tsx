import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';

export const Scene5: React.FC = () => {
  const frame = useCurrentFrame();

  const myrtilleRotation = Math.sin(frame * 0.05) * 3;

  const myrtilleOpacity = interpolate(frame, [0, 150], [1, 0.9], {
    easing: Easing.inOut(Easing.quad),
  });

  const thoughtCloud = interpolate(frame, [0, 150], [0, 1], {
    easing: Easing.out(Easing.cubic),
  });

  const abricotOpacity = interpolate(frame, [0, 150], [1, 0.3], {
    easing: Easing.inOut(Easing.quad),
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
      }}
    >
      {/* Kitchen background - softer tones */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #fffacd 0%, #fff8dc 100%)',
          opacity: 0.5,
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

      {/* Abricot (supportive, faded) */}
      <div
        style={{
          position: 'absolute',
          left: '80px',
          zIndex: 8,
          opacity: abricotOpacity,
        }}
      >
        <div
          style={{
            width: 180,
            height: 200,
            backgroundColor: '#ff8c42',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(255, 140, 66, 0.2)',
          }}
        />
      </div>

      {/* Myrtille - internal struggle */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          transform: `rotateZ(${myrtilleRotation}deg)`,
          opacity: myrtilleOpacity,
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
            boxShadow: '0 10px 30px rgba(26, 26, 58, 0.3)',
          }}
        >
          {/* Conflicted eyes - one up, one down */}
          <div
            style={{
              position: 'absolute',
              display: 'flex',
              gap: '40px',
              top: '100px',
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                backgroundColor: '#fff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: 'translateY(-5px)',
              }}
            >
              <div
                style={{
                  width: 15,
                  height: 15,
                  backgroundColor: '#000',
                  borderRadius: '50%',
                }}
              />
            </div>
            <div
              style={{
                width: 30,
                height: 30,
                backgroundColor: '#fff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: 'translateY(5px)',
              }}
            >
              <div
                style={{
                  width: 15,
                  height: 15,
                  backgroundColor: '#000',
                  borderRadius: '50%',
                }}
              />
            </div>
          </div>

          {/* Uncertain mouth - questioning */}
          <div
            style={{
              position: 'absolute',
              bottom: '75px',
              width: '70px',
              height: '2px',
              backgroundColor: '#fff',
              transform: 'rotate(-5deg)',
            }}
          />
        </div>

        {/* Thought particles - internal turmoil */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '10px',
              height: '10px',
              backgroundColor: '#1a1a3a',
              borderRadius: '50%',
              opacity: thoughtCloud * (0.3 + i * 0.1),
              left: '50%',
              top: '-20px',
              transform: `
                translate(-50%, 0)
                translate(${Math.cos((i / 6) * Math.PI * 2) * 80}px, ${Math.sin((i / 6) * Math.PI * 2) * 60}px)
              `,
            }}
          />
        ))}
      </div>

      {/* Subtitle text */}
      <div
        style={{
          position: 'absolute',
          top: '50px',
          left: '50px',
          fontSize: '28px',
          fontWeight: '600',
          color: '#333',
          opacity: interpolate(frame, [30, 100, 150], [0, 1, 1], { easing: Easing.out(Easing.cubic) }),
        }}
      >
        Lutte intérieure...
      </div>

      {/* Inner conflict text */}
      <div
        style={{
          position: 'absolute',
          bottom: '80px',
          right: '80px',
          fontSize: '18px',
          fontStyle: 'italic',
          color: '#666',
          opacity: interpolate(frame, [60, 150], [0, 1], { easing: Easing.out(Easing.cubic) }),
          maxWidth: '250px',
        }}
      >
        "Je dois comprendre pourquoi je réagis ainsi..."
      </div>
    </div>
  );
};
