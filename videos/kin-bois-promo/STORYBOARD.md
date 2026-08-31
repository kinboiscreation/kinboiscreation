---
format: 1080x1920
duration: 22s
message: "Meubles en bois massif, faits main à Kinshasa, sur mesure"
arc: Hook (l'artisan) → Preuve (le geste) → Vitrine (la variété) → Message → CTA
audience: "Particuliers et entreprises à Kinshasa cherchant du mobilier ou de l'agencement sur mesure"
mode: autonomous
music: none
---

## Video direction

- **Palette** (from `frame.md`): canvas = ivoire (`--canvas` #F7F4EE); ink = bois profond (`--ink` #33241A / `--ink-dark` #15110C for dark scrims); accent = cuivre (`--accent` #B87333), used for captions, the CTA line, and glows only — never as a large fill.
- **Motion grammar**: long-tail `power3` eases throughout (smooth, never bouncy/overshoot). Every frame's reveal model is the same: the image enters first via a slow camera move (push-in or drift, `multi-phase-camera`), THEN the on-screen text stacks in on its own beat (per-word stagger, `dynamic-content-sequencing`, or a spring-pop for a one-line label) — text never appears simultaneously with the image cut, and nothing is on screen fully-formed at t=0.
- **Rhythm / held frames**: Frames 3–6 (the showcase beats) run fast and light — quick push, quick label. Frame 7 (the message) and Frame 8 (the CTA) are the deliberate holds/breathers — content resolves early in the window and then sits still, read-ably, no continuing motion beyond a subtle jitter on the accent glow. Framing alternates between centered and asymmetric across Frames 3–6 so the sequence doesn't read as one repeated template.
- **Negative list**: no bokeh / purple-blue "AI" gradients, no UI chrome or cursors (nothing in this film is a product UI), no front-loaded-then-frozen frames, no independently-floating "screensaver" elements — every moving piece is either the camera, the photo, or the caption text. Caption band (bottom ~17%) stays clear on every frame; all text sits in the top ~83%.

## Frame 1 — Hook : l'artisan
- src: compositions/frames/01-hook.html

- scene: Portrait de Jeantim dans son atelier, regard caméra
- duration: 2.5s
- transition_in: cut
- status: outline
- asset_candidates: artisan-jeantim.webp
- on_screen_text: "Je m'appelle Jeantim."
- blueprint: compose
- focal: artisan-jeantim.webp
- roles: artisan-jeantim.webp = cutout (full-bleed, top ~83%, softly vignetted at the very edges only)

Ouverture sur un visage, pas un produit. Établit tout de suite qu'il y a une
vraie personne derrière la marque.

Scene 1 (0.0–0.6s): full-bleed portrait cuts in, camera begins a slow push-in (`multi-phase-camera`) that continues under the whole frame — centered, primary subject ~60% of frame height.
Scene 2 (0.6–2.5s): as the push settles, "Je m'appelle Jeantim." stacks in word-by-word (`dynamic-content-sequencing`) in the lower-middle third, ink-on-ivoire pill or plain type in `label`/`h3` role, cuivre accent underline draws in beneath on the last word — holds to the cut, push-in continues at a barely-perceptible rate (no lazy breathing).

## Frame 2 — Le geste
- src: compositions/frames/02-geste.html

- scene: Lit en bois massif à tête sculptée, gros plan sur la finition
- duration: 2.5s
- transition_in: crossfade
- status: outline
- asset_candidates: lit-tete-de-lit-sculptee-showroom.webp
- on_screen_text: "Chaque pièce, faite à la main"
- blueprint: compose
- focal: lit-tete-de-lit-sculptee-showroom.webp
- roles: lit-tete-de-lit-sculptee-showroom.webp = cutout (full-bleed, centered, top ~83%)

Premier produit : la pièce la plus visuellement forte du catalogue, pour
capter l'attention dans les 5 premières secondes (règle TikTok).

Scene 1 (0.0–0.5s): full-bleed product shot enters on a slow lateral drift (`multi-phase-camera`), centered framing, ~70% of frame height.
Scene 2 (0.8–2.5s): "Chaque pièce, faite à la main" reveals per-word in the upper third, `h3` role in ink over a soft ivoire scrim strip so it reads against the wood grain — holds, drift continues at the same slow rate underneath.

## Frame 3 — Vitrine : le bois
- src: compositions/frames/03-vitrine-bois.html

- scene: Buffet vitré, portes en verre, tiroirs
- duration: 2.2s
- transition_in: crossfade
- status: outline
- asset_candidates: buffet-vitre-en-bois-avec-portes-vitrees-et-tiroirs.webp
- on_screen_text: "Bois massif"
- blueprint: compose
- focal: buffet-vitre-en-bois-avec-portes-vitrees-et-tiroirs.webp
- roles: buffet-vitre-en-bois-avec-portes-vitrees-et-tiroirs.webp = cutout (full-bleed, centered)

Scene 1 (0.0–0.4s): full-bleed cut in, fast push-in begins immediately (`multi-phase-camera`, quicker than Frames 1–2 to keep the showcase run brisk) — centered, ~65% of frame.
Scene 2 (0.4–2.2s): "Bois massif" pops in as a single beat (`spring-pop-entrance`, subtle — long-tail settle, no overshoot) lower-third, cuivre `label` role — holds, push-in continues underneath.

## Frame 4 — Vitrine : les portes
- src: compositions/frames/04-vitrine-portes.html

- scene: Porte double en acajou verni, poignée métallique
- duration: 2.2s
- transition_in: crossfade
- status: outline
- asset_candidates: porte-double-en-bois-acajou-avec-poignee-metallique.webp
- on_screen_text: "Portes sur mesure"
- blueprint: compose
- focal: porte-double-en-bois-acajou-avec-poignee-metallique.webp
- roles: porte-double-en-bois-acajou-avec-poignee-metallique.webp = cutout (asymmetric 60/40, image right)

Asymmetric framing to break the centered rhythm of Frames 1–3.

Scene 1 (0.0–0.4s): image enters right 60% of frame on a slow drift, left 40% stays as clear ivoire margin.
Scene 2 (0.4–1.2s): "Portes sur mesure" reveals per-word in the left margin, `h3` role, ink — holds, drift continues underneath.

## Frame 5 — Vitrine : l'agencement
- src: compositions/frames/05-vitrine-agencement.html

- scene: Cuisine équipée en bois massif, moulures et poignées dorées
- duration: 2.2s
- transition_in: crossfade
- status: outline
- asset_candidates: cuisine-bois-moulures-dorees.webp
- on_screen_text: "Cuisines & agencement"
- blueprint: compose
- focal: cuisine-bois-moulures-dorees.webp
- roles: cuisine-bois-moulures-dorees.webp = cutout (full-bleed, centered)

Scene 1 (0.0–0.4s): full-bleed cut in, fast push-in (`multi-phase-camera`), centered, ~65% of frame — the most "finished/high-end" shot in the run, given a touch more of a push to land as the mid-run high point.
Scene 2 (0.5–2.2s): "Cuisines & agencement" pops in (`spring-pop-entrance`) lower-third, cuivre `label` role — holds.

## Frame 6 — Vitrine : la variété
- src: compositions/frames/06-vitrine-variete.html

- scene: Canapé d'angle beige avec pouf orange
- duration: 2.2s
- transition_in: crossfade
- status: outline
- asset_candidates: canape-d-angle-beige-avec-pouf-orange.webp
- on_screen_text: "Et bien plus encore"
- blueprint: compose
- focal: canape-d-angle-beige-avec-pouf-orange.webp
- roles: canape-d-angle-beige-avec-pouf-orange.webp = cutout (asymmetric 60/40, image left, mirrors Frame 4)

Une pièce non-bois-brut, pour montrer que le catalogue ne se limite pas aux
meubles massifs — casse l'attente juste avant le message central.

Scene 1 (0.0–0.4s): image enters left 60% of frame on a slow drift, right 40% stays as clear ivoire margin (mirrors Frame 4's asymmetry for a bookend feel).
Scene 2 (0.4–1.4s): "Et bien plus encore" reveals per-word in the right margin, `h3` role, ink — holds, drift continues underneath.

## Frame 7 — Le message
- src: compositions/frames/07-message.html

- scene: Portes vernies en série, texte pleine largeur par-dessus
- duration: 3s
- transition_in: crossfade
- status: outline
- asset_candidates: trois-portes-en-bois-verni-appuyees-contre-un-mur.webp
- on_screen_text: "Meubles en bois massif,\nfaits main à Kinshasa,\nsur mesure."
- blueprint: titlecard-reveal (Adapt)
- focal: trois-portes-en-bois-verni-appuyees-contre-un-mur.webp
- roles: trois-portes-en-bois-verni-appuyees-contre-un-mur.webp = background (full-bleed, dimmed ~50% under an ink scrim)

Adapt: keep titlecard-reveal's calm, held-stillness signature, but land it
over a dimmed real photo instead of a flat card — the thesis statement of
the whole video, alone, with room to breathe.

Scene 1 (0.0–0.5s): backdrop photo settles under an ink scrim (dim to ~50%) — no camera motion here, the backdrop is deliberately quiet so the text can carry the beat.
Scene 2 (0.5–2.0s): the three lines stack in centered, one per beat (`dynamic-content-sequencing`), `display`/`h1` role in ivoire ink-on-dark, each line landing and staying — this is the video's held climax.
Scene 3 (2.0–3.0s): fully resolved, held completely still — at most a barely-visible jitter on the cuivre underline beneath the last line (`sine-wave-loop`, low amplitude). No further motion.

## Frame 8 — CTA
- src: compositions/frames/08-cta.html

- scene: Fond ivoire uni, logo/nom de marque, appel à l'action
- duration: 4s
- transition_in: crossfade
- status: outline
- asset_candidates: (aucune photo — carte de titre sur fond de marque)
- on_screen_text: "KIN BOIS CRÉATION\nDevis gratuit → WhatsApp\n+243 964 459 228"
- blueprint: titlecard-reveal (Reproduce)
- focal: none (text-only close)
- roles: none

Carte de clôture texte pur — repos visuel après le montage, et le numéro
reste lisible assez longtemps pour être noté ou capturé en photo d'écran.
Reproduces titlecard-reveal's end-card chain: statement → CTA line →
wordmark, adapted to wordmark → CTA line → phone.

Scene 1 (0.0–1.0s): solid ivoire canvas; "KIN BOIS CRÉATION" fades/rises up centered in the upper-middle, `h2` role, ink; a soft cuivre glow blooms in behind it (`ambient-glow-bloom`) and stays low-key for the rest of the frame.
Scene 2 (1.0–2.2s): "Devis gratuit → WhatsApp" reveals beneath the wordmark (single fade + slight rise), `subtitle` role, cuivre accent color.
Scene 3 (2.2–3.2s): "+243 964 459 228" reveals beneath that, `body` role, ink — the last piece to land.
Scene 4 (3.2–4.0s): fully resolved, held still to the end — the glow's low-amplitude jitter is the only motion left alive. This is the film's real exit (no harness transition follows it).
