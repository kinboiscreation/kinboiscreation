import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';

export const Scene8: React.FC = () => {
  const frame = useCurrentFrame();

  const myrtilleY = interpolate(frame, [0, 150], [50, 0], {
    easing: Easing.out(Easing.cubic),
  });

  const abricotY = interpolate(frame, [0, 150], [-50, 0], {
    easing: Easing.out(Easing.cubic),
  });

  const connectionStrength = interpolate(frame, [0, 150], [0, 1], {
    easing: Easing.out(Easing.cubic),
  });

  const heartGlow = Math.sin(frame * 0.05) * 0.3 + 0.7;

  const resolutionOpacity = interpolate(frame, [60, 150], [0, 1], {
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
      {/* Kitchen background - warm and peaceful */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #fffef5 0%, #fff8dc 100%)',
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

      {/* Soft glow aura */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255, 215, 0, ${0.2 * connectionStrength}) 0%, rgba(255, 215, 0, 0) 100%)`,
          opacity: heartGlow,
        }}
      />

      {/* Connection particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: '6px',
            height: '6px',
            backgroundColor: '#ffd700',
            borderRadius: '50%',
            opacity: connectionStrength * (0.3 + (i % 10) * 0.05),
            left: '50%',
            top: '50%',
            transform: `
              translate(-50%, -50%)
              translate(${Math.cos((i / 20) * Math.PI * 2) * 250}px, ${Math.sin((i / 20) * Math.PI * 2) * 250}px)
            `,
          }}
        />
      ))}

      {/* Myrtille (transformed) */}
      <div
        style={{
          position: 'absolute',
          left: 'calc(50% - 150px)',
          zIndex: 10,
          transform: `translateY(${myrtilleY}px)`,
        }}
      >
        <div
          style={{
            width: 260,
            height: 280,
            backgroundColor: '#4a7c9e',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 15px 40px rgba(74, 124, 158, 0.4), 0 0 ${40 * connectionStrength}px rgba(255, 215, 0, 0.5)`,
          }}
        >
          {/* Radiant eyes */}
          <div
            style={{
              position: 'absolute',
              display: 'flex',
              gap: '35px',
              top: '100px',
            }}
          >
            <div
              style={{
                width: 35,
                height: 35,
                backgroundColor: '#fff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  backgroundColor: '#000',
                  borderRadius: '50%',
                  marginTop: '2px',
                }}
              />
            </div>
            <div
              style={{
                width: 35,
                height: 35,
                backgroundColor: '#fff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  backgroundColor: '#000',
                  borderRadius: '50%',
                  marginTop: '2px',
                }}
              />
            </div>
          </div>

          {/* Warm smile */}
          <div
            style={{
              position: 'absolute',
              bottom: '65px',
              width: '95px',
              height: '50px',
              border: '3px solid #fff',
              borderTop: 'none',
              borderRadius: '0 0 50px 50px',
            }}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: -45,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '20px',
            fontWeight: '600',
            color: '#4a7c9e',
            opacity: resolutionOpacity,
          }}
        >
          MYRTILLE
        </div>
      </div>

      {/* Abricot (supportive) */}
      <div
        style={{
          position: 'absolute',
          right: 'calc(50% - 150px)',
          zIndex: 10,
          transform: `translateY(${abricotY}px)`,
        }}
      >
        <div
          style={{
            width: 280,
            height: 300,
            backgroundColor: '#ff8c42',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 15px 40px rgba(255, 140, 66, 0.4), 0 0 ${40 * connectionStrength}px rgba(255, 215, 0, 0.5)`,
          }}
        >
          {/* Nurturing eyes */}
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
                width: 35,
                height: 35,
                backgroundColor: '#fff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  backgroundColor: '#000',
                  borderRadius: '50%',
                  marginTop: '2px',
                }}
              />
            </div>
            <div
              style={{
                width: 35,
                height: 35,
                backgroundColor: '#fff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  backgroundColor: '#000',
                  borderRadius: '50%',
                  marginTop: '2px',
                }}
              />
            </div>
          </div>

          {/* Nurturing smile */}
          <div
            style={{
              position: 'absolute',
              bottom: '70px',
              width: '100px',
              height: '50px',
              border: '3px solid #fff',
              borderTop: 'none',
              borderRadius: '0 0 50px 50px',
            }}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: -50,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#ff8c42',
            opacity: resolutionOpacity,
          }}
        >
          ABRICOT
        </div>
      </div>

      {/* Resolution message - centered at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '24px',
          fontWeight: '700',
          color: '#333',
          backgroundColor: 'rgba(255, 255, 255, 0.97)',
          padding: '25px 40px',
          borderRadius: '15px',
          borderTop: '4px solid #ffd700',
          opacity: resolutionOpacity,
          maxWidth: '600px',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        }}
      >
        L'automaîtrise commence par la compréhension et l'acceptation.
      </div>

      {/* Top title */}
      <div
        style={{
          position: 'absolute',
          top: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '32px',
          fontWeight: '700',
          color: '#333',
          opacity: interpolate(frame, [0, 100, 150], [0, 1, 1], { easing: Easing.out(Easing.cubic) }),
        }}
      >
        MYRTILLE & ABRICOT
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: 'absolute',
          top: '75px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '16px',
          fontStyle: 'italic',
          color: '#666',
          opacity: interpolate(frame, [30, 150], [0, 1], { easing: Easing.out(Easing.cubic) }),
        }}
      >
        Une histoire sur l'autocontrôle
      </div>
    </div>
  );
};
