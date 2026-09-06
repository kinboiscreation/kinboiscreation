import React from 'react';
import { Composition } from 'remotion';
import { CinematicVersion } from './CinematicVersion';

const FRAME_RATE = 30;
const DURATION_SECONDS = 40;
const DURATION_IN_FRAMES = DURATION_SECONDS * FRAME_RATE; // 1200 frames

export const RootCinematic: React.FC = () => {
  return (
    <Composition
      id="MyrtilleAbricotCinematic"
      component={CinematicVersion}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FRAME_RATE}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
  );
};
