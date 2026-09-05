import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const MediaUtilsDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Simulate waveform visualization
  const waveforms = [...Array(50)].map((_, i) => {
    const phase = (frame / fps) * 2 * Math.PI;
    return Math.sin(phase + (i * Math.PI) / 10) * 0.5 + 0.5;
  });

  const duration = "00:10.00";
  const currentTime = interpolate(frame, [0, fps * 10], [0, 10], {
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
          width: 1000,
          height: 600,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Waveform visualization */}
        <div
          style={{
            width: 800,
            height: 200,
            backgroundColor: "#1a1f3a",
            borderRadius: 10,
            padding: 20,
            border: "2px solid #00d9ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            marginBottom: 40,
          }}
        >
          {waveforms.map((height, i) => (
            <div
              key={i}
              style={{
                width: 12,
                height: Math.max(20, height * 140),
                backgroundColor: "#00ff88",
                borderRadius: 2,
                opacity: 0.7 + (height * 0.3),
              }}
            />
          ))}
        </div>

        {/* Timeline controls */}
        <div
          style={{
            width: 800,
            backgroundColor: "#1a1f3a",
            borderRadius: 10,
            padding: 20,
            border: "2px solid #00d9ff",
          }}
        >
          {/* Progress bar */}
          <div
            style={{
              width: "100%",
              height: 6,
              backgroundColor: "#444",
              borderRadius: 3,
              marginBottom: 15,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${(currentTime / 10) * 100}%`,
                height: "100%",
                backgroundColor: "#00ff88",
              }}
            />
          </div>

          {/* Time display */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 14,
              color: "#888",
            }}
          >
            <span>{Math.floor(currentTime)}.{Math.floor((currentTime % 1) * 100).toString().padStart(2, "0")}</span>
            <span>{duration}</span>
          </div>
        </div>

        {/* Info */}
        <div
          style={{
            marginTop: 40,
            fontSize: 24,
            color: "#00ff88",
            fontWeight: "bold",
          }}
        >
          Media Utilities
        </div>

        <div
          style={{
            marginTop: 10,
            fontSize: 16,
            color: "#888",
          }}
        >
          Audio visualization, timing, and media handling
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
        Media Utils Demo - @remotion/media-utils
      </div>
    </AbsoluteFill>
  );
};
