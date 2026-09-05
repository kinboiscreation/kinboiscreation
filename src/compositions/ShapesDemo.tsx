import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Circle, Polygon, Star, Rect } from "@remotion/shapes";

export const ShapesDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rotation = interpolate(frame, [0, fps * 10], [0, 360]);
  const scale = interpolate(frame, [0, fps * 5], [0.5, 1.5], {
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
      <div
        style={{
          position: "relative",
          width: 800,
          height: 600,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Circle */}
        <div
          style={{
            position: "absolute",
            left: 100,
            top: 100,
            transform: `rotate(${rotation}deg) scale(${scale})`,
          }}
        >
          <Circle radius={60} fill="#00d9ff" />
        </div>

        {/* Star */}
        <div
          style={{
            position: "absolute",
            right: 100,
            top: 100,
            transform: `rotate(${rotation}deg) scale(${scale})`,
          }}
        >
          <Star points={5} radius={60} fill="#ff00d9" />
        </div>

        {/* Polygon */}
        <div
          style={{
            position: "absolute",
            left: 100,
            bottom: 100,
            transform: `rotate(${rotation}deg) scale(${scale})`,
          }}
        >
          <Polygon sides={6} radius={60} fill="#00ff88" />
        </div>

        {/* Rectangle */}
        <div
          style={{
            position: "absolute",
            right: 100,
            bottom: 100,
            transform: `rotate(${rotation}deg) scale(${scale})`,
          }}
        >
          <Rect width={120} height={80} fill="#ffaa00" cornerRadius={10} />
        </div>

        {/* Center Circle */}
        <div
          style={{
            transform: `scale(${1 + interpolate(frame, [0, fps * 10], [0, 0.3])})`,
          }}
        >
          <Circle
            radius={40}
            fill="#00d9ff"
            opacity={interpolate(frame, [0, fps * 10], [1, 0])}
          />
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
        Shapes Demo - @remotion/shapes
      </div>
    </AbsoluteFill>
  );
};
