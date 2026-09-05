import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { noise2D, noise3D } from "@remotion/noise";

export const NoisePlayground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = interpolate(frame, [0, fps * 10], [0.005, 0.05], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const time = frame / fps;

  const noiseGrid = useMemo(() => {
    const resolution = 40;
    const grid = [];
    for (let y = 0; y < resolution; y++) {
      for (let x = 0; x < resolution; x++) {
        const n2 = noise2D("seed", x * scale, y * scale);
        const n3 = noise3D("seed", x * scale, y * scale, time * 0.3);
        const combined = (n2 + n3) / 2;
        grid.push({ x, y, noise: combined });
      }
    }
    return grid;
  }, [scale, time]);

  const cellSize = 1920 / 40;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0e27", justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "relative", width: 1920, height: 800, overflow: "hidden" }}>
        {noiseGrid.map((cell, idx) => {
          const hue = ((cell.noise + 1) / 2) * 360;
          const brightness = ((cell.noise + 1) / 2) * 100;
          return (
            <div key={idx} style={{ position: "absolute", left: cell.x * cellSize, top: cell.y * cellSize, width: cellSize, height: cellSize, backgroundColor: `hsl(${hue}, 100%, ${brightness * 0.5}%)`, opacity: Math.abs(cell.noise) }} />
          );
        })}

        {[...Array(20)].map((_, i) => {
          const x = (noise2D(`particle-${i}`, time * 0.5, i) + 1) / 2;
          const y = (noise3D(`particle-${i}`, time * 0.3, i * 0.5, time * 0.2) + 1) / 2;
          return (
            <div key={`particle-${i}`} style={{ position: "absolute", left: `${x * 100}%`, top: `${y * 100}%`, width: 20, height: 20, backgroundColor: "#00d9ff", borderRadius: "50%", opacity: 0.6, boxShadow: "0 0 20px rgba(0, 217, 255, 0.8)" }} />
          );
        })}
      </div>

      <div style={{ position: "absolute", top: 40, left: 0, right: 0, textAlign: "center", color: "#00d9ff", fontSize: 36, fontWeight: "bold" }}>
        @remotion/noise Playground - Perlin Noise
      </div>
    </AbsoluteFill>
  );
};
