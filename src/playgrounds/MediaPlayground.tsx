import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const MediaPlayground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Simulated waveform data
  const waveformBars = [...Array(60)].map((_, i) => {
    const phase = (frame / fps) * Math.PI * 2;
    return Math.sin(phase + (i * Math.PI) / 30) * 0.5 + 0.5;
  });

  const progress = interpolate(frame, [0, fps * 10], [0, 1], {
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
          width: 1400,
          height: 700,
          display: "flex",
          flexDirection: "column",
          gap: 60,
          justifyContent: "center",
        }}
      >
        {/* Audio Waveform Visualization */}
        <div>
          <h2
            style={{
              color: "#00d9ff",
              fontSize: 28,
              marginBottom: 20,
            }}
          >
            Audio Waveform (@remotion/media-utils)
          </h2>
          <div
            style={{
              display: "flex",
              gap: 3,
              alignItems: "flex-end",
              height: 150,
              backgroundColor: "#1a1f3a",
              padding: 20,
              borderRadius: 10,
              border: "2px solid #00d9ff",
            }}
          >
            {waveformBars.map((height, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: Math.max(10, height * 120),
                  backgroundColor: "#00ff88",
                  borderRadius: 2,
                  opacity: 0.7 + (height * 0.3),
                }}
              />
            ))}
          </div>
        </div>

        {/* Timeline with Caption */}
        <div>
          <h2
            style={{
              color: "#ff00d9",
              fontSize: 28,
              marginBottom: 20,
            }}
          >
            Media Timeline (@remotion/captions)
          </h2>
          <div
            style={{
              backgroundColor: "#1a1f3a",
              padding: 20,
              borderRadius: 10,
              border: "2px solid #ff00d9",
            }}
          >
            {/* Progress Bar */}
            <div
              style={{
                height: 8,
                backgroundColor: "#333",
                borderRadius: 4,
                marginBottom: 15,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress * 100}%`,
                  backgroundColor: "#00ff88",
                  transition: "width 0.1s linear",
                }}
              />
            </div>

            {/* Time Display */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#888",
                fontSize: 14,
                marginBottom: 15,
              }}
            >
              <span>
                {Math.floor(progress * 10)}.
                {Math.floor((progress * 1000) % 100)
                  .toString()
                  .padStart(2, "0")}
              </span>
              <span>10.00</span>
            </div>

            {/* Caption Text */}
            <div
              style={{
                textAlign: "center",
                color: "#ff00d9",
                fontSize: 20,
                fontWeight: "bold",
                padding: 20,
                backgroundColor: "rgba(255, 0, 217, 0.1)",
                borderRadius: 8,
              }}
            >
              {progress < 0.33 && "🎵 Playing Audio Visualization"}
              {progress >= 0.33 && progress < 0.66 && "📊 Analyzing Frequency"}
              {progress >= 0.66 && "✨ Complete Timeline"}
            </div>
          </div>
        </div>

        {/* GIF Placeholder (@remotion/gif) */}
        <div>
          <h2
            style={{
              color: "#ffaa00",
              fontSize: 28,
              marginBottom: 20,
            }}
          >
            GIF Playback (@remotion/gif)
          </h2>
          <div
            style={{
              display: "flex",
              gap: 15,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: "#1a1f3a",
                  borderRadius: 8,
                  border: "2px solid #ffaa00",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 40,
                  opacity: i === Math.floor((frame / fps) * 4) % 5 ? 1 : 0.3,
                  transition: "opacity 0.2s",
                }}
              >
                {["🎬", "🎥", "📹", "🎞️", "✨"][i]}
              </div>
            ))}
          </div>
        </div>
      </div>

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
        Media Packages Playground
      </div>
    </AbsoluteFill>
  );
};
