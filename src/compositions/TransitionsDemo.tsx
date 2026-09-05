import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import {
  linearTiming,
  sequenceElement,
  TransitionSeries,
  fade,
  slide,
  wipeLeft,
} from "@remotion/transitions";

const Slide: React.FC<{ color: string; text: string }> = ({
  color,
  text,
}) => (
  <AbsoluteFill
    style={{
      backgroundColor: color,
      justifyContent: "center",
      alignItems: "center",
      fontSize: 60,
      fontWeight: "bold",
      color: "white",
    }}
  >
    {text}
  </AbsoluteFill>
);

export const TransitionsDemo: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0e27",
      }}
    >
      <TransitionSeries>
        <TransitionSeries.Sequence
          durationInFrames={90}
          from={<Slide color="#00d9ff" text="Fade Transition" />}
          transition={{
            type: "fade",
            timing: linearTiming({ durationInFrames: 30 }),
          }}
        />
        <TransitionSeries.Sequence
          durationInFrames={90}
          from={<Slide color="#ff00d9" text="Slide Transition" />}
          transition={{
            type: "slide",
            timing: linearTiming({ durationInFrames: 30 }),
          }}
        />
        <TransitionSeries.Sequence
          durationInFrames={90}
          from={<Slide color="#00ff88" text="Wipe Left" />}
          transition={{
            type: "wipe-left",
            timing: linearTiming({ durationInFrames: 30 }),
          }}
        />
      </TransitionSeries>

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
          zIndex: 100,
        }}
      >
        Transitions Demo - @remotion/transitions
      </div>
    </AbsoluteFill>
  );
};
