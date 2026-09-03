# Guide Remplacement Panoramas 360°

## 📸 **Format & Spécifications**

Chaque panorama doit être une **image panoramique équirectangulaire** (projection 360°).

### Caractéristiques techniques:
- **Format:** JPG ou PNG compressé
- **Résolution recommandée:** 1600×800 pixels minimum (2:1 ratio)
- **Résolution optimale:** 2048×1024 ou 3200×1600 pixels
- **Taille fichier:** 150-500 KB max par image
- **Compression:** 85% quality JPG ou PNG compressé
- **Projection:** Équirectangulaire (cylindrique) — **PAS de projection cubemap**

### Pourquoi équirectangulaire?
- Standard pour Babylon.js panoramas
- Compatible avec tous les navigateurs
- Compression efficace
- Pas de distortion aux pôles

---

## 🗂️ **Structure des fichiers**

Chaque panorama est stocké ici:

```
/home/user/kinboiscreation/visite-360/assets/360/
├── 01-accueil.jpg          ← Scène 1: Bienvenue à l'atelier
├── 02-atelier.jpg          ← Scène 2: Vue générale atelier
├── 03-fabrication.jpg      ← Scène 3: Espace de travail
├── 04-materiaux.jpg        ← Scène 4: Sélection bois
├── 05-realisations.jpg     ← Scène 5: Galerie créations
├── 06-showcase.jpg         ← Scène 6: Détail d'une pièce
└── 07-contact.jpg          ← Scène 7: CTA Contact
```

**IMPORTANT:** Gardez les noms EXACTEMENT identiques. Le système les charge par ces noms.

---

## 📷 **Scènes détaillées**

### Scène 1: Accueil (`01-accueil.jpg`)
**Description:** Entrée principale de l'atelier  
**Contenu:** Vue d'ensemble, porte d'entrée, panneau Kin Bois Création  
**Hotspot:** "Entrer dans l'atelier" → Scene 2  
**Conseil de prise de vue:**
- Placer caméra 360° à hauteur porte d'entrée
- Capturer la façade et l'intérieur
- Préférer lumière naturelle du matin/après-midi

---

### Scène 2: Atelier & Showroom (`02-atelier.jpg`)
**Description:** Espace principal de présentation  
**Contenu:** Meubles exposés, espace ouvert, étagères  
**Hotspots:**
- "Espace de Fabrication" → Scene 3
- "Sélection de Matériaux" → Scene 4
**Conseil:**
- Cadre symétrique si possible
- Montrer plusieurs meubles terminés
- Éviter zones sombres (utiliser lumière uniforme)

---

### Scène 3: Espace de Fabrication (`03-fabrication.jpg`)
**Description:** Atelier de travail avec établis  
**Contenu:** Établis, outils, pièces en cours  
**Hotspot:** "Voir les matériaux" → Scene 4  
**Conseil:**
- Montrer l'activité (bois, outils, travail)
- Caméra au niveau de la table de travail
- Bonne ventilation/pas de brume

---

### Scène 4: Matériaux & Bois (`04-materiaux.jpg`)
**Description:** Sélection et rangement des bois  
**Contenu:** Planches, essences variées, teintes  
**Hotspot:** "Galerie créations" → Scene 5  
**Conseil:**
- Montrer diversité des bois (couleurs, textures)
- Éclairer pour révéler grains du bois
- Signage avec noms essences (optionnel)

---

### Scène 5: Réalisations (`05-realisations.jpg`)
**Description:** Galerie principale des créations  
**Contenu:** Meubles vedettes (lits, tables, portes)  
**Hotspot:** "Détail d'une pièce" → Scene 6  
**Conseil:**
- Pièces les plus impressionnantes
- Différentes catégories (chambre, salon, cuisine)
- Bien éclairées, sans ombres dures

---

### Scène 6: Détail d'une Œuvre (`06-showcase.jpg`)
**Description:** Zoom sur finitions artisanales  
**Contenu:** Gros plan pièce maîtresse (table, armoire, lit)  
**Hotspot:** "Demander un devis" → Scene 7  
**Conseil:**
- Montrer détails (jointures, finitions, vernis)
- Texture du bois en gros plan
- Pièce unique ou signature du maître

---

### Scène 7: Contact & Devis (`07-contact.jpg`)
**Description:** Finalisation et appel à l'action  
**Contenu:** Infos contact, formulaire, bureau Jeantim  
**Hotspot:** Bouton "Contacter" → WhatsApp/Email  
**Conseil:**
- Affiche contact + logo
- Jeantim au bureau (optionnel)
- Ambiance accueillante

---

## 🛠️ **Comment créer une image équirectangulaire**

