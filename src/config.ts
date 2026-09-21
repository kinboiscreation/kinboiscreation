export const FRAME_RATE = 30;
export const DURATION_SECONDS = 40;
export const DURATION_IN_FRAMES = DURATION_SECONDS * FRAME_RATE; // 1200 frames

export const SCENE_TIMING = {
  scene1: { start: 0, duration: 150 }, // 0-5 seconds
  scene2: { start: 150, duration: 150 }, // 5-10 seconds
  scene3: { start: 300, duration: 150 }, // 10-15 seconds
  scene4: { start: 450, duration: 150 }, // 15-20 seconds
  scene5: { start: 600, duration: 150 }, // 20-25 seconds
  scene6: { start: 750, duration: 150 }, // 25-30 seconds
  scene7: { start: 900, duration: 150 }, // 30-35 seconds
  scene8: { start: 1050, duration: 150 }, // 35-40 seconds
};

export const COLORS = {
  myrtille: '#1a1a3a', // Deep blue
  abricot: '#ff8c42', // Orange
  background: '#f5f5f5',
  kitchen: '#fffacd',
};
