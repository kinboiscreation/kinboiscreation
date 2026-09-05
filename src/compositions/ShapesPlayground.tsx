import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Circle, Polygon, Star, Rect } from "@remotion/shapes";

export const ShapesPlayground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rotation = interpolate(frame, [0, fps * 10], [0, 360]);
  const scale = interpolate(frame, [0, fps * 5], [0.5, 1.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0e27", justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "relative", width: 1200, height: 800, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 80, alignContent: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div style={{ transform: `rotate(${rotation}deg) scale(${scale})` }}>
            <Circle radius={80} fill="#00d9ff" />
          </div>
          <span style={{ color: "#00d9ff", fontSize: 18 }}>Circle</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div style={{ transform: `rotate(${rotation}deg) scale(${scale})` }}>
            <Star points={5} radius={80} fill="#ff00d9" />
          </div>
          <span style={{ color: "#ff00d9", fontSize: 18 }}>Star</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div style={{ transform: `rotate(${rotation}deg) scale(${scale})` }}>
            <Polygon sides={6} radius={80} fill="#00ff88" />
          </div>
          <span style={{ color: "#00ff88", fontSize: 18 }}>Hexagon</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div style={{ transform: `rotate(${rotation}deg) scale(${scale})` }}>
            <Rect width={160} height={100} fill="#ffaa00" cornerRadius={15} />
          </div>
          <span style={{ color: "#ffaa00", fontSize: 18 }}>Rectangle</span>
        </div>
      </div>

      <div style={{ position: "absolute", top: 40, left: 0, right: 0, textAlign: "center", color: "#00d9ff", fontSize: 36, fontWeight: "bold" }}>
        @remotion/shapes Playground
      </div>
    </AbsoluteFill>
  );
};
