import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();

  const abricotScale = interpolate(frame, [0, 30], [0.7, 1], {
    easing: Easing.out(Easing.cubic),
  });

  const abricotOpacity = interpolate(frame, [0, 30], [0, 1], {
    easing: Easing.out(Easing.cubic),
  });

  const abricotX = interpolate(frame, [0, 150], [100, 0], {
    easing: Easing.out(Easing.cubic),
  });

  const smileAngle = interpolate(frame, [30, 150], [0, 5], {
    easing: Easing.inOut(Easing.quad),
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

      {/* Myrtille (faded left) */}
      <div
        style={{
          position: 'relative',
          zIndex: 9,
          opacity: 0.3,
        }}
      >
        <div
          style={{
            width: 200,
            height: 220,
            backgroundColor: '#1a1a3a',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(26, 26, 58, 0.2)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -30,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '16px',
            fontWeight: '600',
            color: '#1a1a3a',
          }}
        >
          MYRTILLE
        </div>
      </div>

      {/* Abricot character (calm observation) */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          transform: `scale(${abricotScale}) translateX(${abricotX}px)`,
          opacity: abricotOpacity,
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
            boxShadow: '0 10px 30px rgba(255, 140, 66, 0.4)',
          }}
        >
          {/* Eyes - peaceful gaze */}
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
              }}
            >
              <div
                style={{
                  width: 15,
                  height: 15,
                  backgroundColor: '#000',
                  borderRadius: '50%',
                  marginTop: '3px',
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
                  marginTop: '3px',
                }}
              />
            </div>
          </div>

          {/* Gentle smile */}
          <div
            style={{
              position: 'absolute',
              bottom: '70px',
              width: '90px',
              height: '45px',
              border: '3px solid #fff',
              borderTop: 'none',
              borderRadius: '0 0 45px 45px',
              transform: `rotateZ(${smileAngle}deg)`,
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
            whiteSpace: 'nowrap',
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
          right: '50px',
          fontSize: '28px',
          fontWeight: '600',
          color: '#333',
          opacity: interpolate(frame, [0, 60, 150], [0, 1, 1], { easing: Easing.out(Easing.cubic) }),
        }}
      >
        Observation paisible...
      </div>
    </div>
  );
};
