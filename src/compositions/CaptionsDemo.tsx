import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Caption } from "@remotion/captions";

export const CaptionsDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textOpacity = interpolate(
    frame % (fps * 4),
    [0, fps, fps * 2, fps * 3],
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
          width: 1000,
          height: 600,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* Main caption */}
        <div
          style={{
            fontSize: 48,
            fontWeight: "bold",
            color: "#00d9ff",
            marginBottom: 40,
            opacity: textOpacity,
            textShadow: "0 0 20px rgba(0, 217, 255, 0.5)",
          }}
        >
          Caption Demonstrations
        </div>

        {/* Cycling captions */}
        <div
          style={{
            fontSize: 32,
            color: "#00ff88",
            opacity: interpolate(
              frame % (fps * 3),
              [0, fps * 0.5, fps * 2.5, fps * 3],
              [0, 1, 1, 0]
            ),
          }}
        >
          This is Caption 1
        </div>

        {frame >= fps * 3 && (
          <div
            style={{
              fontSize: 32,
              color: "#ff00d9",
              opacity: interpolate(
                (frame - fps * 3) % (fps * 3),
                [0, fps * 0.5, fps * 2.5, fps * 3],
                [0, 1, 1, 0]
              ),
            }}
          >
            This is Caption 2
          </div>
        )}

        {frame >= fps * 6 && (
          <div
            style={{
              fontSize: 32,
              color: "#ffaa00",
              opacity: interpolate(
                (frame - fps * 6) % (fps * 3),
                [0, fps * 0.5, fps * 2.5, fps * 3],
                [0, 1, 1, 0]
              ),
            }}
          >
            This is Caption 3
          </div>
        )}

        {/* Subtitle area */}
        <div
          style={{
            marginTop: 60,
            fontSize: 20,
            color: "#888",
            fontStyle: "italic",
          }}
        >
          Subtitles and text overlays for better engagement
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
        Captions Demo - @remotion/captions
      </div>
    </AbsoluteFill>
  );
};
