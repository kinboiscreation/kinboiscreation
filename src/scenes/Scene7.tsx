import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';

export const Scene7: React.FC = () => {
  const frame = useCurrentFrame();

  const myrtilleScale = interpolate(frame, [0, 150], [1.1, 1], {
    easing: Easing.out(Easing.cubic),
  });

  const myrtilleX = interpolate(frame, [0, 150], [200, 0], {
    easing: Easing.out(Easing.cubic),
  });

  const abricotScale = interpolate(frame, [0, 60], [0.8, 1], {
    easing: Easing.out(Easing.cubic),
  });

  const connectionGlow = interpolate(frame, [60, 150], [0, 0.8], {
    easing: Easing.inOut(Easing.quad),
  });

  const understandingOpacity = interpolate(frame, [30, 120], [0, 1], {
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#fffacd',
        position: 'relative',
        padding: '0 80px',
      }}
    >
      {/* Kitchen background - warm and welcoming */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #fffef5 0%, #fff8dc 100%)',
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

      {/* Connection line between characters */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '200px',
          height: '3px',
          backgroundColor: '#ffd700',
          opacity: connectionGlow * 0.6,
          boxShadow: `0 0 ${20 * connectionGlow}px rgba(255, 215, 0, 0.8)`,
        }}
      />

      {/* Myrtille - calm and open */}
      <div
        style={{
          position: 'relative',
          zIndex: 9,
          transform: `scale(${myrtilleScale}) translateX(${myrtilleX}px)`,
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
            boxShadow: `0 12px 35px rgba(74, 124, 158, 0.3), 0 0 ${40 * connectionGlow}px rgba(255, 215, 0, 0.3)`,
          }}
        >
          {/* Peaceful eyes */}
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
                width: 32,
                height: 32,
                backgroundColor: '#fff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  backgroundColor: '#000',
                  borderRadius: '50%',
                  marginTop: '2px',
                }}
              />
            </div>
            <div
              style={{
                width: 32,
                height: 32,
                backgroundColor: '#fff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  backgroundColor: '#000',
                  borderRadius: '50%',
                  marginTop: '2px',
                }}
              />
            </div>
          </div>

          {/* Genuine smile */}
          <div
            style={{
              position: 'absolute',
              bottom: '70px',
              width: '85px',
              height: '45px',
              border: '3px solid #fff',
              borderTop: 'none',
              borderRadius: '0 0 45px 45px',
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
          }}
        >
          MYRTILLE
        </div>
      </div>

      {/* Abricot - affirming */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          transform: `scale(${abricotScale})`,
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
            boxShadow: `0 15px 40px rgba(255, 140, 66, 0.4), 0 0 ${50 * connectionGlow}px rgba(255, 215, 0, 0.4)`,
          }}
        >
          {/* Warm, affirming eyes */}
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

          {/* Warm smile */}
          <div
            style={{
              position: 'absolute',
              bottom: '70px',
              width: '95px',
              height: '48px',
              border: '3px solid #fff',
              borderTop: 'none',
              borderRadius: '0 0 48px 48px',
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
          }}
        >
          ABRICOT
        </div>
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
          opacity: understandingOpacity,
        }}
      >
        Nouvelle compréhension...
      </div>

      {/* Understanding message */}
      <div
        style={{
          position: 'absolute',
          bottom: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '22px',
          fontWeight: '600',
          color: '#333',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '20px 30px',
          borderRadius: '15px',
          borderTop: '4px solid #ffd700',
          opacity: understandingOpacity,
          maxWidth: '500px',
          textAlign: 'center',
        }}
      >
        "La colère n'est que le début du dialogue avec soi-même."
      </div>
    </div>
  );
};
