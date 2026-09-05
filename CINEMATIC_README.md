# MYRTILLE & ABRICOT — LA COLÈRE
## Version Cinématographique Réaliste

**Durée**: 40 secondes | **Format**: 1920x1080 | **FPS**: 30 | **Codec**: H.264

---

## 🎬 Vue d'ensemble

Cette version cinématographique implémente le script réaliste complet avec les images générées des personnages Myrtille et Abricot. 

**Caractéristiques clés**:
- ✅ Images 3D photorealistic intégrées
- ✅ Caméra portée agitée (8px shake) → caméra stable
- ✅ Dialogue français complet et synchronisé
- ✅ Progression émotionnelle réaliste
- ✅ Lumière dynamique (sombre → lumineuse)
- ✅ 9 sections structurées selon le script

---

## 📋 Structure du script

### 0–3 s — L'ACCROCHE
**Plan 1: Myrtille entre rapidement**
- Image: Myrtille entrée agitée
- Caméra: Très agitée (8px shake)
- Effet: Opacity 0 → 1, translate -300px → 0
- Audio: Porte, respiration, pas rapides

**Plan 2: Gros plan sur son visage**
- Image: Myrtille en gros plan, angry
- Texte: "La vraie force n'est pas de crier plus fort."
- Caméra: Secoué

---

### 3–8 s — LA COLÈRE L'EMPORTE
**Myrtille fait les cent pas**
- Image: Myrtille pacing (mouvement sinusoïdal)
- Dialogue: "Non mais franchement… C'est pas possible… Quel manque de respect…"
- Caméra: Peine à la suivre (shake 4px)
- Lumière: 70%

---

### 8–12 s — LE CONTRASTE
**Abricot apparaît, assis**
- Image 1: Myrtille (fading)
- Image 2: Abricot, assis, calme (opacity 0 → 1)
- Dialogue Abricot: "Myrtille… Qu'est-ce qui t'arrive ?"
- Caméra: Shake 3px
- Composition: Myrtille domine l'espace, Abricot observateur

---

### 12–17 s — LA BLESSURE
**Abricot se lève lentement**
- Image: Myrtille et Abricot, moment émotionnel
- Dialogue Myrtille: "Il m'a manqué de respect devant tout le monde."
- Caméra: Tightens (framerate decrease)
- Shake: 2px
- Lumière: 75%

---

### 17–22 s — LE PIC
**Myrtille au summum de sa colère**
- Image: Myrtille très en colère (angry close-up)
- Dialogue: "J'ai envie d'aller lui répondre TOUT DE SUITE!"
- Caméra: Frames tightens drastically
- Effet: Glow rougeâtre autour de Myrtille
- Shake: 2px

---

### 22–28 s — LE TOURNANT
**Abricot parle sagesse, silence dure**
- Image: Myrtille freeze
- Moment: Silence profond (1 seconde)
- Dialogue Abricot: "Ne le fais pas maintenant. Quand on parle sous la colère, ce sont nos blessures qui parlent avant nous."
- Caméra: Shake 1px puis 0px
- Lumière: Commence à augmenter
- Myrtille: Commence à se calmer

---

### 28–34 s — LE CALME COMMENCE
**Les deux personnages ensemble**
- Image: Myrtille et Abricot assis ensemble
- Dialogue Abricot: "Tu parleras mieux… quand la colère ne parlera plus à ta place."
- Caméra: Quasi immobile (0.5px)
- Lumière: 80%
- Myrtille: Les mains commencent à s'ouvrir
- Émotion: De la tension vers la sérénité

---

### 34–38 s — LA MAÎTRISE
**Myrtille trouve la maîtrise d'elle-même**
- Image: Myrtille et Abricot dans le calme
- Dialogue Myrtille: "Je vais d'abord me calmer… Et ensuite… je lui parlerai."
- Caméra: Parfaitement immobile
- Lumière: 90%
- Abricot: Acquiesce simplement

---

### 38–40 s — LA FIN
**Message final sur écran noir**
- Transition: Fade to black
- Message 1: "🍑 DOMINE TA COLÈRE AVANT QU'ELLE NE TE DOMINE"
- Message 2: "La vraie force, c'est la maîtrise de soi."
- Fade out complet

---

## 🎮 Comment utiliser

### Prévisualiser en temps réel
```bash
npm start
```
Lance Remotion Studio. Dans l'interface:
1. Cliquez sur "MyrtilleAbricotCinematic"
2. Jouez l'animation
3. Ajustez la vitesse de lecture
4. Testez le comportement de la caméra

### Rendre la vidéo finale
```bash
npm run render-cinematic
```

Génère `output-cinematic.mp4` avec tous les effets appliqués.

### Options de rendu avancées

**Haute qualité**:
```bash
remotion render src/index-cinematic.tsx MyrtilleAbricotCinematic output-cinematic.mp4 --quality=100
```

**Concurrence (rendre plus vite)**:
```bash
remotion render src/index-cinematic.tsx MyrtilleAbricotCinematic output-cinematic.mp4 --concurrency=4
```

**Format WebM** (plus petit, web-friendly):
```bash
remotion render src/index-cinematic.tsx MyrtilleAbricotCinematic output-cinematic.webm --codec=webm
```

---

## 🎨 Techniques cinématographiques implémentées

