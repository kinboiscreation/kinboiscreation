import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();

  const cameraShake = interpolate(frame, [0, 30, 60, 90, 120, 150], [0, -2, 2, -1, 1, 0], {
    easing: Easing.inOut(Easing.quad),
  });

  const myrtilleScale = interpolate(frame, [0, 150], [0.8, 1], {
    easing: Easing.out(Easing.cubic),
  });

  const myrtilleOpacity = interpolate(frame, [0, 30], [0, 1], {
    easing: Easing.out(Easing.cubic),
  });

  const frownRotation = interpolate(frame, [30, 150], [0, -15], {
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
        transform: `translateX(${cameraShake}px)`,
      }}
    >
      {/* Kitchen background elements */}
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

      {/* Myrtille character placeholder */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          transform: `scale(${myrtilleScale})`,
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
            boxShadow: '0 10px 30px rgba(26, 26, 58, 0.4)',
            transform: `rotateX(${frownRotation}deg)`,
            transition: 'all 0.3s ease',
          }}
        >
          {/* Eyes */}
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
              }}
            />
            <div
              style={{
                width: 30,
                height: 30,
                backgroundColor: '#fff',
                borderRadius: '50%',
              }}
            />
          </div>

          {/* Angry frown */}
          <div
            style={{
              position: 'absolute',
              bottom: '80px',
              width: '80px',
              height: '40px',
              border: '3px solid #fff',
              borderTop: 'none',
              borderRadius: '0 0 40px 40px',
              transform: `rotateZ(${frownRotation}deg)`,
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
            color: '#1a1a3a',
            whiteSpace: 'nowrap',
          }}
        >
          MYRTILLE
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
          opacity: interpolate(frame, [0, 60, 150], [0, 1, 1], { easing: Easing.out(Easing.cubic) }),
        }}
      >
        Matin frustrant...
      </div>
    </div>
  );
};
