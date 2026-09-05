import React from 'react';
import { useVideoConfig, Sequence, Easing, interpolate, useCurrentFrame } from 'remotion';
import { Scene1 } from './scenes/Scene1';
import { Scene2 } from './scenes/Scene2';
import { Scene3 } from './scenes/Scene3';
import { Scene4 } from './scenes/Scene4';
import { Scene5 } from './scenes/Scene5';
import { Scene6 } from './scenes/Scene6';
import { Scene7 } from './scenes/Scene7';
import { Scene8 } from './scenes/Scene8';
import { SCENE_TIMING } from './config';

export const MyrtilleAbricot: React.FC = () => {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Scene 1: Myrtille's Frustrated Morning */}
      <Sequence from={SCENE_TIMING.scene1.start} durationInFrames={SCENE_TIMING.scene1.duration}>
        <Scene1 />
      </Sequence>

      {/* Scene 2: Abricot's Calm Observation */}
      <Sequence from={SCENE_TIMING.scene2.start} durationInFrames={SCENE_TIMING.scene2.duration}>
        <Scene2 />
      </Sequence>

      {/* Scene 3: Myrtille's Outburst */}
      <Sequence from={SCENE_TIMING.scene3.start} durationInFrames={SCENE_TIMING.scene3.duration}>
        <Scene3 />
      </Sequence>

      {/* Scene 4: Abricot's Wisdom Intervention */}
      <Sequence from={SCENE_TIMING.scene4.start} durationInFrames={SCENE_TIMING.scene4.duration}>
        <Scene4 />
      </Sequence>

      {/* Scene 5: Myrtille's Internal Struggle */}
      <Sequence from={SCENE_TIMING.scene5.start} durationInFrames={SCENE_TIMING.scene5.duration}>
        <Scene5 />
      </Sequence>

      {/* Scene 6: Transformation Moment */}
      <Sequence from={SCENE_TIMING.scene6.start} durationInFrames={SCENE_TIMING.scene6.duration}>
        <Scene6 />
      </Sequence>

      {/* Scene 7: New Understanding */}
      <Sequence from={SCENE_TIMING.scene7.start} durationInFrames={SCENE_TIMING.scene7.duration}>
        <Scene7 />
      </Sequence>

      {/* Scene 8: Resolution and Connection */}
      <Sequence from={SCENE_TIMING.scene8.start} durationInFrames={SCENE_TIMING.scene8.duration}>
        <Scene8 />
      </Sequence>
    </div>
  );
};
