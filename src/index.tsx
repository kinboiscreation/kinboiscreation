import React from "react";
import { Composition } from "remotion";
import { BlankCanvas } from "./BlankCanvas";
import { ShapesPlayground } from "./playgrounds/ShapesPlayground";
import { PathsPlayground } from "./playgrounds/PathsPlayground";
import { TransitionsPlayground } from "./playgrounds/TransitionsPlayground";
import { MediaPlayground } from "./playgrounds/MediaPlayground";
import { NoisePlayground } from "./playgrounds/NoisePlayground";
import { ThreePlayground } from "./playgrounds/ThreePlayground";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Main Blank Canvas */}
      <Composition
        id="BlankCanvas"
        component={BlankCanvas}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Package Playgrounds */}
      <Composition
        id="ShapesPlayground"
        component={ShapesPlayground}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="PathsPlayground"
        component={PathsPlayground}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="TransitionsPlayground"
        component={TransitionsPlayground}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="MediaPlayground"
        component={MediaPlayground}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="NoisePlayground"
        component={NoisePlayground}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="ThreePlayground"
        component={ThreePlayground}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
