# Quick Start Guide - MYRTILLE & ABRICOT

Get the animation running in 3 minutes!

## 1. Install Dependencies

```bash
npm install
```

## 2. Preview in Studio

```bash
npm start
```

Opens at `http://localhost:3000` - you can:
- Play/pause the animation
- Scrub through scenes
- Adjust playback speed
- Preview at different resolutions

## 3. Render Video

```bash
npm run render
```

Creates `output.mp4` (a few minutes, depending on your CPU)

---

## What You'll See

A 40-second animation showing two fruit characters (Myrtille and Abricot) in an emotional journey:

🫐 **Myrtille** (dark blue) - Initially angry and frustrated
🟠 **Abricot** (orange) - Calm, wise, and supportive

The animation shows how understanding emotions (rather than fighting them) leads to genuine self-control.

## Scene Preview

| Time | Scene | Mood |
|------|-------|------|
| 0-5s | Frustrated Morning | Angry, unstable |
| 5-10s | Calm Observation | Peaceful intro |
| 10-15s | Explosion | Peak anger |
| 15-20s | Wisdom | Realization |
| 20-25s | Struggle | Contemplation |
| 25-30s | Transformation | Awakening |
| 30-35s | Understanding | Connection |
| 35-40s | Resolution | Growth |

## Customization

### Edit Colors
Open `src/config.ts` and modify `COLORS` object

### Edit Text
Open any scene file in `src/scenes/` and change the `<div>` text content

### Change Timing
Edit `SCENE_TIMING` in `src/config.ts` (each frame = 1/30th second)

### Add Images
Place character images in `public/characters/` and import in scenes

## Advanced Options

### Render with Custom Quality
```bash
remotion render src/index.tsx MyrtilleAbricot output.mp4 --quality=high
```

### Render a Specific Scene
Edit `remotion.config.ts`:
```typescript
Config.setFrameRange([0, 300]); // Only Scene 1 & 2
```

### Render Different Format
```bash
remotion render src/index.tsx MyrtilleAbricot output.webm --codec=webm
```

## Keyboard Shortcuts in Studio

| Key | Action |
|-----|--------|
| Space | Play/Pause |
| ← → | Scrub frames |
| + - | Zoom |
| F | Fullscreen |

## Troubleshooting

**Studio won't start?**
```bash
npm install
npm start
```

**Rendering too slow?**
Add concurrency:
```bash
remotion render src/index.tsx MyrtilleAbricot output.mp4 --concurrency=4
```

**Video quality poor?**
Increase quality:
```bash
remotion render src/index.tsx MyrtilleAbricot output.mp4 --quality=100
```

---

## Next Steps

1. ✅ Install and preview
2. 📝 Customize scenes with your own images/text
3. 🎵 Add audio/music tracks
4. 🎬 Render final video
5. 📤 Share on social media!

Need help? Check `REMOTION_README.md` for full documentation.
