/* ============================================================
   BIBLIOTHÈQUE D'EFFETS — Kin Bois Création
   Pilote les effets qui ont besoin de JavaScript.
   Aucune dépendance. À charger avec `defer`.

     <script src="effets/effets.js" defer></script>

   Tout est initialisé automatiquement au chargement.
     Effets.init()     réinstalle après un ajout de contenu
     Effets.destroy()  retire tout : écouteurs, observateurs,
                       éléments créés et marques internes

   Écrit en JavaScript moderne (ES2022). Ce qui est délégué au
   navigateur plutôt que réécrit à la main :

   1. `animation-timeline` : la parallaxe et le dézoom sont
      animés en CSS. La classe `fx-scroll-natif` est posée sur
      <html> et les boucles de défilement en JS s'effacent.
   2. <dialog> : lightbox et modale héritent d'Échap, du piège
      à focus et du fond assombri.
   3. View Transitions : le filtrage de grille fait glisser les
      cartes à leur nouvelle place sans calcul de position.
   4. `:user-valid` / `:user-invalid` : la validation des
      formulaires se fait en CSS, sans un octet de JavaScript.
   5. AbortController : tous les écouteurs partagent un signal,
      ce qui rend `destroy()` fiable.

   Le script reste un script classique, pas un module ES, pour
   fonctionner aussi en ouvrant le fichier depuis le disque.
   ============================================================ */
