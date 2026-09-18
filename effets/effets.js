/* ============================================================
   BIBLIOTHÈQUE D'EFFETS — Kin Bois Création
   Pilote les effets qui ont besoin de JavaScript.
   Aucune dépendance. À charger avec `defer`.

     <script src="effets/effets.js" defer></script>

   Tout est initialisé automatiquement au chargement. Pour
   réinitialiser après avoir injecté du contenu dynamiquement,
   appelez `Effets.init()` : chaque effet ne s'installe qu'une
   fois, un rappel est donc sans danger.

   Écrit en JavaScript moderne (ES2022). Trois choix à connaître :

   1. Quand le navigateur sait animer au défilement en CSS
      (`animation-timeline`), on le laisse faire : la classe
      `fx-scroll-natif` est posée sur <html> et les boucles de
      défilement en JS s'effacent. C'est plus fluide, car
      l'animation ne passe plus par le fil principal.
   2. La lightbox et la modale s'appuient sur <dialog> : la
      touche Échap, le piège à focus et le fond assombri sont
      alors gérés par le navigateur, pas par nous.
   3. Le script reste un script classique, pas un module ES,
      pour qu'il fonctionne aussi en ouvrant le fichier
      directement depuis le disque.
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

  /** Marque un élément comme traité. Renvoie false s'il l'était déjà,
   *  ce qui rend chaque initialisation rejouable sans dégât. */
  const claim = (el, key) => {
    if (el.dataset[key]) return false;
    el.dataset[key] = '1';
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
    el.addEventListener('pointermove', ({ clientX, clientY }) => {
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
    el.addEventListener('pointerleave', () => {
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
    const io = new IntersectionObserver((entries) => {
      for (const { isIntersecting, target } of entries) {
        if (isIntersecting) { fire(target); io.unobserve(target); }
      }
    }, { threshold });
    targets.forEach((t) => io.observe(t));
    setTimeout(() => targets.forEach(fire), safety);
  };

  /* Numérote les enfants (--si) pour échelonner les délais. */
  const indexChildren = () => {
    for (const box of $$('.fx-stagger, .fx-curtain, .fx-menu-liens')) {
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

      const dlg = document.createElement('dialog');
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
        // rejoue l'animation d'ouverture de l'image
        img.style.animation = 'none';
        void img.offsetWidth;
        img.style.animation = '';
      };

      cards.forEach((c, n) => c.addEventListener('click', () => {
        show(n);
        dlg.showModal();          // Échap + piège à focus + fond : natifs
      }));
      $('.fx-lb-x', dlg).addEventListener('click', () => dlg.close());
      $('.prev', dlg).addEventListener('click', () => show(i - 1));
      $('.next', dlg).addEventListener('click', () => show(i + 1));
      // clic sur le fond (hors image et boutons) : on ferme
      dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
      dlg.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft')  show(i - 1);
        if (e.key === 'ArrowRight') show(i + 1);
      });
    }
  };

  /* ── 8 & 29 · effets pilotés par la position dans la page ───
     Ne tourne que si le navigateur ne sait pas le faire en CSS. */
  const initScroll = () => {
    // les vitesses des colonnes passent en variable CSS : utile
    // aux deux chemins, natif comme JS
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
    addEventListener('scroll', () => { raf ??= requestAnimationFrame(tick); }, { passive: true });
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

  /* ── 10, 11, 13, 21, 25, 30, 45 · révélations au défilement ─ */
  const initReveal = () => {
    onSeen(
      $$('.fx-words, .fx-unfurl, .fx-cut, .fx-curtain, .fx-mosaic, .fx-stagger, .fx-sweep'),
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
      Object.assign(box, { tabIndex: 0 });
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

      box.addEventListener('pointerdown', (e) => {
        down = true;
        box.setPointerCapture(e.pointerId);
        fromX(e.clientX);
      });
      box.addEventListener('pointermove', (e) => { if (down) fromX(e.clientX); });
      for (const ev of ['pointerup', 'pointercancel']) {
        box.addEventListener(ev, () => { down = false; });
      }
      box.addEventListener('keydown', (e) => {
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

      const lens = document.createElement('div');
      lens.className = 'fx-lens';
      box.append(lens);

      const zoom = parseFloat(box.dataset.zoom) || 2.4;
      const size = () => {
        const { width, height } = box.getBoundingClientRect();
        const src = (img.currentSrc || img.src).replaceAll('"', '%22');
        lens.style.backgroundImage = `url("${src}")`;
        lens.style.backgroundSize = `${width * zoom}px ${height * zoom}px`;
      };
      box.addEventListener('pointerenter', size);
      // ResizeObserver : suit aussi les changements de mise en page,
      // pas seulement le redimensionnement de la fenêtre
      new ResizeObserver(size).observe(box);
    }
  };

  /* ── 18 · rail horizontal : glisser à la souris ───────────── */
  const initRail = () => {
    for (const rail of $$('.fx-rail')) {
      if (!claim(rail, 'fxRail')) continue;

      let down = false, startX = 0, startLeft = 0, moved = false;
      rail.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'touch') return;   // le défilement natif suffit
        down = true; moved = false;
        startX = e.clientX; startLeft = rail.scrollLeft;
        rail.setPointerCapture(e.pointerId);
      });
      rail.addEventListener('pointermove', (e) => {
        if (!down) return;
        const d = e.clientX - startX;
        if (Math.abs(d) > 4) { moved = true; rail.classList.add('fx-drag'); }
        rail.scrollLeft = startLeft - d;
      });
      for (const ev of ['pointerup', 'pointercancel']) {
        rail.addEventListener(ev, () => {
          down = false;
          rail.classList.remove('fx-drag');
        });
      }
      // un glissement ne doit pas déclencher le clic de la carte
      rail.addEventListener('click', (e) => {
        if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
      }, true);
    }
  };

  /* ── 22 · compteur animé ──────────────────────────────────── */
  const initCount = () => {
    onSeen($$('[data-to]'), (el) => {
      const to = parseFloat(el.dataset.to) || 0;
      const suffix = el.dataset.suffix ?? '';
      if (reduced()) { el.textContent = to + suffix; return; }
      const dur = 1400;
      const t0 = performance.now();
      const step = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        el.textContent = Math.round(to * (1 - (1 - p) ** 3)) + suffix;
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
      el.addEventListener('pointermove', ({ clientX, clientY }) => {
        const r = el.getBoundingClientRect();
        const x = (clientX - r.left - r.width / 2) * force;
        const y = (clientY - r.top - r.height / 2) * force;
        el.classList.add('fx-pull');
        el.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;
      });
      el.addEventListener('pointerleave', () => {
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
      const tiles = document.createElement('div');
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

      let i = 0, n = 0, erasing = false;
      const tick = () => {
        const word = list[i];
        n += erasing ? -1 : 1;
        out.textContent = word.slice(0, n);
        let wait = erasing ? 45 : 85;
        if (!erasing && n >= word.length) { erasing = true; wait = 1600; }
        else if (erasing && n <= 0) { erasing = false; i = (i + 1) % list.length; wait = 320; }
        setTimeout(tick, wait);
      };
      tick();
    }
  };

  /* ── 31 · curseur personnalisé (point + anneau) ───────────── */
  const initCursor = () => {
    const host = $('.fx-cursor');
    if (!host || !fine() || reduced() || !claim(host, 'fxCursor')) return;

    const dot  = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'fx-cur-dot';
    ring.className = 'fx-cur-ring';
    for (const el of [dot, ring]) el.setAttribute('aria-hidden', 'true');
    host.append(dot, ring);

    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
    addEventListener('pointermove', (e) => {
      x = e.clientX; y = e.clientY;
      dot.style.translate = `${x}px ${y}px`;
      // visible seulement au-dessus de sa zone : posé sur <body>,
      // le curseur vaut pour tout le site ; posé sur une section,
      // il ne vaut que là.
      const dedans = host === document.body || host.contains(e.target);
      dot.classList.toggle('fx-visible', dedans);
      ring.classList.toggle('fx-visible', dedans);
      // l'anneau grossit au-dessus de tout ce qui est cliquable
      ring.classList.toggle('fx-on',
        !!e.target?.closest?.('a, button, .fx-card, [role="slider"]'));
    }, { passive: true });

    // l'anneau suit avec du retard : c'est ce décalage qui fait l'effet
    const follow = () => {
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
        const img = document.createElement('img');
        img.src = src;
        img.alt = '';
        img.setAttribute('aria-hidden', 'true');
        zone.append(img);
        return img;
      });

      let n = 0, lastX = 0, lastY = 0;
      zone.addEventListener('pointermove', (e) => {
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

  /* ── 34 · en-tête qui se condense au défilement ───────────
     Une sentinelle observée remplace l'écoute du défilement.  */
  const initShrink = () => {
    for (const head of $$('.fx-shrink')) {
      if (!claim(head, 'fxShrink')) continue;
      const mark = document.createElement('div');
      mark.style.cssText = 'position:absolute;top:0;height:1px;width:1px;';
      mark.setAttribute('aria-hidden', 'true');
      head.parentNode.insertBefore(mark, head);
      new IntersectionObserver(
        ([e]) => head.classList.toggle('fx-condense', !e.isIntersecting)
      ).observe(mark);
    }
  };

  /* ── 35 · menu plein écran ────────────────────────────────── */
  const initMenu = () => {
    for (const menu of $$('.fx-menu')) {
      if (!claim(menu, 'fxMenu')) continue;
      const open  = $('.fx-menu-ouvrir', menu);
      const panel = $('.fx-menu-panneau', menu);
      if (!open || !panel) continue;

      const setOpen = (on) => {
        menu.classList.toggle('fx-on', on);
        open.setAttribute('aria-expanded', String(on));
        panel.inert = !on;                 // le contenu masqué sort du focus
        document.body.style.overflow = on ? 'hidden' : '';
      };
      setOpen(false);

      open.setAttribute('aria-controls', panel.id ||= 'fx-menu-panneau');
      open.addEventListener('click', () => setOpen(!menu.classList.contains('fx-on')));
      $('.fx-menu-fermer', menu)?.addEventListener('click', () => setOpen(false));
      for (const a of $$('a', panel)) a.addEventListener('click', () => setOpen(false));
      addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('fx-on')) setOpen(false);
      });
    }
  };

  /* ── 36 · écran de chargement ─────────────────────────────── */
  const initPreload = () => {
    const box = $('.fx-preload');
    if (!box || !claim(box, 'fxPreload')) return;
    const num = $('.fx-preload-num', box);

    const done = () => {
      box.classList.add('fx-parti');
      // on retire du flux une fois la transition finie
      box.addEventListener('transitionend', () => box.remove(), { once: true });
      setTimeout(() => box.remove(), 1200);   // filet de sécurité
    };
    if (reduced()) { box.remove(); return; }

    let p = 0;
    const t = setInterval(() => {
      p = Math.min(100, p + Math.random() * 18);
      if (num) num.textContent = `${Math.round(p)} %`;
      if (p >= 100) { clearInterval(t); setTimeout(done, 260); }
    }, 130);
  };

  /* 37 · transition de page — aucun JS : c'est la règle CSS
     `@view-transition{navigation:auto}` qui fait tout le travail. */

  /* ── 39 · onglets ─────────────────────────────────────────── */
  const initTabs = () => {
    for (const box of $$('.fx-tabs')) {
      if (!claim(box, 'fxTabs')) continue;
      const tabs = $$('[role="tab"]', box);
      const panels = $$('[role="tabpanel"]', box);
      if (!tabs.length) continue;

      const select = (n) => {
        tabs.forEach((t, i) => {
          const on = i === n;
          t.setAttribute('aria-selected', String(on));
          t.tabIndex = on ? 0 : -1;
          panels[i]?.toggleAttribute('hidden', !on);
        });
        // le trait glissant se cale sur l'onglet actif
        const t = tabs[n];
        box.style.setProperty('--fx-tab-x', `${t.offsetLeft}px`);
        box.style.setProperty('--fx-tab-w', `${t.offsetWidth}px`);
      };

      tabs.forEach((t, i) => {
        t.addEventListener('click', () => select(i));
        t.addEventListener('keydown', (e) => {
          const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
          if (!d) return;
          e.preventDefault();
          const next = (i + d + tabs.length) % tabs.length;
          select(next);
          tabs[next].focus();
        });
      });
      select(0);
      // les positions changent avec la largeur : on recale
      new ResizeObserver(() => {
        const n = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
        if (n >= 0) select(n);
      }).observe(box);
    }
  };

  /* ── 41 · modale (sur <dialog>) ───────────────────────────── */
  const initModal = () => {
    for (const btn of $$('[data-modal]')) {
      if (!claim(btn, 'fxModal')) continue;
      const dlg = document.getElementById(btn.dataset.modal);
      if (!(dlg instanceof HTMLDialogElement)) continue;
      btn.addEventListener('click', () => dlg.showModal());
      $('.fx-modal-x', dlg)?.addEventListener('click', () => dlg.close());
      dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    }
  };

  /* ── 43 · texte qui se décode ─────────────────────────────── */
  const initScramble = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&/*+';
    onSeen($$('[data-scramble]'), (el) => {
      const final = el.dataset.scramble;
      if (reduced()) { el.textContent = final; return; }
      let frame = 0;
      const run = () => {
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
      initReveal();
    },
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Effets.init(), { once: true });
  } else {
    Effets.init();
  }

  window.Effets = Effets;
})();
