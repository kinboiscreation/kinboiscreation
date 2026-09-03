---
workflow: general-video
flow: companion
storyboard: yes
message: "Deux vidéos promotionnelles du tour 360° immersive de Kin Bois Création"
destination: youtube, social-media
aspect: 1920x1080
language: fr
audience: "Clients potentiels, prospects B2B, visiteurs site web"
length: "60s (démo) + 30s (marketing)"
angle: immersive-tour-showcase
---

## Intent

Créer deux vidéos de présentation du tour 360° immersive nouvellement lancé:

1. **Vidéo Démo (1 minute)** : Présentation complète du tour avec explications des 7 scènes, des interactions hotspots, et du flux de navigation. Destinée à la documentation, YouTube, et mise en avant sur le site.

2. **Vidéo Marketing (30 secondes)** : Version courte percutante pour réseaux sociaux (Instagram, TikTok, Facebook) avec focus sur les moments clés et l'appel à l'action "Visiter l'atelier en 360°".

Objectif: Démontrer l'innovation du tour immersif, augmenter l'engagement, et diriger le trafic vers la visite 360°.

## Deux productions parallèles

### VIDÉO 1: DÉMO COMPLÈTE (60 secondes)

**Scènes et timeline:**
- 0-5s: Écran titre "Visite 360° - Kin Bois Création" + animation ouverture
- 5-10s: Scène 1 (Accueil) - rotation panorama, présentation
- 10-15s: Scène 2 (Atelier & Showroom) - hotspots visibles, explications
- 15-20s: Scène 3 (Fabrication) - outils, établis, action
- 20-25s: Scène 4 (Matériaux) - sélection bois, diversité
- 25-30s: Scène 5 (Réalisations) - galerie créations principales
- 30-40s: Scène 6 (Détail d'une œuvre) - finitions artisanales, close-up
- 40-55s: Scène 7 (Contact) - appel à l'action, bouton WhatsApp
- 55-60s: Outro "Découvrez maintenant" + CTA button

**Audio (Voix Off en Français):**
- 0-5s: "Bienvenue dans la visite 360° de Kin Bois Création"
- 5-10s: "Explorez librement chaque panorama en rotation complète"
- 10-15s: "Découvrez l'espace de travail avec nos outils et établis"
- 15-20s: "Sélectionnez parmi nos essences de bois massif"
- 20-30s: "Admirez nos réalisations et le détail du savoir-faire artisanal"
- 30-45s: "Cliquez sur les hotspots pour explorer chaque zone"
- 45-55s: "Naviguez facilement entre les 7 scènes du tour"
- 55-60s: "Contactez-nous pour un devis ou discuter de votre projet"

**Musique:** Ambiance relaxante et professionnelle, royalty-free, tempo modéré (inspirée artisanat/bois)

**Format & Specs:**
- Résolution: 1920×1080 @ 60fps
- Codec: H.264 MP4
- Durée exacte: 60 secondes
- Ratio aspect: 16:9

---

### VIDÉO 2: MARKETING (30 secondes)

**Scènes et timeline:**
- 0-3s: Logo/titre percutant "KIN BOIS CRÉATION"
- 3-8s: Scène 1 (Accueil) - quick rotation + intro
- 8-12s: Scène 2 (Atelier) - hotspot interaction highlight
- 12-18s: Scène 6 (Détail) - finitions et savoir-faire, zoom détail
- 18-25s: Scène 7 (Contact) - CTA visible, bouton WhatsApp prominent
- 25-30s: Outro "VISITER L'ATELIER EN 360°" + button animation

**Audio (Voix Off en Français):**
- 0-3s: "Kin Bois Création"
- 3-10s: "Découvrez notre atelier en 360°"
- 10-18s: "Meubles artisanaux en bois massif"
- 18-25s: "Explorez chaque détail du savoir-faire"
- 25-30s: "Visiter maintenant" [avec animation bouton]

**Musique:** Version dynamique/energique, même palette mais plus rapide, percutant

**Format & Specs:**
- Résolution: 1920×1080 @ 60fps
- Codec: H.264 MP4
- Durée exacte: 30 secondes
- Ratio aspect: 16:9
- Optimisé pour: YouTube Shorts, Instagram Reels, TikTok, Facebook

---

## Assets & Sources

**Panoramas existants:**
- `/home/user/kinboiscreation/visite-360/assets/360/01-accueil.jpg`
- `/home/user/kinboiscreation/visite-360/assets/360/02-atelier.jpg`
- `/home/user/kinboiscreation/visite-360/assets/360/03-fabrication.jpg`
- `/home/user/kinboiscreation/visite-360/assets/360/04-materiaux.jpg`
- `/home/user/kinboiscreation/visite-360/assets/360/05-realisations.jpg`
- `/home/user/kinboiscreation/visite-360/assets/360/06-showcase.jpg`
- `/home/user/kinboiscreation/visite-360/assets/360/07-contact.jpg`

**Application web:**
- URL locale: `file:///home/user/kinboiscreation/visite-360/index.html`
- Capture via Playwright pour enregistrement réel du tour

**Couleurs marque (palette Kin Bois):**
- Ivoire: `#F5F1E8`
- Bois foncé: `#33241A`
- Argile: `#B87333`
- Or fin: `#C9A961`

**Polices:**
- Titres: Cormorant Garamond
- Corps: Space Grotesk

---

## Production Approach

**Dual Track:**
1. **Enregistrement réel** : Utiliser Playwright pour capturer le tour 360° en action
   - Contrôler les rotations panorama
   - Afficher les hotspots et interactions
   - Capturer les transitions entre scènes
   - Export en vidéo raw

2. **Motion Graphics** : HyperFrames pour animations, transitions, titres
   - Générer les animations d'ouverture/fermeture
   - Ajouter les overlays de texte
   - Animer les boutons CTA
   - Créer les transitions fluides entre scènes

3. **Post-production Audio** :
   - Voix off professionnelle en français
   - Musique royalty-free adaptée
   - Mixage audio final

**Livrables finaux:**
- `demo-tour-360.mp4` (1 minute)
- `marketing-tour-360.mp4` (30 secondes)
- Fichiers source (storyboard, composition HyperFrames)

---

## Technical Notes

- Aucun accès réseau requis pour l'enregistrement (fichiers locaux)
- Les panoramas sont au format équirectangulaire (2:1 ratio)
- Performance: Rendu full HD @ 60fps standard
- La application Babylon.js doit être accessible en local pour capture

---

## Client Requirements

✅ Voix off professionnelle en français fluide
✅ Musique royalty-free sélectionnée automatiquement
✅ Deux durées différentes (60s + 30s)
✅ Design cohérent avec palette marque existante
✅ Animation fluide et transitions professionnelles
✅ Montage et post-production complets
