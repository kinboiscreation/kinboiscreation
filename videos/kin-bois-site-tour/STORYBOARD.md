---
format: 1080x1920
duration: 31s
message: "Découvrez le site de Kin Bois Création — le catalogue et le savoir-faire de Jeantim, à Kinshasa"
arc: Logo (la marque) → Hero (le site s'ouvre) → L'artisan → Catalogue (deux beats) → Pourquoi me choisir → Avis → CTA
audience: "Particuliers et entreprises à Kinshasa cherchant du mobilier ou de l'agencement sur mesure"
mode: autonomous
music: none
---

## Video direction

- **Palette** (from `frame.md`): canvas = ivoire (`--canvas` #F7F4EE); ink = bois profond (`--ink` #1C130E / dark ebène for scrims); accent = cuivre (`--accent` #B87333) — captions, CTA line, glows, device-frame hairline only, never a large fill.
- **Source material**: real screenshots from the actual site (`capture/screenshots/scroll-*.png`), captured locally — this is a **site tour**, so the captured page is the visual source of truth (no invented UI). Each site frame is the real screenshot full-bleed inside a thin cuivre hairline "device" border (suggesting a phone screen without a heavy 3D mockup), never a rebuilt DOM.
- **Motion grammar**: long-tail `power3` eases. Every site-screenshot frame gets a slow vertical drift within the image (a restrained Ken-Burns "still scrolling" feel, `multi-phase-camera`) — never a hard scroll-jump. Caption labels stack in on their own beat, after the image settles, exactly like the first film's grammar.
- **Rhythm**: Frames 2–7 (the tour itself) move briskly, one held beat each. Frame 1 (logo) and Frame 8 (CTA) are the deliberate holds — bookends, calm, text-only.
- **Negative list**: no fake browser chrome, no invented UI elements not present on the real site, no front-loaded-then-frozen frames, no bokeh/AI gradients. Caption band (bottom ~17%) stays clear; all text sits in the top ~83%.

## Frame 1 — Logo
- src: compositions/frames/01-logo.html

- scene: Le monogramme KB (nouveau logo, sculpté dans le bois) sur fond ivoire
- duration: 3.5s
- transition_in: cut
- status: outline
- asset_candidates: logo-kb.jpg
- on_screen_text: "KIN BOIS CRÉATION"
- blueprint: titlecard-reveal (Adapt)
- focal: logo-kb.jpg
- roles: logo-kb.jpg = cutout (centered, circular, ~55% of frame width)

Ouverture sur la marque elle-même — le nouveau logo, avant même le site.
Établit l'identité visuelle en un coup d'œil.

Scene 1 (0.0–0.6s): ivoire ground settles, a soft cuivre glow blooms in behind center (`ambient-glow-bloom`).
Scene 2 (0.4–1.4s): the logo pops in centered (`spring-pop-entrance`, long-tail settle, no overshoot), landing at ~55% frame width.
Scene 3 (1.4–2.4s): "KIN BOIS CRÉATION" reveals beneath it, per-word (`dynamic-content-sequencing`), `h3` role in ink.
Scene 4 (2.4–3.5s): fully resolved, held — only the glow's low-amplitude jitter alive (`sine-wave-loop`).

## Frame 2 — Le site s'ouvre
- src: compositions/frames/02-hero.html

- scene: Capture réelle de la page d'accueil du site (fond ébène, titre du hero)
- duration: 4.5s
- transition_in: crossfade
- status: outline
- asset_candidates: capture/screenshots/scroll-000.png
- on_screen_text: (aucun texte ajouté — le titre du hero fait déjà le texte : "D'une bûche à une pièce qui reste.")
- blueprint: compose
- focal: capture/screenshots/scroll-000.png
- roles: capture/screenshots/scroll-000.png = cutout (full-bleed inside a thin cuivre hairline frame, centered, ~92% of frame width, generous ivoire margin)

Le site lui-même prend le relais du logo — premier vrai coup d'œil à l'écran,
comme si on venait d'ouvrir le site sur son téléphone.

Scene 1 (0.0–0.5s): ivoire ground settles, thin cuivre hairline frame draws in (`svg-path-draw`-style rectangle reveal).
Scene 2 (0.3–1.0s): the real hero screenshot fades/scales into the frame (`spring-pop-entrance`, subtle).
Scene 3 (1.0–4.5s): slow, barely-perceptible vertical drift within the screenshot (`multi-phase-camera`, no hard scroll-jump) — holds to the cut, the site's own headline and CTA buttons stay legible throughout.

## Frame 3 — L'artisan
- src: compositions/frames/03-artisan.html

- scene: Capture réelle de la section "L'artisan" (photo de Jeantim + chiffres)
- duration: 3s
- transition_in: crossfade
- status: outline
- asset_candidates: capture/screenshots/scroll-007.png
- on_screen_text: "L'artisan"
- blueprint: compose
- focal: capture/screenshots/scroll-007.png
- roles: capture/screenshots/scroll-007.png = cutout (full-bleed inside the same cuivre hairline frame, centered)

Scene 1 (0.0–0.4s): screenshot cuts in inside the frame, quick push-in begins (`multi-phase-camera`, brisker than Frame 2 to keep the tour moving).
Scene 2 (0.4–3.0s): "L'artisan" pops in as a single beat (`spring-pop-entrance`) lower-third, cuivre `label` role — holds, push-in continues underneath.

## Frame 4 — Le catalogue : chambre & salon
- src: compositions/frames/04-catalogue-un.html

- scene: Capture réelle de la grille catalogue (lits, chevets)
- duration: 3.5s
- transition_in: crossfade
- status: outline
- asset_candidates: capture/screenshots/scroll-018.png
- on_screen_text: "Le catalogue"
- blueprint: compose
- focal: capture/screenshots/scroll-018.png
- roles: capture/screenshots/scroll-018.png = cutout (full-bleed inside the cuivre hairline frame, asymmetric — frame right 62%, left margin for the label)

Premier des deux beats catalogue — casse la symétrie des frames précédentes.

Scene 1 (0.0–0.4s): screenshot enters right ~62% of frame on a slow drift, left margin stays clear ivoire.
Scene 2 (0.4–1.2s): "Le catalogue" reveals per-word in the left margin (`dynamic-content-sequencing`), `h3` role, ink — holds, drift continues underneath.

## Frame 5 — Le catalogue : portes & cuisine
- src: compositions/frames/05-catalogue-deux.html

- scene: Capture réelle de la section cuisine / agencement sur mesure
- duration: 3.5s
- transition_in: crossfade
- status: outline
- asset_candidates: capture/screenshots/scroll-070.png
- on_screen_text: "Sur mesure, pour chaque pièce"
- blueprint: compose
- focal: capture/screenshots/scroll-070.png
- roles: capture/screenshots/scroll-070.png = cutout (full-bleed inside the cuivre hairline frame, asymmetric — frame left 62%, right margin for the label, mirrors Frame 4)

Deuxième beat catalogue, asymétrie inversée pour un effet bookend avec le
Frame 4 — évite que la visite se répète visuellement.

Scene 1 (0.0–0.4s): screenshot enters left ~62% of frame on a slow drift, right margin stays clear ivoire (mirrors Frame 4).
Scene 2 (0.4–1.4s): "Sur mesure, pour chaque pièce" reveals per-word in the right margin, `h3` role, ink — holds, drift continues underneath.

## Frame 6 — Pourquoi me choisir
- src: compositions/frames/06-pourquoi.html

- scene: Capture réelle de la section "Pourquoi me choisir" (icônes + texte)
- duration: 4s
- transition_in: crossfade
- status: outline
- asset_candidates: capture/screenshots/scroll-084.png
- on_screen_text: "Pourquoi me choisir"
- blueprint: compose
- focal: capture/screenshots/scroll-084.png
- roles: capture/screenshots/scroll-084.png = cutout (full-bleed inside the cuivre hairline frame, centered)

Scene 1 (0.0–0.4s): full-bleed cut in, fast push-in (`multi-phase-camera`), centered — the run's brief return to a centered, calmer beat before the reviews.
Scene 2 (0.5–4.0s): "Pourquoi me choisir" pops in (`spring-pop-entrance`) lower-third, cuivre `label` role — holds.

## Frame 7 — Avis clients
- src: compositions/frames/07-avis.html

- scene: Capture réelle de la section avis (fond ébène foncé, témoignage client)
- duration: 4s
- transition_in: crossfade
- status: outline
- asset_candidates: capture/screenshots/scroll-091.png
- on_screen_text: "Travail magnifique et très soigné. Je suis vraiment satisfait de ma commande !" — Jules
- blueprint: compose
- focal: capture/screenshots/scroll-091.png
- roles: capture/screenshots/scroll-091.png = background (full-bleed, dimmed ~35% under an ink scrim so the quote reads clearly on top)

Un vrai avis client, repris en plus grand par-dessus la capture — la preuve
sociale, juste avant l'appel à l'action.

Scene 1 (0.0–0.4s): backdrop screenshot settles under a light ink scrim (dim ~35%) — quiet, no camera motion, the quote carries the beat.
Scene 2 (0.4–2.0s): the quote stacks in centered, two lines (`dynamic-content-sequencing`), `h3` role in ivoire ink-on-dark, then "— Jules" lands beneath in `label`/cuivre.
Scene 3 (2.0–4.0s): fully resolved, held — at most a barely-visible jitter on a thin cuivre underline (`sine-wave-loop`, low amplitude).

## Frame 8 — CTA
- src: compositions/frames/08-cta.html

- scene: Fond ivoire uni, logo, appel à l'action vers le site et WhatsApp
- duration: 5s
- transition_in: crossfade
- status: outline
- asset_candidates: logo-kb.jpg
- on_screen_text: "KIN BOIS CRÉATION\nDécouvrez le site en bio\nDevis gratuit → WhatsApp\n+243 836 002 274"
- blueprint: titlecard-reveal (Reproduce)
- focal: logo-kb.jpg
- roles: logo-kb.jpg = cutout (centered, small, above the wordmark)

Carte de clôture — le logo revient pour boucler la boucle avec le Frame 1,
puis le double appel à l'action : visiter le site (lien en bio) et
WhatsApp pour un devis. Le numéro reste affiché assez longtemps pour être
noté ou capturé en photo d'écran.

Scene 1 (0.0–1.0s): the logo fades/rises up centered in the upper third, a soft cuivre glow blooms in behind it (`ambient-glow-bloom`) and stays low-key for the rest of the frame.
Scene 2 (1.0–2.0s): "KIN BOIS CRÉATION" reveals beneath the logo, `h2` role, ink.
Scene 3 (2.0–3.0s): "Découvrez le site en bio" reveals beneath that, `subtitle` role, cuivre.
Scene 4 (3.0–4.0s): "Devis gratuit → WhatsApp" + the phone number reveal beneath, `body` role, ink — the last piece to land.
Scene 5 (4.0–5.0s): fully resolved, held still to the end — only the glow's low-amplitude jitter alive. This is the film's real exit (no harness transition follows it).