(() => {
  'use strict';

  /* --- Préférences du visiteur, relues à chaque appel --------- */
  const motionQuery  = matchMedia('(prefers-reduced-motion: reduce)');
  const pointerQuery = matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = () => motionQuery.matches;
  const fine    = () => pointerQuery.matches;

  /* --- Raccourcis -------------------------------------------- */
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));
  const nombreFr = new Intl.NumberFormat('fr-FR');

  /* --- Cycle de vie ------------------------------------------
     Un seul contrôleur pour tous les écouteurs : `destroy()`
     les coupe d'un coup, sans retenir chaque fonction.          */
  let ac = new AbortController();
  let observers = [];
  let created = [];
  let claimed = [];

  const on = (el, ev, fn, opts = {}) =>
    el.addEventListener(ev, fn, { ...opts, signal: ac.signal });

  const observe = (obs) => { observers.push(obs); return obs; };
  const born = (el) => { created.push(el); return el; };

  /** Marque un élément comme traité. Renvoie false s'il l'était déjà.
   *  Chaque effet a sa propre clé : un même élément peut donc en
   *  porter plusieurs sans que l'un empêche l'autre. */
  const claim = (el, key) => {
    if (el.dataset[key]) return false;
    el.dataset[key] = '1';
    claimed.push([el, key]);
    return true;
  };

  /* Le navigateur sait-il animer au défilement tout seul ? */
  const nativeScroll = CSS.supports('animation-timeline: view()');
  if (nativeScroll) document.documentElement.classList.add('fx-scroll-natif');

  /* --- Suivi du curseur --------------------------------------
     Pose --mx/--my (position en %) et --px/--py (écart au centre,
     de -0.5 à 0.5) sur l'élément survolé.                       */
  const trackPointer = (el) => {
    if (!claim(el, 'fxTrack')) return;
    let raf = null;
    on(el, 'pointermove', ({ clientX, clientY }) => {
      const r = el.getBoundingClientRect();
      const px = (clientX - r.left) / r.width;
      const py = (clientY - r.top) / r.height;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--mx', `${px * 100}%`);
        el.style.setProperty('--my', `${py * 100}%`);
        el.style.setProperty('--px', (px - 0.5).toFixed(3));
        el.style.setProperty('--py', (py - 0.5).toFixed(3));
      });
    });
    on(el, 'pointerleave', () => {
      cancelAnimationFrame(raf);
      el.style.setProperty('--px', '0');
      el.style.setProperty('--py', '0');
    });
  };

  /** Déclenche `run(el)` quand l'élément entre dans l'écran, une
   *  seule fois. Filet de sécurité : si l'observation échoue, le
   *  contenu s'affiche quand même au bout de 2,5 s. */
  const onSeen = (targets, run, { threshold = 0.25, safety = 2500 } = {}) => {
    if (!targets.length) return;
    const fire = (el) => { if (claim(el, 'fxSeen')) run(el); };
    if (reduced() || !('IntersectionObserver' in window)) {
      targets.forEach(fire);
      return;
    }
    const io = observe(new IntersectionObserver((entries) => {
      for (const { isIntersecting, target } of entries) {
        if (isIntersecting) { fire(target); io.unobserve(target); }
      }
    }, { threshold }));
    targets.forEach((t) => io.observe(t));
    setTimeout(() => targets.forEach(fire), safety);
  };

  /** Sentinelle d'un pixel : dit si l'on a dépassé un point de la
   *  page, sans jamais écouter le défilement. */
  const sentinelle = (parent, cb) => {
    const m = born(document.createElement('div'));
    m.style.cssText = 'position:absolute;top:0;left:0;height:1px;width:1px;pointer-events:none;';
    m.setAttribute('aria-hidden', 'true');
    parent.prepend(m);
    observe(new IntersectionObserver(([e]) => cb(!e.isIntersecting))).observe(m);
  };

  /* Numérote les enfants (--si) pour échelonner les délais. */
  const indexChildren = () => {
    for (const box of $$('.fx-stagger, .fx-curtain, .fx-menu-liens, .fx-timeline')) {
      [...box.children].forEach((c, i) => c.style.setProperty('--si', i));
    }
  };

  /* ── 1, 4, 12, 16, 20 · suivi du curseur ──────────────────── */
  const initPointer = () => {
    if (reduced() || !fine()) return;
    $$('.fx-parallax .fx-card, .fx-glass .fx-card, .fx-spotlight,' +
       '.fx-tilt .fx-card, .fx-loupe').forEach(trackPointer);
  };

  /* ── 7 · lightbox (sur <dialog>) ──────────────────────────── */
  const initLightbox = () => {
    for (const box of $$('.fx-lightbox')) {
      if (!claim(box, 'fxLb')) continue;
      const cards = $$('.fx-card', box);
      if (!cards.length) continue;

      const dlg = born(document.createElement('dialog'));
      dlg.className = 'fx-lb';
      dlg.innerHTML =
        '<button class="fx-lb-x" aria-label="Fermer">✕</button>' +
        '<button class="fx-lb-nav prev" aria-label="Précédent">‹</button>' +
        '<button class="fx-lb-nav next" aria-label="Suivant">›</button>' +
        // pixel transparent : évite une requête vide avant la 1re ouverture
        '<img alt="" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==">' +
        '<p class="fx-lb-cap"></p>';
      document.body.append(dlg);

      const img = $('img', dlg);
      const cap = $('.fx-lb-cap', dlg);
      let i = 0;

      const show = (n) => {
        i = (n + cards.length) % cards.length;
        const src = $('img', cards[i]);
        img.src = src.src;
        img.alt = src.alt ?? '';
        const titre = $('b', cards[i])?.textContent ?? '';
        const sous  = $('.fx-cap span', cards[i])?.textContent;
        cap.textContent = `${titre}${sous ? ` — ${sous}` : ''}   (${i + 1}/${cards.length})`;
        img.style.animation = 'none';
        void img.offsetWidth;
        img.style.animation = '';
      };

      cards.forEach((c, n) => on(c, 'click', () => {
        show(n);
        dlg.showModal();          // Échap + piège à focus + fond : natifs
      }));
      on($('.fx-lb-x', dlg), 'click', () => dlg.close());
      on($('.prev', dlg), 'click', () => show(i - 1));
      on($('.next', dlg), 'click', () => show(i + 1));
      on(dlg, 'click', (e) => { if (e.target === dlg) dlg.close(); });
      on(dlg, 'keydown', (e) => {
        if (e.key === 'ArrowLeft')  show(i - 1);
        if (e.key === 'ArrowRight') show(i + 1);
      });
    }
  };

  /* ── 8 & 29 · effets pilotés par la position dans la page ───
     Ne tourne que si le navigateur ne sait pas le faire en CSS. */
  const initScroll = () => {
    for (const col of $$('.fx-scroll-parallax .fx-col')) {
      col.style.setProperty('--fx-speed', parseFloat(col.dataset.speed) || 0);
    }
    if (nativeScroll || reduced()) return;

    const cols  = $$('.fx-scroll-parallax .fx-col');
    const zooms = $$('.fx-zoomout');
    if (!cols.length && !zooms.length) return;

    let raf = null;
    const tick = () => {
      const vh = innerHeight;
      for (const col of cols) {
        const r = col.getBoundingClientRect();
        const prog = (vh - r.top) / (vh + r.height);   // 0 → 1 à la traversée
        const sp = parseFloat(col.dataset.speed) || 0; // px, négatif = monte
        col.style.transform = `translateY(${((prog - 0.5) * sp).toFixed(1)}px)`;
      }
      for (const z of zooms) {
        const r = z.getBoundingClientRect();
        const prog = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
        z.style.setProperty('--fx-z', (1.28 - 0.28 * prog).toFixed(3));
      }
      raf = null;
    };
    on(window, 'scroll', () => { raf ??= requestAnimationFrame(tick); }, { passive: true });
    tick();
  };

  /* ── 10 · découpe le titre en mots masqués ────────────────── */
  const buildWords = () => {
    for (const el of $$('[data-reveal]')) {
      if (!claim(el, 'fxWords')) continue;
      el.innerHTML = el.dataset.reveal
        .split(' ')
        .map((w, i) => `<span class="fx-w" style="--wi:${i}"><i>${w}</i></span>`)
        .join(' ');
    }
  };

  /* ── 13 · découpe le texte en lignes (séparateur « | ») ───── */
  const buildCut = () => {
    for (const el of $$('[data-cut]')) {
      if (!claim(el, 'fxCut')) continue;
      el.innerHTML = el.dataset.cut
        .split('|')
        .map((l, i) => `<span style="--ci:${i}">${l}</span>`)
        .join('<br>');
    }
  };

  /* ── révélations au défilement ────────────────────────────── */
  const initReveal = () => {
    onSeen(
      $$('.fx-words, .fx-unfurl, .fx-cut, .fx-curtain, .fx-mosaic,' +
         '.fx-stagger, .fx-sweep, .fx-timeline, .fx-draw'),
      (t) => t.classList.add('seen')
    );
  };

  /* ── 14 · comparateur avant / après ───────────────────────── */
  const initCompare = () => {
    for (const box of $$('.fx-compare')) {
      if (!claim(box, 'fxCompare')) continue;

      if (!$('.fx-handle', box)) {
        const h = document.createElement('span');
        h.className = 'fx-handle';
        box.append(h);
      }
      box.tabIndex = 0;
      box.setAttribute('role', 'slider');
      box.setAttribute('aria-label', 'Comparer avant et après');
      box.setAttribute('aria-valuemin', '0');
      box.setAttribute('aria-valuemax', '100');

      let down = false;
      const put = (pct) => {
        const v = Math.min(100, Math.max(0, pct));
        box.style.setProperty('--cut', `${v.toFixed(1)}%`);
        box.setAttribute('aria-valuenow', Math.round(v));
      };
      const fromX = (x) => {
        const r = box.getBoundingClientRect();
        put(((x - r.left) / r.width) * 100);
      };
      put(50);

      on(box, 'pointerdown', (e) => {
        down = true;
        box.setPointerCapture(e.pointerId);
        fromX(e.clientX);
      });
      on(box, 'pointermove', (e) => { if (down) fromX(e.clientX); });
      for (const ev of ['pointerup', 'pointercancel']) {
        on(box, ev, () => { down = false; });
      }
      on(box, 'keydown', (e) => {
        const step = e.key === 'ArrowLeft' ? -4 : e.key === 'ArrowRight' ? 4 : 0;
        if (!step) return;
        e.preventDefault();
        put((parseFloat(box.style.getPropertyValue('--cut')) || 50) + step);
      });
    }
  };

  /* ── 15 & 28 · bandes défilantes ──────────────────────────
     Le contenu est dupliqué : la boucle devient invisible.    */
  const initMarquee = () => {
    for (const box of $$('.fx-marquee, .fx-ticker')) {
      if (!claim(box, 'fxMarquee')) continue;

      let track = $('.fx-track', box);
      if (!track) {
        track = document.createElement('div');
        track.className = 'fx-track';
        track.append(...box.childNodes);
        box.append(track);
      }
      let set = $('.fx-set', track);
      if (!set) {
        set = document.createElement('div');
        set.className = 'fx-set';
        set.append(...track.childNodes);
        track.append(set);
      }
      if ($$('.fx-set', track).length < 2) {
        const copy = set.cloneNode(true);
        copy.setAttribute('aria-hidden', 'true');
        track.append(copy);
      }
      if (box.dataset.speed) box.style.setProperty('--fx-dur', `${box.dataset.speed}s`);
    }
  };

  /* ── 16 · loupe sur le grain du bois ──────────────────────── */
  const initLoupe = () => {
    if (!fine() || reduced()) return;
    for (const box of $$('.fx-loupe')) {
      if (!claim(box, 'fxLoupe')) continue;
      const img = $('img', box);
      if (!img) continue;

      const lens = born(document.createElement('div'));
      lens.className = 'fx-lens';
      box.append(lens);

      const zoom = parseFloat(box.dataset.zoom) || 2.4;
      const size = () => {
        const { width, height } = box.getBoundingClientRect();
        const src = (img.currentSrc || img.src).replaceAll('"', '%22');
        lens.style.backgroundImage = `url("${src}")`;
        lens.style.backgroundSize = `${width * zoom}px ${height * zoom}px`;
      };
      on(box, 'pointerenter', size);
      observe(new ResizeObserver(size)).observe(box);
    }
  };

  /* ── 18 · rail horizontal : glisser à la souris ───────────── */
  const initRail = () => {
    for (const rail of $$('.fx-rail')) {
      if (!claim(rail, 'fxRail')) continue;

      let down = false, startX = 0, startLeft = 0, moved = false;
      on(rail, 'pointerdown', (e) => {
        if (e.pointerType === 'touch') return;   // le défilement natif suffit
        down = true; moved = false;
        startX = e.clientX; startLeft = rail.scrollLeft;
        rail.setPointerCapture(e.pointerId);
      });
      on(rail, 'pointermove', (e) => {
        if (!down) return;
        const d = e.clientX - startX;
        if (Math.abs(d) > 4) { moved = true; rail.classList.add('fx-drag'); }
        rail.scrollLeft = startLeft - d;
      });
      for (const ev of ['pointerup', 'pointercancel']) {
        on(rail, ev, () => { down = false; rail.classList.remove('fx-drag'); });
      }
      on(rail, 'click', (e) => {
        if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
      }, { capture: true });
    }
  };

  /* ── 22 · compteur animé ──────────────────────────────────── */
  const initCount = () => {
    onSeen($$('[data-to]'), (el) => {
      const to = parseFloat(el.dataset.to) || 0;
      const suffix = el.dataset.suffix ?? '';
      if (reduced()) { el.textContent = nombreFr.format(to) + suffix; return; }
      const dur = 1400;
      const t0 = performance.now();
      const step = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        el.textContent = nombreFr.format(Math.round(to * (1 - (1 - p) ** 3))) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  };

  /* ── 23 · bouton magnétique ───────────────────────────────── */
  const initMagnet = () => {
    if (reduced() || !fine()) return;
    for (const el of $$('.fx-magnet')) {
      if (!claim(el, 'fxMagnet')) continue;
      const force = parseFloat(el.dataset.strength) || 0.32;
      on(el, 'pointermove', ({ clientX, clientY }) => {
        const r = el.getBoundingClientRect();
        const x = (clientX - r.left - r.width / 2) * force;
        const y = (clientY - r.top - r.height / 2) * force;
        el.classList.add('fx-pull');
        el.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;
      });
      on(el, 'pointerleave', () => {
        el.classList.remove('fx-pull');
        el.style.transform = '';
      });
    }
  };

  /* ── 25 · tuiles de la mosaïque (vague en diagonale) ──────── */
  const buildMosaic = () => {
    const cols = 6, rows = 4;
    for (const frame of $$('.fx-mosaic .fx-frame')) {
      if ($('.fx-tiles', frame)) continue;
      const tiles = born(document.createElement('div'));
      tiles.className = 'fx-tiles';
      tiles.setAttribute('aria-hidden', 'true');
      tiles.innerHTML = Array.from({ length: rows * cols }, (_, n) =>
        `<i style="--ti:${Math.floor(n / cols) + (n % cols)}"></i>`).join('');
      frame.append(tiles);
    }
  };

  /* ── 26 · machine à écrire (phrases séparées par « | ») ───── */
  const initTyped = () => {
    for (const el of $$('[data-type]')) {
      if (!claim(el, 'fxTyped')) continue;
      const list = el.dataset.type.split('|').filter(Boolean);
      if (!list.length) continue;

      const out = document.createElement('span');
      const caret = document.createElement('span');
      caret.className = 'fx-caret';
      caret.setAttribute('aria-hidden', 'true');
      el.replaceChildren(out, caret);

      if (reduced()) { out.textContent = list[0]; continue; }

      const signal = ac.signal;     // capté ici : destroy() arrête la boucle
      (async () => {
        let i = 0;
        while (!signal.aborted) {
          const mot = list[i];
          for (let n = 1; n <= mot.length && !signal.aborted; n++) {
            out.textContent = mot.slice(0, n);
            await delay(85);
          }
          await delay(1600);
          for (let n = mot.length; n >= 0 && !signal.aborted; n--) {
            out.textContent = mot.slice(0, n);
            await delay(45);
          }
          await delay(320);
          i = (i + 1) % list.length;
        }
      })();
    }
  };

  /* ── 31 · curseur personnalisé (point + anneau) ───────────── */
  const initCursor = () => {
    const host = $('.fx-cursor');
    if (!host || !fine() || reduced() || !claim(host, 'fxCursor')) return;

    const dot  = born(document.createElement('div'));
    const ring = born(document.createElement('div'));
    dot.className = 'fx-cur-dot';
    ring.className = 'fx-cur-ring';
    for (const el of [dot, ring]) el.setAttribute('aria-hidden', 'true');
    host.append(dot, ring);

    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
    on(window, 'pointermove', (e) => {
      x = e.clientX; y = e.clientY;
      dot.style.translate = `${x}px ${y}px`;
      // posé sur <body>, le curseur vaut pour tout le site ;
      // posé sur une section, il ne vaut que là
      const dedans = host === document.body || host.contains(e.target);
      dot.classList.toggle('fx-visible', dedans);
      ring.classList.toggle('fx-visible', dedans);
      ring.classList.toggle('fx-on',
        !!e.target?.closest?.('a, button, .fx-card, [role="slider"]'));
    }, { passive: true });

    const signal = ac.signal;
    const follow = () => {
      if (signal.aborted) return;
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      ring.style.translate = `${rx}px ${ry}px`;
      requestAnimationFrame(follow);
    };
    follow();
  };

  /* ── 32 · traînée de photos au curseur ────────────────────── */
  const initTrail = () => {
    for (const zone of $$('.fx-trail')) {
      if (!claim(zone, 'fxTrail') || !fine() || reduced()) continue;
      const sources = (zone.dataset.images ?? '').split('|').filter(Boolean);
      if (!sources.length) continue;

      const pool = sources.map((src) => {
        const img = born(document.createElement('img'));
        img.src = src;
        img.alt = '';
        img.setAttribute('aria-hidden', 'true');
        zone.append(img);
        return img;
      });

      let n = 0, lastX = 0, lastY = 0;
      on(zone, 'pointermove', (e) => {
        const r = zone.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        // une image tous les 90 px parcourus, sinon c'est illisible
        if (Math.hypot(x - lastX, y - lastY) < 90) return;
        lastX = x; lastY = y;
        const img = pool[n % pool.length];
        n += 1;
        img.style.translate = `${x}px ${y}px`;
        img.style.rotate = `${(Math.random() * 18 - 9).toFixed(1)}deg`;
        img.classList.remove('fx-on');
        void img.offsetWidth;
        img.classList.add('fx-on');
      });
    }
  };

  /* ── 34 · en-tête qui se condense ─────────────────────────── */
  const initShrink = () => {
    for (const head of $$('.fx-shrink')) {
      if (!claim(head, 'fxShrink')) continue;
      sentinelle(head.parentNode, (passe) => head.classList.toggle('fx-condense', passe));
    }
  };

  /* ── 35 · menu plein écran ────────────────────────────────── */
  const initMenu = () => {
    for (const menu of $$('.fx-menu')) {
      if (!claim(menu, 'fxMenu')) continue;
      const open  = $('.fx-menu-ouvrir', menu);
      const panel = $('.fx-menu-panneau', menu);
      if (!open || !panel) continue;

      const setOpen = (val) => {
        menu.classList.toggle('fx-on', val);
        open.setAttribute('aria-expanded', String(val));
        panel.inert = !val;                 // le contenu masqué sort du focus
        document.body.style.overflow = val ? 'hidden' : '';
      };
      setOpen(false);

      open.setAttribute('aria-controls', panel.id ||= 'fx-menu-panneau');
      on(open, 'click', () => setOpen(!menu.classList.contains('fx-on')));
      const fermer = $('.fx-menu-fermer', menu);
      if (fermer) on(fermer, 'click', () => setOpen(false));
      for (const a of $$('a', panel)) on(a, 'click', () => setOpen(false));
      on(window, 'keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('fx-on')) setOpen(false);
      });
    }
  };

  /* ── 36 · écran de chargement ─────────────────────────────── */
  const initPreload = () => {
    const box = $('.fx-preload');
    if (!box || !claim(box, 'fxPreload')) return;
    const num = $('.fx-preload-num', box);

    if (reduced()) { box.remove(); return; }

    const partir = () => {
      box.classList.add('fx-parti');
      on(box, 'transitionend', () => box.remove(), { once: true });
      setTimeout(() => box.remove(), 1200);   // filet de sécurité
    };

    let p = 0;
    const t = setInterval(() => {
      p = Math.min(100, p + Math.random() * 18);
      if (num) num.textContent = `${Math.round(p)} %`;
      if (p >= 100) { clearInterval(t); setTimeout(partir, 260); }
    }, 130);
    on(window, 'fx-destroy', () => clearInterval(t));
  };

  /* 37 · transition de page — aucun JS : c'est la règle CSS
     `@view-transition{navigation:auto}` qui fait tout. */

  /* ── 39 · onglets ─────────────────────────────────────────── */
  const initTabs = () => {
    for (const box of $$('.fx-tabs')) {
      if (!claim(box, 'fxTabs')) continue;
      const tabs = $$('[role="tab"]', box);
      const panels = $$('[role="tabpanel"]', box);
      if (!tabs.length) continue;

      const select = (n) => {
        tabs.forEach((t, i) => {
          const val = i === n;
          t.setAttribute('aria-selected', String(val));
          t.tabIndex = val ? 0 : -1;
          panels[i]?.toggleAttribute('hidden', !val);
        });
        const t = tabs[n];
        box.style.setProperty('--fx-tab-x', `${t.offsetLeft}px`);
        box.style.setProperty('--fx-tab-w', `${t.offsetWidth}px`);
      };

      tabs.forEach((t, i) => {
        on(t, 'click', () => select(i));
        on(t, 'keydown', (e) => {
          const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
          if (!d) return;
          e.preventDefault();
          const next = (i + d + tabs.length) % tabs.length;
          select(next);
          tabs[next].focus();
        });
      });
      select(0);
      observe(new ResizeObserver(() => {
        const n = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
        if (n >= 0) select(n);
      })).observe(box);
    }
  };

  /* ── 41 · modale (sur <dialog>) ───────────────────────────── */
  const initModal = () => {
    for (const btn of $$('[data-modal]')) {
      if (!claim(btn, 'fxModal')) continue;
      const dlg = document.getElementById(btn.dataset.modal);
      if (!(dlg instanceof HTMLDialogElement)) continue;
      on(btn, 'click', () => dlg.showModal());
      const x = $('.fx-modal-x', dlg);
      if (x) on(x, 'click', () => dlg.close());
      on(dlg, 'click', (e) => { if (e.target === dlg) dlg.close(); });
    }
  };

  /* ── 43 · texte qui se décode ─────────────────────────────── */
  const initScramble = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&/*+';
    onSeen($$('[data-scramble]'), (el) => {
      const final = el.dataset.scramble;
      if (reduced()) { el.textContent = final; return; }
      const signal = ac.signal;
      let frame = 0;
      const run = () => {
        if (signal.aborted) { el.textContent = final; return; }
        el.textContent = [...final].map((c, i) => {
          if (c === ' ') return ' ';
          // chaque lettre se fige à son tour, de gauche à droite
          if (frame / 2 > i) return final[i];
          return chars[(Math.random() * chars.length) | 0];
        }).join('');
        frame += 1;
        if (frame / 2 <= final.length) requestAnimationFrame(run);
        else el.textContent = final;
      };
      run();
    });
  };

  /* ── 44 · lettres qui se soulèvent au survol ──────────────── */
  const buildLetters = () => {
    for (const el of $$('[data-letters]')) {
      if (!claim(el, 'fxLetters')) continue;
      el.setAttribute('aria-label', el.dataset.letters);
      el.innerHTML = [...el.dataset.letters]
        .map((c, i) => c === ' '
          ? ' '
          : `<span aria-hidden="true" style="--li:${i}">${c}</span>`)
        .join('');
    }
  };

  /* ── 50 · zone de dépôt de fichier ────────────────────────── */
  const initDrop = () => {
    for (const zone of $$('.fx-drop')) {
      if (!claim(zone, 'fxDrop')) continue;
      const input = $('input[type=file]', zone);
      if (!input) continue;
      const liste = $('.fx-drop-liste', zone);

      const montrer = (files) => {
        if (!liste) return;
        liste.textContent = files.length
          ? [...files].map((f) => f.name).join(' · ')
          : '';
      };
      for (const ev of ['dragenter', 'dragover']) {
        on(zone, ev, (e) => { e.preventDefault(); zone.classList.add('fx-survol'); });
      }
      for (const ev of ['dragleave', 'drop']) {
        on(zone, ev, () => zone.classList.remove('fx-survol'));
      }
      on(zone, 'drop', (e) => {
        e.preventDefault();
        input.files = e.dataTransfer.files;   // le champ reçoit vraiment les fichiers
        montrer(input.files);
      });
      on(input, 'change', () => montrer(input.files));
    }
  };

  /* ── 51 · curseur de valeur ───────────────────────────────── */
  const initRange = () => {
    for (const box of $$('.fx-range')) {
      if (!claim(box, 'fxRange')) continue;
      const input = $('input[type=range]', box);
      if (!input) continue;
      const sortie = $('output', box);

      const maj = () => {
        const min = +input.min || 0;
        const max = +input.max || 100;
        box.style.setProperty('--fx-pct', `${((input.value - min) / (max - min)) * 100}%`);
        if (sortie) sortie.textContent = nombreFr.format(input.value) + (box.dataset.unite ?? '');
      };
      on(input, 'input', maj);
      maj();
    }
  };

  /* ── 53 · formulaire en plusieurs étapes ──────────────────── */
  const initSteps = () => {
    for (const box of $$('.fx-steps')) {
      if (!claim(box, 'fxSteps')) continue;
      const etapes   = $$('.fx-steps-liste li', box);
      const panneaux = $$('.fx-steps-panneau', box);
      const prec = $('.fx-steps-prec', box);
      const suiv = $('.fx-steps-suiv', box);
      if (etapes.length < 2) continue;

      let n = 0;
      const aller = (i) => {
        n = Math.min(etapes.length - 1, Math.max(0, i));
        etapes.forEach((e, k) => {
          e.classList.toggle('fx-faite', k < n);
          e.classList.toggle('fx-active', k === n);
          if (k === n) e.setAttribute('aria-current', 'step');
          else e.removeAttribute('aria-current');
        });
        panneaux.forEach((p, k) => p.toggleAttribute('hidden', k !== n));
        if (prec) prec.disabled = n === 0;
        if (suiv) suiv.disabled = n === etapes.length - 1;
        box.style.setProperty('--fx-avance', `${(n / (etapes.length - 1)) * 100}%`);
      };
      if (prec) on(prec, 'click', () => aller(n - 1));
      if (suiv) on(suiv, 'click', () => aller(n + 1));
      aller(0);
    }
  };

  /* ── 54 · notification passagère ──────────────────────────── */
  const initToast = () => {
    for (const btn of $$('[data-toast]')) {
      if (!claim(btn, 'fxToast')) continue;
      on(btn, 'click', () => {
        let pile = $('.fx-toast-pile');
        if (!pile) {
          pile = born(document.createElement('div'));
          pile.className = 'fx-toast-pile';
          document.body.append(pile);
        }
        const t = document.createElement('div');
        t.className = 'fx-toast';
        t.setAttribute('role', 'status');      // annoncé sans voler le focus
        t.textContent = btn.dataset.toast;
        pile.append(t);
        requestAnimationFrame(() => t.classList.add('fx-on'));
        setTimeout(() => {
          t.classList.remove('fx-on');
          on(t, 'transitionend', () => t.remove(), { once: true });
          setTimeout(() => t.remove(), 900);
        }, 3200);
      });
    }
  };

  /* ── 57 · carrousel à flèches et pastilles ────────────────── */
  const initCarousel = () => {
    for (const box of $$('.fx-carousel')) {
      if (!claim(box, 'fxCarousel')) continue;
      const piste = $('.fx-carousel-piste', box);
      if (!piste) continue;
      const vues = [...piste.children];
      if (vues.length < 2) continue;

      const pastilles = born(document.createElement('div'));
      pastilles.className = 'fx-carousel-pastilles';

      let n = 0;
      const aller = (i) => {
        n = (i + vues.length) % vues.length;
        piste.style.transform = `translateX(-${n * 100}%)`;
        vues.forEach((v, k) => { v.inert = k !== n; });   // hors vue = hors focus
        [...pastilles.children].forEach((b, k) =>
          b.setAttribute('aria-current', String(k === n)));
      };

      vues.forEach((_, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', `Vue ${i + 1} sur ${vues.length}`);
        on(b, 'click', () => aller(i));
        pastilles.append(b);
      });

      for (const [sens, texte, etiquette] of
           [['prev', '‹', 'Vue précédente'], ['next', '›', 'Vue suivante']]) {
        const b = born(document.createElement('button'));
        b.type = 'button';
        b.className = `fx-carousel-fleche ${sens}`;
        b.textContent = texte;
        b.setAttribute('aria-label', etiquette);
        on(b, 'click', () => aller(n + (sens === 'next' ? 1 : -1)));
        box.append(b);
      }
      box.append(pastilles);

      on(box, 'keydown', (e) => {
        if (e.key === 'ArrowLeft')  aller(n - 1);
        if (e.key === 'ArrowRight') aller(n + 1);
      });
      aller(0);

      const auto = parseFloat(box.dataset.auto);
      if (auto && !reduced()) {
        const t = setInterval(() => aller(n + 1), auto * 1000);
        on(box, 'pointerenter', () => clearInterval(t));
        on(window, 'fx-destroy', () => clearInterval(t));
      }
    }
  };

  /* ── 58 · retour en haut ──────────────────────────────────── */
  const initTop = () => {
    const btn = $('.fx-top');
    if (!btn || !claim(btn, 'fxTop')) return;
    sentinelle(document.body, (passe) => btn.classList.toggle('fx-on', passe));
    on(btn, 'click', () =>
      scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' }));
  };

  /* ── 61 · filtrage de la grille ───────────────────────────
     Les cartes glissent à leur nouvelle place grâce aux View
     Transitions : aucune position n'est calculée à la main.  */
  let filtreNo = 0;
  const initFilter = () => {
    for (const box of $$('.fx-filter')) {
      if (!claim(box, 'fxFilter')) continue;
      const boutons = $$('[data-filtre]', box);
      const grille  = $('.fx-filter-grille', box);
      if (!boutons.length || !grille) continue;

      const prefixe = `fx-f${filtreNo++}`;
      [...grille.children].forEach((c, i) => {
        c.style.viewTransitionName = `${prefixe}-${i}`;   // un nom unique par carte
      });

      const appliquer = (cle) => {
        for (const c of grille.children) {
          c.hidden = cle !== '*' && c.dataset.categorie !== cle;
        }
        for (const b of boutons) {
          b.setAttribute('aria-pressed', String(b.dataset.filtre === cle));
        }
      };

      for (const b of boutons) {
        on(b, 'click', () => {
          const cle = b.dataset.filtre;
          if (document.startViewTransition && !reduced()) {
            document.startViewTransition(() => appliquer(cle));
          } else {
            appliquer(cle);
          }
        });
      }
      appliquer('*');
    }
  };

  /* ── 65 · photo qui se précise au chargement ──────────────── */
  const initBlur = () => {
    for (const img of $$('.fx-blur img')) {
      if (!claim(img, 'fxBlur')) continue;
      const net = () => img.closest('.fx-blur')?.classList.add('fx-net');
      if (img.complete) net();
      else on(img, 'load', net, { once: true });
    }
  };

  /* ── 68 · copier au clic ──────────────────────────────────── */
  const initCopy = () => {
    for (const btn of $$('[data-copy]')) {
      if (!claim(btn, 'fxCopy')) continue;
      on(btn, 'click', async () => {
        try {
          await navigator.clipboard.writeText(btn.dataset.copy);
        } catch {
          return;                       // refusé par le navigateur : on se tait
        }
        const avant = btn.textContent;
        btn.textContent = 'Copié ✓';
        btn.classList.add('fx-ok');
        setTimeout(() => {
          btn.textContent = avant;
          btn.classList.remove('fx-ok');
        }, 1800);
      });
    }
  };

  /* ── 69 · bandeau de consentement ─────────────────────────── */
  const initCookie = () => {
    const box = $('.fx-cookie');
    if (!box || !claim(box, 'fxCookie')) return;
    const cle = 'fx-cookie-vu';

    let vu = false;
    try { vu = localStorage.getItem(cle) === '1'; } catch { /* mode privé */ }
    if (vu) { box.remove(); return; }

    box.hidden = false;
    requestAnimationFrame(() => box.classList.add('fx-on'));
    const ok = $('.fx-cookie-ok', box);
    if (!ok) return;
    on(ok, 'click', () => {
      try { localStorage.setItem(cle, '1'); } catch { /* mode privé */ }
      box.classList.remove('fx-on');
      on(box, 'transitionend', () => box.remove(), { once: true });
      setTimeout(() => box.remove(), 700);
    });
  };

  const Effets = {
    init() {
      buildWords();
      buildCut();
      buildMosaic();
      buildLetters();
      indexChildren();
      initPointer();
      initLightbox();
      initScroll();
      initCompare();
      initMarquee();
      initLoupe();
      initRail();
      initCount();
      initMagnet();
      initTyped();
      initCursor();
      initTrail();
      initShrink();
      initMenu();
      initPreload();
      initTabs();
      initModal();
      initScramble();
      initDrop();
      initRange();
      initSteps();
      initToast();
      initCarousel();
      initTop();
      initFilter();
      initBlur();
      initCopy();
      initCookie();
      initReveal();
    },

    /** Retire tout : écouteurs, observateurs, éléments créés et
     *  marques internes. `init()` peut ensuite repartir à neuf. */
    destroy() {
      dispatchEvent(new Event('fx-destroy'));   // arrête les minuteries
      ac.abort();
      ac = new AbortController();
      for (const o of observers) o.disconnect();
      observers = [];
      for (const el of created) el.remove();
      created = [];
      for (const [el, key] of claimed) delete el.dataset[key];
      claimed = [];
      document.body.style.overflow = '';
    },
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Effets.init(), { once: true });
  } else {
    Effets.init();
  }

  window.Effets = Effets;
})();
