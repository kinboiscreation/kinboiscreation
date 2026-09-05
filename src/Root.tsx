import "./index.css";
import React from "react";
import { Composition, CalculateMetadataFunction } from "remotion";
import { BlankCanvas } from "./compositions/BlankCanvas";
import { ShapesPlayground } from "./compositions/ShapesPlayground";
import { PathsPlayground } from "./compositions/PathsPlayground";
import { TransitionsPlayground } from "./compositions/TransitionsPlayground";
import { MediaPlayground } from "./compositions/MediaPlayground";
import { NoisePlayground } from "./compositions/NoisePlayground";
import { ThreePlayground } from "./compositions/ThreePlayground";

type Props = {};

const calculateMetadata: CalculateMetadataFunction<Props> = () => {
  return {};
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Blank Canvas - Starting point */}
      <Composition
        id="BlankCanvas"
        component={BlankCanvas}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={calculateMetadata}
      />

      {/* Shapes Playground */}
      <Composition
        id="ShapesPlayground"
        component={ShapesPlayground}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={calculateMetadata}
      />

      {/* Paths Playground */}
      <Composition
        id="PathsPlayground"
        component={PathsPlayground}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={calculateMetadata}
      />

      {/* Transitions Playground */}
      <Composition
        id="TransitionsPlayground"
        component={TransitionsPlayground}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={calculateMetadata}
      />

      {/* Media Playground */}
      <Composition
        id="MediaPlayground"
        component={MediaPlayground}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={calculateMetadata}
      />

      {/* Noise Playground */}
      <Composition
        id="NoisePlayground"
        component={NoisePlayground}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={calculateMetadata}
      />

      {/* Three Playground */}
      <Composition
        id="ThreePlayground"
        component={ThreePlayground}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={calculateMetadata}
      />
    </>
  );
};
