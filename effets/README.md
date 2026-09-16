# Bibliothèque d'effets — Kin Bois Création

30 effets visuels réutilisables, en CSS et JavaScript natifs.
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

## Les 30 effets

### Au survol de la souris

| Classe | Effet | JS |
|---|---|:--:|
| `fx-parallax` | L'image glisse dans son cadre en suivant le curseur | oui |
| `fx-expand` | La carte survolée s'élargit, les voisines se rétractent | non |
| `fx-caption` | La légende remonte par-dessus la photo | non |
| `fx-glass` | Reflet au curseur + liseré doré rotatif | oui |
| `fx-coverflow` | Cartes inclinées en enfilade, la survolée se redresse | non |
| `fx-flip` | La carte pivote et montre son verso | non |
| `fx-shutter` | La photo se réduit vers le haut, le texte apparaît | non |
| `fx-spotlight` | Le curseur agit comme une lampe qui révèle la photo | oui |
| `fx-tilt` | La carte entière s'incline vers le curseur, avec reflet | oui |
| `fx-loupe` | Loupe sur le grain du bois, au curseur | oui |
| `fx-duotone` | Photo teintée qui reprend ses couleurs au survol | non |
| `fx-blinds` | Lamelles verticales qui s'ouvrent comme un store | non |

### Au défilement de la page

| Classe | Effet | JS |
|---|---|:--:|
| `fx-scroll-parallax` | Colonnes défilant à vitesses différentes | oui |
| `fx-words` | Titre révélé mot à mot depuis un masque | oui |
| `fx-unfurl` | L'image se déploie en largeur | oui |
| `fx-cut` | Texte dévoilé ligne par ligne par un volet | oui |
| `fx-curtain` | Un volet sombre se lève sur chaque photo | oui |
| `fx-mosaic` | La photo se découvre par carrés, en vague diagonale | oui |
| `fx-stagger` | Les cartes montent une à une | oui |
| `fx-stack` | Les photos s'empilent comme un jeu de cartes | non |
| `fx-zoomout` | L'image très rapprochée s'ouvre peu à peu | oui |
| `fx-count` | Les chiffres montent depuis zéro | oui |

### En continu ou à la manipulation

| Classe | Effet | JS |
|---|---|:--:|
| `fx-lightbox` | Clic pour ouvrir la photo en plein écran | oui |
| `fx-compare` | Comparateur avant / après à poignée glissante | oui |
| `fx-marquee` | Bande de photos qui défile en boucle sans fin | oui |
| `fx-ticker` | Bandeau de texte qui défile en boucle | oui |
| `fx-rail` | Rangée horizontale qui se fait glisser à la souris | oui |
| `fx-kenburns` | Zoom lent et continu sur la photo | non |
| `fx-typed` | Phrases qui s'écrivent et s'effacent en boucle | oui |
| `fx-magnet` | Le bouton vient à la rencontre du curseur | oui |

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

**`fx-compare`** — deux photos superposées, les libellés sont facultatifs.
La poignée est ajoutée par le script ; elle se manipule à la souris, au doigt
et aux flèches du clavier :

```html
<div class="fx-compare" data-before="À l'atelier" data-after="Chez le client">
  <img class="fx-before" src="brut.webp" alt="Meuble brut">
  <img class="fx-after"  src="fini.webp" alt="Meuble fini">
</div>
```

**`fx-marquee`** et **`fx-ticker`** — mettez simplement le contenu à l'intérieur :
le script le duplique pour que la boucle soit invisible. `data-speed` donne la
durée d'un tour en secondes, `data-direction="reverse"` inverse le sens.

```html
<div class="fx-marquee" data-speed="42">
  <figure class="fx-card">…</figure>
  <figure class="fx-card">…</figure>
</div>

<div class="fx-ticker" data-speed="24"><span>Lits · Tables · Portes ·&nbsp;</span></div>
```

**`fx-loupe`** — une seule image, `data-zoom` règle le grossissement (2,4 par défaut) :

```html
<div class="fx-loupe" data-zoom="2.6"><img src="photo.webp" alt=""></div>
```

**`fx-stack`** — chaque carte est enveloppée dans un `.fx-sticky` :

```html
<div class="fx-stack">
  <div class="fx-sticky"><figure class="fx-card">…</figure></div>
  <div class="fx-sticky"><figure class="fx-card">…</figure></div>
</div>
```

**`fx-rail`** — les cartes sont des enfants directs, rien d'autre à faire :

```html
<div class="fx-rail">
  <figure class="fx-card">…</figure>
  <figure class="fx-card">…</figure>
</div>
```

**`fx-count`** — la valeur est dans `data-to`, le texte qui suit dans `data-suffix` :

```html
<div class="fx-count">
  <div><b data-to="340" data-suffix="+"></b><span>pièces livrées</span></div>
  <div><b data-to="12" data-suffix=" ans"></b><span>de métier</span></div>
</div>
```

**`fx-typed`** — les phrases sont séparées par `|` et tournent en boucle :

```html
<p class="fx-typed" data-type="Nous fabriquons vos lits.|Nous fabriquons vos portes."></p>
```

**`fx-magnet`** — sur un lien ou un bouton. `data-strength` règle l'attirance
(0,32 par défaut) :

```html
<a class="fx-magnet" href="#devis" data-strength="0.34">Demander un devis →</a>
```

**`fx-zoomout`** — une seule image, le script pilote le dézoom :

```html
<div class="fx-zoomout"><img src="grande-photo.webp" alt=""></div>
```

**`fx-curtain`**, **`fx-mosaic`**, **`fx-stagger`**, **`fx-kenburns`**,
**`fx-duotone`**, **`fx-blinds`**, **`fx-tilt`** — la classe se pose sur la
grille, les cartes gardent la structure de base :

```html
<div class="fx-grid fx-stagger">
  <figure class="fx-card">…</figure>
</div>
```

## Bon à savoir

- **Accessibilité** : si le visiteur a demandé à réduire les animations dans
  les réglages de son système, tout est désactivé automatiquement — et rien
  ne reste masqué : rideaux, mosaïques et lamelles s'effacent, les compteurs
  affichent directement leur valeur.
- **Mobile** : les effets au survol ne s'activent que sur écran avec souris.
  Sur téléphone, la mise en page reste nette et statique. `fx-rail` reste
  utilisable au doigt, `fx-compare` aussi.
- **Sécurité d'affichage** : les effets déclenchés au scroll ont un filet de
  sécurité de 2,5 secondes — si la détection échoue, le contenu s'affiche
  quand même. Aucune image ne peut rester invisible.
- **Contenu injecté après coup** : appelez `Effets.init()` pour réinitialiser.
  Chaque effet ne s'installe qu'une fois, un rappel est donc sans danger.

## Démonstration

Les 30 effets appliqués à de vraies photos :
[demo-effets.html](../demo-effets.html)
