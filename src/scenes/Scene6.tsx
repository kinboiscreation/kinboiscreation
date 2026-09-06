import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';

export const Scene6: React.FC = () => {
  const frame = useCurrentFrame();

  const transformScale = interpolate(frame, [0, 75, 150], [1, 1.3, 1.1], {
    easing: Easing.inOut(Easing.cubic),
  });

  const lightBurst = interpolate(frame, [30, 100], [0, 1], {
    easing: Easing.out(Easing.cubic),
  });

  const myrtilleColorShift = interpolate(frame, [0, 150], [0, 1], {
    easing: Easing.inOut(Easing.quad),
  });

  const expressionChange = interpolate(frame, [60, 150], [0, 1], {
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
        overflow: 'hidden',
      }}
    >
      {/* Kitchen background - brightening */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `linear-gradient(135deg, #fffacd ${50 - lightBurst * 20}%, #fffef5 ${50 + lightBurst * 20}%)`,
          opacity: 0.7,
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

      {/* Light burst rays */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '2px',
            height: '400px',
            backgroundColor: '#ffd700',
            opacity: lightBurst * (0.6 - i * 0.04),
            transform: `
              translate(-50%, -50%)
              rotate(${(i / 12) * 360}deg)
              translateY(-200px)
            `,
            transformOrigin: 'center center',
          }}
        />
      ))}

      {/* Myrtille - TRANSFORMATION */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          transform: `scale(${transformScale})`,
        }}
      >
        <div
          style={{
            width: 280,
            height: 300,
            backgroundColor: `rgb(${Math.round(26 - myrtilleColorShift * 10)}, ${Math.round(26 + myrtilleColorShift * 80)}, ${Math.round(58 + myrtilleColorShift * 120)})`,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 15px 40px rgba(26, 26, 58, 0.4), 0 0 ${80 * lightBurst}px rgba(255, 215, 0, 0.5)`,
          }}
        >
          {/* Eyes - awakening */}
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
                width: interpolate(frame, [0, 150], [30, 35], { easing: Easing.out(Easing.cubic) }),
                height: interpolate(frame, [0, 150], [30, 35], { easing: Easing.out(Easing.cubic) }),
                backgroundColor: '#fff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
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
                width: interpolate(frame, [0, 150], [30, 35], { easing: Easing.out(Easing.cubic) }),
                height: interpolate(frame, [0, 150], [30, 35], { easing: Easing.out(Easing.cubic) }),
                backgroundColor: '#fff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
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

          {/* Expression shift - from frown to slight smile */}
          <div
            style={{
              position: 'absolute',
              bottom: '70px',
              width: `${70 + expressionChange * 20}px`,
              height: `${3 + expressionChange * 20}px`,
              border: '3px solid #fff',
              borderTop: 'none',
              borderRadius: `0 0 ${30 + expressionChange * 10}px ${30 + expressionChange * 10}px`,
            }}
          />
        </div>

        {/* Label */}
        <div
          style={{
            position: 'absolute',
            bottom: -50,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '24px',
            fontWeight: 'bold',
            color: interpolate(frame, [0, 150], [1, 0.7]) > 0.5 ? '#1a1a3a' : '#4a7c9e',
          }}
        >
          MYRTILLE
        </div>
      </div>

      {/* Abricot (background, supporting) */}
      <div
        style={{
          position: 'absolute',
          right: '100px',
          zIndex: 5,
          opacity: 0.4,
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
        Moment de transformation...
      </div>

      {/* Realization text */}
      <div
        style={{
          position: 'absolute',
          bottom: '100px',
          right: '50px',
          fontSize: '20px',
          fontWeight: '600',
          color: '#333',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '15px 20px',
          borderRadius: '10px',
          borderLeft: '4px solid #ffd700',
          opacity: interpolate(frame, [80, 150], [0, 1], { easing: Easing.out(Easing.cubic) }),
          maxWidth: '300px',
        }}
      >
        "Je peux choisir comment répondre..."
      </div>
    </div>
  );
};
