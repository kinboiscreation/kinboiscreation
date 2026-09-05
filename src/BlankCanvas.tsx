import React from "react";
import { AbsoluteFill } from "remotion";

export const BlankCanvas: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
          color: "#00d9ff",
          fontSize: 64,
          fontWeight: "bold",
          fontFamily: "monospace",
        }}
      >
        <h1>Blank Canvas Ready</h1>
        <p style={{ fontSize: 32, marginTop: 20, color: "#888" }}>
          Start creating with Remotion
        </p>
        <div style={{ marginTop: 60, fontSize: 20, color: "#666" }}>
          <p>Resolution: 1920x1080</p>
          <p>FPS: 30</p>
          <p>Duration: 10 seconds</p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
