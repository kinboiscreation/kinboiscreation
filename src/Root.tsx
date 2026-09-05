import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";

export const Main: React.FC = () => {
  const { durationInFrames, fps, width, height } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0e27",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 100,
        fontWeight: "bold",
        color: "#00d9ff",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          textAlign: "center",
        }}
      >
        <h1>Remotion Complete Setup</h1>
        <p
          style={{
            fontSize: 32,
            marginTop: 20,
            color: "#00d9ff",
          }}
        >
          All Official Packages Included
        </p>
        <div
          style={{
            marginTop: 40,
            fontSize: 20,
            color: "#888",
            lineHeight: "1.8",
          }}
        >
          <p>✓ @remotion/shapes</p>
          <p>✓ @remotion/paths</p>
          <p>✓ @remotion/transitions</p>
          <p>✓ @remotion/captions</p>
          <p>✓ @remotion/gif</p>
          <p>✓ @remotion/media-utils</p>
          <p>✓ @remotion/tailwind</p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
