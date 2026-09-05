import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const GifDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = interpolate(frame, [0, fps * 3], [0.5, 1.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rotation = interpolate(frame, [0, fps * 6], [0, 360]);

  const opacity = interpolate(
    frame,
    [0, fps * 2, fps * 5, fps * 8],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0e27",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 800,
          height: 600,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Animated GIF placeholder visualization */}
        <div
          style={{
            position: "relative",
            width: 300,
            height: 300,
            backgroundColor: "#1a1f3a",
            borderRadius: 20,
            border: "3px solid #00d9ff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transform: `scale(${scale}) rotate(${rotation}deg)`,
            opacity: opacity,
            boxShadow: "0 0 30px rgba(0, 217, 255, 0.3)",
          }}
        >
          {/* Simulated animated content */}
          <div
            style={{
              fontSize: 80,
              fontWeight: "bold",
              color: "#00d9ff",
              animation: "float 3s ease-in-out infinite",
              textShadow: "0 0 20px rgba(0, 217, 255, 0.5)",
            }}
          >
            GIF
          </div>
        </div>

        {/* Info text */}
        <div
          style={{
            marginTop: 60,
            fontSize: 24,
            color: "#00ff88",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          GIF Playback Capabilities
        </div>

        <div
          style={{
            marginTop: 20,
            fontSize: 16,
            color: "#888",
            textAlign: "center",
            maxWidth: 600,
          }}
        >
          @remotion/gif provides seamless GIF integration and playback in your videos
        </div>

        {/* Frame indicators */}
        <div
          style={{
            marginTop: 40,
            display: "flex",
            gap: 10,
          }}
        >
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                backgroundColor:
                  i * 30 < frame % 300 ? "#00d9ff" : "#444",
                opacity: 0.7,
              }}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 0,
          right: 0,
          textAlign: "center",
          color: "#00d9ff",
          fontSize: 24,
          fontWeight: "bold",
        }}
      >
        GIF Demo - @remotion/gif
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </AbsoluteFill>
  );
};