### Option A: Avec caméra 360° (MEILLEUR)
Si vous avez accès à une caméra 360° (Ricoh Theta, Insta360, etc.):

1. **Prendre photo 360°** avec l'app caméra
2. **Exporter en JPG** format équirectangulaire
3. **Compresser:** ImageMagick ou FFmpeg
   ```bash
   ffmpeg -i input.jpg -q:v 5 output.jpg
   ```
4. **Redimensionner si nécessaire:**
   ```bash
   ffmpeg -i input.jpg -vf scale=1600:800 output.jpg
   ```
5. **Placer dans** `visite-360/assets/360/`

---

### Option B: Avec smartphone + App
Utiliser app gratuite comme **Panorama** ou **Theta+**:

1. Prendre panorama en mode 360° (swiping)
2. Exporter en JPG
3. Compresser et placer dans dossier

---

### Option C: Avec Photoshop (fusion photos)
Si vous avez plusieurs photos:

1. Prendre 6-8 photos circulaires du même point
2. Photo > Photomerge Panorama
3. Exporter en JPG

---

### Option D: Montrer les photos existantes
**Pour démarrer rapidement**, utiliser les photos catalogue existantes:

Créer panorama simple en stackant images:
```bash
# Créer image panoramique de 2 photos côte à côte
convert -append photo1.webp photo2.webp panorama.jpg

# Redimensionner au 2:1 ratio
ffmpeg -i panorama.jpg -vf scale=1600:800 output.jpg
```

---

## 📝 **Procédure de remplacement**

### Étape 1: Préparer l'image
```bash
# Compresser JPG
ffmpeg -i ma_photo_360.jpg -q:v 5 optimized.jpg

# Vérifier résolution (doit être 2:1 ratio)
# 1600×800, 2048×1024, 3200×1600, etc.
ffprobe -v error -show_entries stream=width,height optimized.jpg
```

### Étape 2: Placer le fichier
```bash
# Copier dans le dossier visite-360
cp optimized.jpg /home/user/kinboiscreation/visite-360/assets/360/01-accueil.jpg
```

### Étape 3: Tester localement
1. Ouvrir `http://localhost:8000/visite-360/` (après `python -m http.server`)
2. Vérifier l'image charge bien
3. Tester rotation 360° (drag souris)
4. Vérifier hotspots

### Étape 4: Commit & Push
```bash
git add visite-360/assets/360/
git commit -m "Update: Panoramas 360° haute résolution"
git push origin main
```

---

## 🎯 **Checklist remplacement**

Pour chaque panorama:
- ✅ Format équirectangulaire (2:1 ratio)
- ✅ Résolution ≥ 1600×800 px
- ✅ Taille ≤ 500 KB
- ✅ Nom fichier exact (`XX-scenename.jpg`)
- ✅ Emplacement correct (`visite-360/assets/360/`)
- ✅ Testé localement
- ✅ Commit descriptif

---

## 🔍 **Vérifier qualité panorama**

Outils en ligne:
- **Pannellum Viewer:** http://pannellum.org/
- **Babylon.js Playground:** playground.babylonjs.com
- **Vrview Google:** Google's VR Viewer

Upload votre image pour prévisualiser avant déploiement.

---

## ⚠️ **Problèmes courants**

| Problème | Cause | Solution |
|----------|-------|----------|
| Image ne pivote pas | Format pas équirectangulaire | Refaire avec projection cylindrique/sphérique |
| Image pixelisée | Résolution trop basse | Utiliser résolution ≥ 2048×1024 |
| Chargement lent | Taille > 500 KB | Compresser JPG (q:v 4-5) |
| Hotspots au mauvais endroit | Coordonnées lat/lon erronées | Ajuster dans `scenes.js` |
| Skybox inversé | Format cubemap au lieu équirectangulaire | Convertir en équirectangulaire |

---

## 📚 **Ressources supplémentaires**

- [Babylon.js Panorama Docs](https://doc.babylonjs.com/features/featuresDeepDive/Rendering/skybox)
- [Équirectangular Projection Wiki](https://en.wikipedia.org/wiki/Equirectangular_projection)
- [360° Photo Guide](https://www.360guide.co.uk/)
- [FFmpeg Compression](https://trac.ffmpeg.org/wiki/Encode/JPEG)

---

## 💬 **Support**

Si panoramas ne chargent pas:
1. Vérifier console browser (F12 > Console)
2. Chercher erreur "404" ou "Texture loading failed"
3. Vérifier chemin fichier et nom exact
4. Valider format équirectangulaire
5. Compresser si trop gros

---

**Bon shooting! 📸🔄**