### Caméra portée (Handheld Camera)
```typescript
const shakeIntensity = interpolate(frame, [0, 150, 600, 1200], [8, 4, 1, 0]);
const cameraShake = Math.sin(frame * 0.15) * shakeIntensity;
transform: `translateX(${cameraShake}px)`
```
- **Début**: 8px de shake (très agitée)
- **Milieu**: 4px (toujours présente)
- **Tournant**: 1px (commençe à se calmer)
- **Fin**: 0px (parfaitement stable)

Cela crée l'illusion que la caméra suit Myrtille, puis s'apaise avec elle.

### Lighting Progression
```typescript
const lightIntensity = interpolate(frame, [0, 600, 1200], [0.7, 0.8, 1]);
filter: `brightness(${lightIntensity})`
```
- La lumière augmente graduellement
- Renforce la progression émotionnelle
- Fin lumineuse = résolution positive

### Frame Closeness (Composition)
```typescript
const frameCloseness = interpolate(frame, [360, 660], [0, 1]);
right: 100 + frameCloseness * 50
```
- Les personnages se rapprochent progressivement
- Augmente la tension du conflit
- Puis se stabilisent ensemble (réconciliation)

### Opacity Transitions
Chaque dialogue apparaît et disparaît avec un timing précis:
```typescript
const dialogue1Opacity = interpolate(frame, [180, 210, 450, 480], [0, 1, 1, 0]);
```
- Fade in: 180-210 frames
- Visible: 210-450 frames
- Fade out: 450-480 frames

---

## 🎵 Audio Integration

Les fichiers audio doivent être placés dans `public/audio/`:

```
public/audio/
├── dialogue-myrtille-1.mp3       (3-8s)
├── dialogue-abricot-1.mp3        (8-12s)
├── dialogue-myrtille-2.mp3       (12-17s)
├── dialogue-abricot-2.mp3        (22-28s)
├── dialogue-finale.mp3           (34-38s)
└── background-music.mp3          (0-40s, volume 30%)
```

Voir `AUDIO_SETUP.md` pour détails complets.

---

## 📝 Fichiers modifiés

### Nouveaux fichiers
- `src/CinematicVersion.tsx` - Composition principale (625 lignes)
- `src/RootCinematic.tsx` - Container pour Remotion
- `src/index-cinematic.tsx` - Entry point
- `public/characters/` - 8 images de personnages (tous les fichiers .png)

### Fichiers modifiés
- `package.json` - Ajout script "render-cinematic"

### Fichiers existants (inchangés)
- `src/index.tsx` - Abstract version
- `src/Root.tsx` - Abstract version
- `src/MyrtilleAbricot.tsx` - Abstract version
- Toutes les scènes abstraites restent disponibles

---

## 🐛 Troubleshooting

### Les images ne s'affichent pas?
✅ Vérifiez que `public/characters/` contient les 8 fichiers PNG  
✅ Vérifiez les chemins dans `CinematicVersion.tsx` correspondent aux noms de fichiers  
✅ Rafraîchissez le Studio (Ctrl+R)

### La caméra ne bouge pas?
✅ La secousse (shake) diminue avec le temps - c'est intentionnel  
✅ À la fin (frame 1140+), il y a 0px de shake  
✅ Réglez `shakeIntensity` à `[8, 8, 8, 8]` si vous voulez de la secousse partout

### Les dialogues sont mal synchronisés?
✅ Chaque dialogue a des timeframes spécifiques en frames  
✅ 1 frame = 1/30e seconde  
✅ Modifiez les nombres dans `interpolate()` pour ajuster

### Le rendu est très lent?
✅ Réduisez la résolution: `--resolution=0.5`  
✅ Augmentez la concurrence: `--concurrency=8`  
✅ Augmentez le CRF (moins de qualité): `--crf=25`

---

## 🎯 Prochaines étapes

1. **Audio intégration**
   - Enregistrer/obtenir dialogues français
   - Ajouter musique de fond
   - Synchroniser avec timing

2. **Fine-tuning**
   - Tester dans Remotion Studio
   - Ajuster shake intensity si besoin
   - Modifier timing des dialogues

3. **Effets bonus** (optionnel)
   - Ajouter effet glow plus intense au pic
   - Ajouter particules émotionnelles
   - Ajouter transitions de scène

4. **Rendu final**
   - Tester rendus à différentes qualités
   - Générer version 4K
   - Exporter pour réseaux sociaux

---

## 📊 Specifications Technique

| Paramètre | Valeur |
|-----------|--------|
| Durée | 40 secondes |
| FPS | 30 images/seconde |
| Frames total | 1200 |
| Résolution | 1920 x 1080 |
| Codec | H.264 |
| Format | MP4 |
| Shake max | 8px |
| Shake min | 0px |
| Lumière min | 70% |
| Lumière max | 100% |

---

## 🎬 Philosophie de réalisation

> "Le spectateur ne doit jamais avoir l'impression qu'Abricot fait une leçon. Il accompagne. Il écoute. Il laisse les silences faire une partie du travail."

Cette composition implémente cette philosophie via:
- **Caméra agitée** = état émotionnel de Myrtille
- **Silences** = moments de réflexion profonde
- **Lumière augmentante** = clarté croissante
- **Dialogues simples** = pas de prédication
- **Images naturelles** = réalisme préservé

Le message n'est pas expliqué. **Il est vécu.**

---

**Version cinématographique créée**: 5 septembre 2026  
**Framework**: Remotion v4.0.520  
**Status**: ✅ Prête pour rendu final
