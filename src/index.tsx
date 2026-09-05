import React from "react";
import { Composition } from "remotion";
import { Main } from "./Root";
import { ShapesDemo } from "./compositions/ShapesDemo";
import { PathsDemo } from "./compositions/PathsDemo";
import { TransitionsDemo } from "./compositions/TransitionsDemo";
import { CaptionsDemo } from "./compositions/CaptionsDemo";
import { GifDemo } from "./compositions/GifDemo";
import { MediaUtilsDemo } from "./compositions/MediaUtilsDemo";
import { TailwindDemo } from "./compositions/TailwindDemo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Main"
        component={Main}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="ShapesDemo"
        component={ShapesDemo}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="PathsDemo"
        component={PathsDemo}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="TransitionsDemo"
        component={TransitionsDemo}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="CaptionsDemo"
        component={CaptionsDemo}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="GifDemo"
        component={GifDemo}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="MediaUtilsDemo"
        component={MediaUtilsDemo}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="TailwindDemo"
        component={TailwindDemo}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
