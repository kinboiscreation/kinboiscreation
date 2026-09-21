import React from 'react';
import { Audio, Sequence } from 'remotion';
import { SCENE_TIMING } from '../config';

export const AudioLayer: React.FC = () => {
  return (
    <>
      {/* Scene 4: Abricot's wisdom line */}
      <Sequence from={SCENE_TIMING.scene4.start} durationInFrames={SCENE_TIMING.scene4.duration}>
        <Audio src="/audio/wisdom-line.mp3" />
      </Sequence>

      {/* Scene 6: Myrtille's realization */}
      <Sequence from={SCENE_TIMING.scene6.start} durationInFrames={SCENE_TIMING.scene6.duration}>
        <Audio src="/audio/realization-line.mp3" />
      </Sequence>

      {/* Scene 7: Understanding message */}
      <Sequence from={SCENE_TIMING.scene7.start} durationInFrames={SCENE_TIMING.scene7.duration}>
        <Audio src="/audio/understanding-line.mp3" />
      </Sequence>

      {/* Scene 8: Final resolution */}
      <Sequence from={SCENE_TIMING.scene8.start} durationInFrames={SCENE_TIMING.scene8.duration}>
        <Audio src="/audio/resolution-line.mp3" />
      </Sequence>

      {/* Background music throughout entire video */}
      <Audio src="/audio/background-music.mp3" volume={0.3} />
    </>
  );
};
