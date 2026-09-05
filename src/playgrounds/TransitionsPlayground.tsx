import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import {
  linearTiming,
  TransitionSeries,
} from "@remotion/transitions";

const Slide: React.FC<{ color: string; text: string; number: number }> = ({
  color,
  text,
  number,
}) => (
  <AbsoluteFill
    style={{
      backgroundColor: color,
      justifyContent: "center",
      alignItems: "center",
      fontSize: 80,
      fontWeight: "bold",
      color: "white",
      flexDirection: "column",
      gap: 40,
    }}
  >
    <div style={{ fontSize: 120 }}>{number}</div>
    <div>{text}</div>
  </AbsoluteFill>
);

export const TransitionsPlayground: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0e27",
      }}
    >
      <TransitionSeries>
        <TransitionSeries.Sequence
          durationInFrames={90}
          from={<Slide color="#00d9ff" text="Fade" number={1} />}
          transition={{
            type: "fade",
            timing: linearTiming({ durationInFrames: 30 }),
          }}
        />

        <TransitionSeries.Sequence
          durationInFrames={90}
          from={<Slide color="#ff00d9" text="Slide" number={2} />}
          transition={{
            type: "slide",
            timing: linearTiming({ durationInFrames: 30 }),
          }}
        />

        <TransitionSeries.Sequence
          durationInFrames={90}
          from={<Slide color="#00ff88" text="Wipe Left" number={3} />}
          transition={{
            type: "wipe-left",
            timing: linearTiming({ durationInFrames: 30 }),
          }}
        />

        <TransitionSeries.Sequence
          durationInFrames={90}
          from={<Slide color="#ffaa00" text="Zoom" number={4} />}
          transition={{
            type: "fade",
            timing: linearTiming({ durationInFrames: 30 }),
          }}
        />
      </TransitionSeries>

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
          zIndex: 100,
        }}
      >
        @remotion/transitions Playground
      </div>
    </AbsoluteFill>
  );
};
