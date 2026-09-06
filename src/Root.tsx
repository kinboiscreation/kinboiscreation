import React from 'react';
import { Composition } from 'remotion';
import { MyrtilleAbricot } from './MyrtilleAbricot';
import { FRAME_RATE, DURATION_IN_FRAMES } from './config';

export const Root: React.FC = () => {
  return (
    <Composition
      id="MyrtilleAbricot"
      component={MyrtilleAbricot}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FRAME_RATE}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
  );
};
