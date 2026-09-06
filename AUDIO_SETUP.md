# Audio Setup Guide - MYRTILLE & ABRICOT

Complete guide for adding voice-over and music to the animation.

## Audio Files Needed

Create or obtain the following audio files and place them in `public/audio/`:

### Dialogue Files

#### 1. **wisdom-line.mp3** (Scene 4, 15-20s)
- **Character**: Abricot
- **Text (French)**: "La colère est un signal, pas une fin..."
- **English**: "Anger is a signal, not an end..."
- **Duration**: ~3-4 seconds
- **Tone**: Calm, wise, reassuring

#### 2. **realization-line.mp3** (Scene 6, 25-30s)
- **Character**: Myrtille (internal monologue)
- **Text (French)**: "Je peux choisir comment répondre..."
- **English**: "I can choose how to respond..."
- **Duration**: ~3-4 seconds
- **Tone**: Thoughtful, hopeful, awakening

#### 3. **understanding-line.mp3** (Scene 7, 30-35s)
- **Character**: Narrator or both characters
- **Text (French)**: "La colère n'est que le début du dialogue avec soi-même."
- **English**: "Anger is just the beginning of dialogue with oneself."
- **Duration**: ~3-4 seconds
- **Tone**: Philosophical, warm, understanding

#### 4. **resolution-line.mp3** (Scene 8, 35-40s)
- **Character**: Narrator
- **Text (French)**: "L'automaîtrise commence par la compréhension et l'acceptation."
- **English**: "Self-control begins with understanding and acceptance."
- **Duration**: ~3-4 seconds
- **Tone**: Conclusive, empowering, resolved

### Background Music

#### 5. **background-music.mp3**
- **Duration**: Full 40 seconds (1200 frames at 30fps)
- **Emotional Arc**:
  - 0-10s: Tense, frustrated (low volume, discordant)
  - 10-20s: Conflict (building tension)
  - 20-30s: Transformation (gradual shift toward harmony)
  - 30-40s: Resolution (peaceful, uplifting)
- **Volume**: 0.3 (30% volume to not overpower dialogue)
- **Style**: Instrumental, emotional, journey-based

## Directory Structure

```
public/
└── audio/
    ├── wisdom-line.mp3           (Scene 4)
    ├── realization-line.mp3      (Scene 6)
    ├── understanding-line.mp3    (Scene 7)
    ├── resolution-line.mp3       (Scene 8)
    └── background-music.mp3      (Full video)
```

## Creating Voice-Over

### Option 1: Use AI Text-to-Speech Services
- **Google Cloud Text-to-Speech**: Natural, multiple languages
- **Azure Speech Services**: Professional quality
- **ElevenLabs**: High-quality, expressive voices
- **Synthesia**: Video + voice combo

### Option 2: Record Your Own
Use Audacity (free) or professional recording software:
1. Record each line separately
2. Use a quiet room
3. Speak clearly with appropriate emotion
4. Export as MP3 (128-192 kbps)

### Option 3: Professional Voice Actor
Hire on Fiverr, Upwork, or local talent for authentic French voice-over.

## Creating Background Music

### Option 1: Royalty-Free Libraries
- **Epidemic Sound**: Professional background tracks
- **Artlist**: High-quality music library
- **YouTube Audio Library**: Free stock music
- **Free Music Archive**: Creative Commons music

### Option 2: AI Music Generation
- **AIVA**: AI music composition
- **Amper Music**: Customizable background tracks
- **Soundraw**: AI-generated music

### Option 3: Professional Composer
Hire a musician to compose an original track matching the emotional arc.

## Emotional Arc for Music

The background music should follow this journey:

```
Scene 1-3 (Frustration)
├─ Tense, discordant
├─ Minor key
├─ Chaotic rhythm

Scene 3-5 (Conflict)
├─ Building tension
├─ Increasing volume
└─ Conflicting harmonies

Scene 5-6 (Transformation)
├─ Gradual shift
├─ Introduction of resolved themes
└─ Harmonic resolution begins

Scene 6-8 (Resolution)
├─ Peaceful, resolved
├─ Major key
├─ Harmonious, uplifting
└─ Ends with hope and acceptance
```

## Audio File Specifications

### Format Requirements
- **Format**: MP3 or WAV
- **Bitrate**: 128-320 kbps (higher = better quality)
- **Sample Rate**: 44.1 kHz or 48 kHz
- **Channels**: Stereo

### Converting Audio Files

Using FFmpeg (free):
```bash
# Convert WAV to MP3
ffmpeg -i input.wav -q:a 4 output.mp3

# Adjust volume
ffmpeg -i input.mp3 -filter:a "volume=0.5" output.mp3

# Trim duration
ffmpeg -i input.mp3 -ss 0 -t 4 output.mp3
```

## Integration in Remotion

The audio is already configured in `src/components/AudioLayer.tsx`:

```typescript
<Audio src="/audio/wisdom-line.mp3" />
<Audio src="/audio/background-music.mp3" volume={0.3} />
```

Simply add your MP3 files to `public/audio/` and they'll be integrated automatically.

## Testing Audio

1. Place audio files in `public/audio/`
2. Run Remotion Studio:
   ```bash
   npm start
   ```
3. Preview the animation - audio should play synchronized with scenes
4. Adjust timing in `src/components/AudioLayer.tsx` if needed

## Troubleshooting

### Audio not playing?
- Check file format (must be MP3 or WAV)
- Verify file path matches: `src="/audio/filename.mp3"`
- Ensure files are in `public/audio/` directory

### Audio out of sync?
- Adjust `from` timing in AudioLayer.tsx
- Use frame numbers: 1 frame = 1/30th second
- Test with Remotion Studio before rendering

### Volume too loud/quiet?
- Adjust `volume` parameter (0.0 to 1.0)
- Example: `volume={0.5}` = 50% volume

## Final Steps

1. ✅ Create/obtain audio files
2. ✅ Place in `public/audio/`
3. ✅ Test in Remotion Studio (`npm start`)
4. ✅ Adjust timing if needed
5. ✅ Render final video (`npm run render`)

---

**Note**: The animation is fully functional without audio. Audio files are optional and enhance the experience without being required for rendering.
