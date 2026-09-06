# MYRTILLE & ABRICOT - Remotion Animation Project

A 40-second cinematic short film about emotional self-control and personal growth, built with Remotion (React-based video creation framework).

## Project Structure

```
src/
├── index.tsx              # Entry point for Remotion
├── Root.tsx              # Main composition orchestrator
├── MyrtilleAbricot.tsx   # Main video component with all scenes
├── config.ts             # Timing configuration and constants
└── scenes/
    ├── Scene1.tsx        # Myrtille's frustrated morning
    ├── Scene2.tsx        # Abricot's calm observation
    ├── Scene3.tsx        # Myrtille's outburst
    ├── Scene4.tsx        # Abricot's wisdom intervention
    ├── Scene5.tsx        # Myrtille's internal struggle
    ├── Scene6.tsx        # Transformation moment
    ├── Scene7.tsx        # New understanding
    └── Scene8.tsx        # Resolution and connection
```

## Story Overview

**MYRTILLE & ABRICOT** follows two anthropomorphic fruit characters navigating emotional intelligence:

- **MYRTILLE** (Dark Blue Blueberry): Struggles with anger and emotional control
- **ABRICOT** (Orange Apricot): Embodies wisdom, calmness, and understanding

The film explores how recognizing and understanding our emotions, rather than suppressing them, leads to genuine self-control and growth.

## Scene Breakdown

### Scene 1: Frustrated Morning (0-5s)
- Myrtille appears in a kitchen setting
- Unstable camera shake reflects frustration
- Context: Morning difficulties trigger anger response

### Scene 2: Calm Observation (5-10s)
- Abricot enters with peaceful presence
- Myrtille faded in background
- Abricot's wisdom begins to influence the situation

### Scene 3: Explosion of Anger (10-15s)
- Myrtille's emotions peak
- Intense visual effects (shake, particles, color intensity)
- Abricot nearly invisible in background
- Text: "EXPLOSION DE COLÈRE!"

### Scene 4: Wisdom Intervention (15-20s)
- Abricot steps forward with knowing expression
- Myrtille begins to calm down
- Wisdom message: "La colère est un signal, pas une fin..."
- Transition begins

### Scene 5: Internal Struggle (20-25s)
- Myrtille contemplates the situation
- Gentle rotation shows internal conflict
- Thought particles float around character
- Abricot supportively present but faded

### Scene 6: Transformation Moment (25-30s)
- Light burst effect and golden glow
- Myrtille's color shifts toward calmer hues
- Expression transforms from frown to slight smile
- Realization text: "Je peux choisir comment répondre..."

### Scene 7: New Understanding (30-35s)
- Both characters approach each other
- Connection line appears between them
- Myrtille genuinely smiles
- Message: "La colère n'est que le début du dialogue avec soi-même."

### Scene 8: Resolution and Connection (35-40s)
- Both characters at ease, peaceful
- Soft glow and connection particles
- Final message: "L'automaîtrise commence par la compréhension et l'acceptation."
- Title and subtitle fade in

## Technical Details

### Video Specifications
- **Duration**: 40 seconds
- **Frame Rate**: 30 FPS
- **Resolution**: 1920x1080 (Full HD)
- **Total Frames**: 1,200
- **Codec**: H.264
- **Image Format**: PNG

### Character Design
- Circular geometric shapes with emotional expressions
- Eyes and mouth animations convey emotions
- Color shifts and effects reflect emotional states
- Glow effects indicate transformation and connection

### Animation Techniques
- **Camera Effects**: Shake, zoom, and positioning
- **Particle Systems**: Emotional expressions (anger particles, thought clouds)
- **Color Transitions**: Character color evolution
- **Opacity Transitions**: Character appearance and fading
- **Scale Animations**: Size changes reflecting emotion intensity
- **Text Overlays**: Scene descriptions and dialogue

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
npm install
```

This installs Remotion, React, and all required dependencies.

### Development

Start the Remotion Studio for interactive preview and editing:

```bash
npm start
```

This opens Remotion Studio at `http://localhost:3000` where you can:
- Preview the animation in real-time
- Adjust timing and parameters
- Test different scenes
- Preview at various playback speeds

