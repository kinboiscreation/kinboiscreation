import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { MotionPath } from "@remotion/paths";

export const PathsDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pathProgress = interpolate(frame, [0, fps * 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const svgPath = "M 200 100 Q 400 50 600 100 T 900 100";

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
          width: 1000,
          height: 600,
        }}
      >
        <svg
          width={1000}
          height={600}
          style={{
            overflow: "visible",
          }}
        >
          {/* Background path */}
          <path
            d={svgPath}
            stroke="#00d9ff"
            strokeWidth={2}
            fill="none"
            opacity={0.3}
          />

          {/* Animated path */}
          <path
            d={svgPath}
            stroke="#00ff88"
            strokeWidth={4}
            fill="none"
            strokeDasharray={500}
            strokeDashoffset={interpolate(pathProgress, [0, 1], [500, 0])}
          />

          {/* Moving circle along path */}
          <circle
            cx={interpolate(frame, [0, fps * 8], [200, 900], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
            cy={interpolate(frame, [0, fps * 4], [100, 50], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
            r={15}
            fill="#ff00d9"
          />

          {/* Wavy lines */}
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M 100 ${150 + i * 80} Q 300 ${130 + i * 80} 500 ${150 + i * 80} T 900 ${150 + i * 80}`}
              stroke="#ffaa00"
              strokeWidth={2}
              fill="none"
              opacity={0.5 + (i * 0.2)}
            />
          ))}
        </svg>
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
        Paths Demo - @remotion/paths
      </div>
    </AbsoluteFill>
  );
};
