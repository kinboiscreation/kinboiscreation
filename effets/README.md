# Bibliothèque d'effets — Kin Bois Création

13 effets visuels réutilisables, en CSS et JavaScript natifs.
**Aucune dépendance** : pas de React, pas de bibliothèque externe, rien à installer.

À réutiliser tel quel sur les prochains sites.

## Installation

Copiez le dossier `effets/` dans le nouveau projet, puis dans le `<head>` :

```html
<link rel="stylesheet" href="effets/effets.css">
<script src="effets/effets.js" defer></script>
```

C'est tout. Tout s'initialise automatiquement.

## Couleurs

Redéfinissez ces variables dans votre feuille de style pour adapter à la charte :

```css
:root{
  --fx-panel:#FFFFFF;           /* fond des cartes */
  --fx-ink:#4A2E1C;             /* texte */
  --fx-faint:rgba(74,46,28,.62);/* texte secondaire */
  --fx-accent:#B87333;          /* cuivre */
  --fx-accent-2:#C9A961;        /* or */
  --fx-shadow:rgba(74,46,28,.22);
  --fx-radius:10px;
}
```

## Structure de base d'une carte

La plupart des effets attendent cette structure :

```html
<figure class="fx-card">
  <div class="fx-frame"><img src="photo.webp" alt="Description"></div>
  <figcaption class="fx-cap"><b>Titre</b><span>Sous-titre</span></figcaption>
</figure>
```

Et une grille de cartes :

```html
<div class="fx-grid fx-parallax">
  <figure class="fx-card">…</figure>
  <figure class="fx-card">…</figure>
</div>
```

## Les 13 effets

| Classe | Effet | JS |
|---|---|:--:|
| `fx-parallax` | L'image glisse dans son cadre en suivant le curseur | oui |
| `fx-expand` | La carte survolée s'élargit, les voisines se rétractent | non |
| `fx-caption` | La légende remonte par-dessus la photo au survol | non |
| `fx-glass` | Reflet au curseur + liseré doré rotatif | oui |
| `fx-coverflow` | Cartes inclinées en enfilade, la survolée se redresse | non |
| `fx-flip` | La carte pivote et montre son verso | non |
| `fx-lightbox` | Clic pour ouvrir la photo en plein écran | oui |
| `fx-scroll-parallax` | Colonnes défilant à vitesses différentes | oui |
| `fx-shutter` | La photo se réduit vers le haut, le texte apparaît | non |
| `fx-words` | Titre révélé mot à mot depuis un masque | oui |
| `fx-unfurl` | L'image se déploie en largeur au scroll | oui |
| `fx-spotlight` | Le curseur agit comme une lampe qui révèle la photo | oui |
| `fx-cut` | Texte dévoilé ligne par ligne par un volet | oui |

## Structures particulières

**`fx-expand`** — conteneur flex, hauteur fixée dans la CSS (330px par défaut).
Mettez la légende en position absolue : c'est déjà géré.

**`fx-flip`** — chaque carte contient deux faces :

```html
<figure class="fx-card">
  <div class="fx-flip-inner">
    <div class="fx-face"><img src="photo.webp" alt=""></div>
    <div class="fx-face fx-back"><b>Titre</b><span>Détail</span></div>
  </div>
</figure>
```

**`fx-scroll-parallax`** — colonnes avec une vitesse en pixels
(négatif = la colonne monte) :

```html
<div class="fx-scroll-parallax">
  <div class="fx-col" data-speed="-26">…</div>
  <div class="fx-col" data-speed="18">…</div>
</div>
```

**`fx-shutter`** — la légende utilise `fx-shutter-txt` :

```html
<figure class="fx-card">
  <div class="fx-frame"><img src="photo.webp" alt=""></div>
  <figcaption class="fx-shutter-txt">
    <b>Titre</b><span>Sous-titre</span><em>Note</em>
  </figcaption>
</figure>
```

**`fx-words`** et **`fx-cut`** — le texte est passé en attribut, le script
le découpe tout seul (`|` sépare les lignes pour `fx-cut`) :

```html
<div class="fx-words"><p data-reveal="D'une bûche à une pièce qui reste"></p></div>

<div class="fx-cut"><p data-cut="Lits · Tables|Portes · Cuisines"></p></div>
<div class="fx-rule"></div>
```

**`fx-spotlight`** — deux couches superposées :

```html
<div class="fx-spotlight">
  <div class="fx-layer fx-under"><div><b>Texte caché dessous</b></div></div>
  <div class="fx-layer fx-over"><img src="photo.webp" alt=""></div>
</div>
```

## Bon à savoir

- **Accessibilité** : si le visiteur a demandé à réduire les animations dans
  les réglages de son système, tout est désactivé automatiquement.
- **Mobile** : les effets au survol ne s'activent que sur écran avec souris.
  Sur téléphone, la mise en page reste nette et statique.
- **Sécurité d'affichage** : les effets déclenchés au scroll ont un filet de
  sécurité de 2,5 secondes — si la détection échoue, le contenu s'affiche
  quand même. Aucune image ne peut rester invisible.
- **Contenu injecté après coup** : appelez `Effets.init()` pour réinitialiser.

## Démonstration

Les 13 effets appliqués à de vraies photos :
[demo-effets.html](../demo-effets.html)