### Rendering

Render the complete video to MP4:

```bash
npm run render
```

The output video will be saved as `output.mp4` in the project root.

### Advanced Rendering

For custom rendering options:

```bash
remotion render src/index.tsx MyrtilleAbricot output.mp4 --quality=high --concurrency=4
```

## Configuration

Edit `remotion.config.ts` to customize:
- Codec (h264, h265, png-sequence, webm)
- CRF (quality level, 0-51, lower = better quality)
- Pixel format (yuv420p, yuv422p, etc.)
- Frame range (render specific scenes or portions)

## Customization

### Modifying Scenes

Each scene is a React component in `src/scenes/`. Modify:
- **Colors**: Change `backgroundColor`, `borderColor` values
- **Timing**: Update `interpolate()` calls and frame ranges
- **Text**: Edit subtitle and message text
- **Animations**: Adjust `interpolate()` parameters
- **Effects**: Add new CSS filters, shadows, or transforms

### Adjusting Timing

Edit `src/config.ts` `SCENE_TIMING` object:
```typescript
scene1: { start: 0, duration: 150 }, // 0-5 seconds (150 frames at 30fps)
```

### Adding Character Images

To replace placeholder circles with generated character images:

1. Place character images in `public/characters/`
2. Import and use in scene components:
```typescript
<img 
  src="/characters/myrtille.png" 
  style={{ width: '280px', height: '300px' }}
/>
```

## Remotion Resources

- **Official Documentation**: https://www.remotion.dev/docs
- **API Reference**: https://www.remotion.dev/docs/api
- **Community**: https://discord.gg/remotion

## Performance Optimization

### For Preview
- Reduce resolution during preview with `--resolution` flag
- Use `--scale` parameter to downscale rendering

### For Final Render
- Use `--concurrency=4` for faster multi-threaded rendering
- Increase `--quality` for better output (default 80)
- Use H.265 codec for better compression (larger file sizes during render)

## Troubleshooting

### Studio Won't Start
```bash
npm install
npm start
```

### Rendering Fails
- Check Node.js version: `node --version` (should be v16+)
- Clear cache: `rm -rf node_modules && npm install`
- Check disk space for temporary files

### Video Quality Issues
- Increase CRF in `remotion.config.ts` (lower CRF = better quality, slower render)
- Use H.265 codec for better compression
- Render at higher concurrency settings

## Project Timeline

| Phase | Status | Description |
|-------|--------|-------------|
| Script Development | ✅ Complete | 40-second cinematic script with detailed technical direction |
| Composition Structure | ✅ Complete | 8-scene Remotion composition with timing |
| Character Assets | 🔄 In Progress | Generated 3D character images to integrate |
| Animation Integration | 📋 Next | Add character images to scenes |
| Sound Design | 📋 Planned | Dialogue and background music |
| Final Rendering | 📋 Planned | Render final video with all effects |

## Next Steps

1. **Integrate Character Images**: Copy generated character images to `public/characters/`
2. **Add Sound Design**: Import audio tracks and use Remotion's `<Audio>` component
3. **Fine-tune Animations**: Preview in Studio and adjust timing/effects
4. **Render Final Video**: Generate MP4 with full quality settings
5. **Export Variations**: Create different versions (with/without subtitles, different aspect ratios)

## Credits

- **Story & Direction**: Emotional self-control narrative
- **Animation Framework**: Remotion 4.0+
- **Framework**: React 19
- **Character Design**: Anthropomorphic fruit characters (Myrtille & Abricot)

---

**Created**: September 2026  
**Framework**: Remotion v4.0.520  
**Status**: Active Development
