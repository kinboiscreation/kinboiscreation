import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const PathsPlayground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pathProgress = interpolate(frame, [0, fps * 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const circleX = interpolate(frame, [0, fps * 10], [200, 1700], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0e27",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <svg
        width={1920}
        height={1080}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {/* Cubic Bezier Path */}
        <path
          d="M 200 300 Q 600 100 1000 300 T 1800 300"
          stroke="#00d9ff"
          strokeWidth={2}
          fill="none"
          opacity={0.3}
        />

        {/* Animated path stroke */}
        <path
          d="M 200 300 Q 600 100 1000 300 T 1800 300"
          stroke="#00ff88"
          strokeWidth={4}
          fill="none"
          strokeDasharray={1800}
          strokeDashoffset={interpolate(pathProgress, [0, 1], [1800, 0])}
        />

        {/* Moving circle along path */}
        <circle cx={circleX} cy={300} r={20} fill="#ff00d9" />

        {/* Wave patterns */}
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M 200 ${500 + i * 100} Q 400 ${480 + i * 100} 600 ${500 + i * 100} T 1000 ${500 + i * 100} T 1400 ${500 + i * 100} T 1800 ${500 + i * 100}`}
            stroke="#ffaa00"
            strokeWidth={2}
            fill="none"
            opacity={0.5}
          />
        ))}

        {/* Spiral-like pattern */}
        {[...Array(8)].map((_, i) => {
          const angle = (i * Math.PI * 2) / 8;
          const radius = 150 + interpolate(frame, [0, fps * 10], [0, 100]);
          const cx = 960;
          const cy = 800;
          const x = cx + radius * Math.cos(angle);
          const y = cy + radius * Math.sin(angle);

          return (
            <circle
              key={`spiral-${i}`}
              cx={x}
              cy={y}
              r={8}
              fill="#00d9ff"
              opacity={0.6}
            />
          );
        })}
      </svg>

      <div
        style={{
          position: "absolute",
          top: 40,
          left: 0,
          right: 0,
          textAlign: "center",
          color: "#00d9ff",
          fontSize: 36,
          fontWeight: "bold",
        }}
      >
        @remotion/paths Playground
      </div>
    </AbsoluteFill>
  );
};
