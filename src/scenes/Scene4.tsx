import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';

export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();

  const myrtilleScale = interpolate(frame, [0, 150], [1.15, 0.9], {
    easing: Easing.out(Easing.quad),
  });

  const abricotScale = interpolate(frame, [0, 60], [0.8, 1.1], {
    easing: Easing.out(Easing.cubic),
  });

  const abricotGlow = interpolate(frame, [30, 150], [0, 0.8], {
    easing: Easing.inOut(Easing.quad),
  });

  const wisdomOpacity = interpolate(frame, [30, 100], [0, 1], {
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fffacd',
        position: 'relative',
        padding: '0 100px',
      }}
    >
      {/* Kitchen background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #fffacd 0%, #fff8dc 100%)',
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

      {/* Myrtille (calming down, smaller) */}
      <div
        style={{
          position: 'relative',
          zIndex: 9,
          transform: `scale(${myrtilleScale})`,
        }}
      >
        <div
          style={{
            width: 220,
            height: 240,
            backgroundColor: '#1a1a3a',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(26, 26, 58, 0.3)',
          }}
        >
          {/* Eyes - beginning to relax */}
          <div
            style={{
              position: 'absolute',
              display: 'flex',
              gap: '35px',
              top: '90px',
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

          {/* Neutral mouth - recovering */}
          <div
            style={{
              position: 'absolute',
              bottom: '70px',
              width: '60px',
              height: '3px',
              backgroundColor: '#fff',
            }}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: -35,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '18px',
            fontWeight: '600',
            color: '#1a1a3a',
          }}
        >
          MYRTILLE
        </div>
      </div>

      {/* Abricot character - WISDOM */}
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
            boxShadow: `0 15px 40px rgba(255, 140, 66, 0.4), 0 0 ${60 * abricotGlow}px rgba(255, 200, 100, 0.5)`,
          }}
        >
          {/* Knowing eyes */}
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

          {/* Wise smile */}
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

        {/* Label */}
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

      {/* Wisdom text bubble */}
      <div
        style={{
          position: 'absolute',
          bottom: '100px',
          right: '50px',
          fontSize: '20px',
          fontWeight: '600',
          color: '#333',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '15px 20px',
          borderRadius: '10px',
          borderLeft: '4px solid #ff8c42',
          opacity: wisdomOpacity,
          maxWidth: '300px',
        }}
      >
        "La colère est un signal, pas une fin..."
      </div>
    </div>
  );
};
