import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const ThreePlayground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const gridOpacity = interpolate(frame, [0, fps * 5], [0, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0e27", justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "relative", width: 1200, height: 700, backgroundColor: "rgba(26, 31, 58, 0.5)", border: "2px solid #00d9ff", borderRadius: 15, display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
        <svg style={{ position: "absolute", width: "100%", height: "100%", opacity: gridOpacity }}>
          {[...Array(20)].map((_, i) => (
            <line key={`v-${i}`} x1={`${(i + 1) * 5}%`} y1="0" x2={`${(i + 1) * 5}%`} y2="100%" stroke="#00d9ff" strokeWidth={1} opacity={0.2} />
          ))}
          {[...Array(14)].map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={`${(i + 1) * 7.14}%`} x2="100%" y2={`${(i + 1) * 7.14}%`} stroke="#00d9ff" strokeWidth={1} opacity={0.2} />
          ))}
        </svg>

        <div style={{ position: "relative", width: 200, height: 200, transformStyle: "preserve-3d", transform: `rotateX(${interpolate(frame, [0, fps * 10], [0, 360])}deg) rotateY(${interpolate(frame, [0, fps * 8], [0, 360])}deg)` }}>
          {[{ face: "front", color: "#00d9ff", transform: "translateZ(100px)" }, { face: "back", color: "#ff00d9", transform: "rotateY(180deg) translateZ(100px)" }, { face: "right", color: "#00ff88", transform: "rotateY(90deg) translateZ(100px)" }, { face: "left", color: "#ffaa00", transform: "rotateY(-90deg) translateZ(100px)" }].map((side) => (
            <div key={side.face} style={{ position: "absolute", width: "100%", height: "100%", backgroundColor: side.color, opacity: 0.8, border: "2px solid #fff", display: "flex", justifyContent: "center", alignItems: "center", fontSize: 20, fontWeight: "bold", color: "#000", transform: side.transform }} >
              {side.face}
            </div>
          ))}
        </div>

        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2 + frame / fps;
          const radius = 250;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <div key={`particle-${i}`} style={{ position: "absolute", left: "50%", top: "50%", width: 20, height: 20, borderRadius: "50%", backgroundColor: ["#00d9ff", "#ff00d9", "#00ff88", "#ffaa00"][i % 4], transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`, boxShadow: `0 0 15px ${["#00d9ff", "#ff00d9", "#00ff88", "#ffaa00"][i % 4]}` }} />
          );
        })}
      </div>

      <div style={{ position: "absolute", bottom: 40, left: 0, right: 0, textAlign: "center", color: "#00d9ff", fontSize: 28, fontWeight: "bold" }}>
        @remotion/three Playground - 3D Graphics
      </div>

      <div style={{ position: "absolute", top: 40, left: 0, right: 0, textAlign: "center", color: "#00d9ff", fontSize: 36, fontWeight: "bold" }}>
        Three.js Integration
      </div>
    </AbsoluteFill>
  );
};
