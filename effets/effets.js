/* ============================================================
   BIBLIOTHÈQUE D'EFFETS — Kin Bois Création
   Pilote les effets qui ont besoin de JavaScript.
   Aucune dépendance. À charger avec `defer`.

     <script src="effets/effets.js" defer></script>

   Tout est initialisé automatiquement au chargement. Pour
   réinitialiser après avoir injecté du contenu dynamiquement,
   appelez `Effets.init()`.
   ============================================================ */
(function (global) {
  'use strict';

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine   = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* Pose --mx/--my (position du curseur en %) et --px/--py
     (écart au centre, -0.5 à 0.5) sur l'élément survolé. */
  function trackPointer(el) {
    if (el.dataset.fxTrack) return;   // pas de second écouteur si init() est rappelé
    el.dataset.fxTrack = '1';
    var raf = null;
    el.addEventListener('mousemove', function (e) {
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        el.style.setProperty('--mx', (px * 100) + '%');
        el.style.setProperty('--my', (py * 100) + '%');
        el.style.setProperty('--px', (px - 0.5).toFixed(3));
        el.style.setProperty('--py', (py - 0.5).toFixed(3));
      });
    });
    el.addEventListener('mouseleave', function () {
      if (raf) cancelAnimationFrame(raf);
      el.style.setProperty('--px', '0');
      el.style.setProperty('--py', '0');
    });
  }

  /* 1, 4, 12, 16, 20 — suivi du curseur */
  function initPointer() {
    if (reduce || !fine) return;
    document.querySelectorAll(
      '.fx-parallax .fx-card, .fx-glass .fx-card, .fx-spotlight,' +
      '.fx-tilt .fx-card, .fx-loupe'
    ).forEach(trackPointer);
  }

  /* Appelle `cb(element)` quand l'élément entre dans l'écran, une seule
     fois, avec le filet de sécurité de 2,5 s commun à la bibliothèque. */
  function onSeen(targets, cb) {
    if (!targets.length) return;
    var once = function (el) {
      if (el.dataset.fxSeen) return;
      el.dataset.fxSeen = '1';
      cb(el);
    };
    if (reduce || !('IntersectionObserver' in window)) {
      targets.forEach(once);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { once(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.25 });
    targets.forEach(function (t) { io.observe(t); });
    setTimeout(function () { targets.forEach(once); }, 2500);
  }

  /* Numérote les cartes d'un conteneur (--si) pour échelonner les délais. */
  function indexCards() {
    document.querySelectorAll('.fx-stagger, .fx-curtain').forEach(function (box) {
      [].slice.call(box.children).forEach(function (c, i) {
        c.style.setProperty('--si', i);
      });
    });
  }

  /* 7 — lightbox : une par conteneur .fx-lightbox */
  function initLightbox() {
    document.querySelectorAll('.fx-lightbox').forEach(function (box) {
      if (box.dataset.fxLb) return;
      box.dataset.fxLb = '1';

      var cards = [].slice.call(box.querySelectorAll('.fx-card'));
      if (!cards.length) return;

      var lb = document.createElement('div');
      lb.className = 'fx-lb';
      lb.innerHTML =
        '<button class="fx-lb-x" aria-label="Fermer">✕</button>' +
        '<button class="fx-lb-nav prev" aria-label="Précédent">‹</button>' +
        '<button class="fx-lb-nav next" aria-label="Suivant">›</button>' +
        // pixel transparent : évite une requête vide (404) avant la 1re ouverture
        '<img alt="" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==">' +
        '<div class="fx-lb-cap"></div>';
      document.body.appendChild(lb);

      var img = lb.querySelector('img');
      var cap = lb.querySelector('.fx-lb-cap');
      var i = 0;

      function show(n) {
        i = (n + cards.length) % cards.length;
        var src = cards[i].querySelector('img');
        img.src = src.src;
        img.alt = src.alt || '';
        var b = cards[i].querySelector('b');
        var s = cards[i].querySelector('.fx-cap span');
        cap.textContent = (b ? b.textContent : '') +
          (s ? ' — ' + s.textContent : '') +
          '   (' + (i + 1) + '/' + cards.length + ')';
        img.style.animation = 'none';
        void img.offsetWidth;
        img.style.animation = '';
      }
      function close() { lb.classList.remove('on'); }

      cards.forEach(function (c, n) {
        c.addEventListener('click', function () { show(n); lb.classList.add('on'); });
      });
      lb.querySelector('.fx-lb-x').addEventListener('click', close);
      lb.querySelector('.prev').addEventListener('click', function (e) { e.stopPropagation(); show(i - 1); });
      lb.querySelector('.next').addEventListener('click', function (e) { e.stopPropagation(); show(i + 1); });
      lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
      document.addEventListener('keydown', function (e) {
        if (!lb.classList.contains('on')) return;
        if (e.key === 'Escape')     close();
        if (e.key === 'ArrowLeft')  show(i - 1);
        if (e.key === 'ArrowRight') show(i + 1);
      });
    });
  }

  /* 8 & 29 — effets pilotés par la position dans la page */
  function initScroll() {
    var cols  = [].slice.call(document.querySelectorAll('.fx-scroll-parallax .fx-col'));
    var zooms = [].slice.call(document.querySelectorAll('.fx-zoomout'));
    if ((!cols.length && !zooms.length) || reduce) return;
    var raf = null;
    function tick() {
      var vh = innerHeight;
      cols.forEach(function (col) {
        var r = col.getBoundingClientRect();
        var prog = (vh - r.top) / (vh + r.height);        // 0 → 1 pendant la traversée
        var sp = parseFloat(col.dataset.speed || 0);       // px, négatif = monte
        col.style.transform = 'translateY(' + ((prog - 0.5) * sp).toFixed(1) + 'px)';
      });
      zooms.forEach(function (z) {
        var r = z.getBoundingClientRect();
        var prog = Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height)));
        z.style.setProperty('--fx-z', (1.28 - 0.28 * prog).toFixed(3));
      });
      raf = null;
    }
    addEventListener('scroll', function () {
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });
    tick();
  }

  /* 10 — découpe le titre en mots masqués */
  function buildWords() {
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      if (el.dataset.fxDone) return;
      el.dataset.fxDone = '1';
      el.innerHTML = el.dataset.reveal.split(' ').map(function (w, i) {
        return '<span class="fx-w" style="--wi:' + i + '"><i>' + w + '</i></span>';
      }).join(' ');
    });
  }

  /* 13 — découpe le texte en lignes (séparateur « | ») */
  function buildCut() {
    document.querySelectorAll('[data-cut]').forEach(function (el) {
      if (el.dataset.fxDone) return;
      el.dataset.fxDone = '1';
      el.innerHTML = el.dataset.cut.split('|').map(function (l, i) {
        return '<span style="--ci:' + i + '">' + l + '</span>';
      }).join('<br>');
    });
  }

  /* 10, 11, 13, 21, 25, 30 — déclenchement au scroll */
  function initReveal() {
    var targets = [].slice.call(document.querySelectorAll(
      '.fx-words, .fx-unfurl, .fx-cut, .fx-curtain, .fx-mosaic, .fx-stagger'
    ));
    onSeen(targets, function (t) { t.classList.add('seen'); });
  }

  /* 14 — comparateur avant / après */
  function initCompare() {
    document.querySelectorAll('.fx-compare').forEach(function (box) {
      if (box.dataset.fxDone) return;
      box.dataset.fxDone = '1';

      if (!box.querySelector('.fx-handle')) {
        var h = document.createElement('span');
        h.className = 'fx-handle';
        box.appendChild(h);
      }
      box.tabIndex = 0;
      box.setAttribute('role', 'slider');
      box.setAttribute('aria-label', 'Comparer avant et après');
      box.setAttribute('aria-valuemin', '0');
      box.setAttribute('aria-valuemax', '100');

      var down = false;
      function put(pct) {
        pct = Math.max(0, Math.min(100, pct));
        box.style.setProperty('--cut', pct.toFixed(1) + '%');
        box.setAttribute('aria-valuenow', Math.round(pct));
      }
      function fromX(x) {
        var r = box.getBoundingClientRect();
        put(((x - r.left) / r.width) * 100);
      }
      put(50);

      box.addEventListener('pointerdown', function (e) {
        down = true;
        box.setPointerCapture(e.pointerId);
        fromX(e.clientX);
      });
      box.addEventListener('pointermove', function (e) { if (down) fromX(e.clientX); });
      ['pointerup', 'pointercancel'].forEach(function (ev) {
        box.addEventListener(ev, function () { down = false; });
      });
      box.addEventListener('keydown', function (e) {
        var step = e.key === 'ArrowLeft' ? -4 : e.key === 'ArrowRight' ? 4 : 0;
        if (!step) return;
        e.preventDefault();
        put((parseFloat(box.style.getPropertyValue('--cut')) || 50) + step);
      });
    });
  }

  /* 15 & 28 — bandes défilantes : on duplique le contenu pour
     que la boucle soit invisible. */
  function initMarquee() {
    document.querySelectorAll('.fx-marquee, .fx-ticker').forEach(function (box) {
      if (box.dataset.fxDone) return;
      box.dataset.fxDone = '1';

      var track = box.querySelector('.fx-track');
      if (!track) {
        track = document.createElement('div');
        track.className = 'fx-track';
        while (box.firstChild) track.appendChild(box.firstChild);
        box.appendChild(track);
      }
      var set = track.querySelector('.fx-set');
      if (!set) {
        set = document.createElement('div');
        set.className = 'fx-set';
        while (track.firstChild) set.appendChild(track.firstChild);
        track.appendChild(set);
      }
      if (track.querySelectorAll('.fx-set').length < 2) {
        var copy = set.cloneNode(true);
        copy.setAttribute('aria-hidden', 'true');
        track.appendChild(copy);
      }
      if (box.dataset.speed) box.style.setProperty('--fx-dur', box.dataset.speed + 's');
    });
  }

  /* 16 — loupe : la lentille reprend la photo agrandie.
     La position vient de --mx/--my posés par trackPointer. */
  function initLoupe() {
    if (!fine || reduce) return;
    document.querySelectorAll('.fx-loupe').forEach(function (box) {
      if (box.dataset.fxDone) return;
      box.dataset.fxDone = '1';

      var img = box.querySelector('img');
      if (!img) return;
      var lens = document.createElement('div');
      lens.className = 'fx-lens';
      box.appendChild(lens);

      var zoom = parseFloat(box.dataset.zoom) || 2.4;
      function size() {
        var r = box.getBoundingClientRect();
        var src = (img.currentSrc || img.src).replace(/"/g, '%22');
        lens.style.backgroundImage = 'url("' + src + '")';
        lens.style.backgroundSize = (r.width * zoom).toFixed(0) + 'px ' +
                                    (r.height * zoom).toFixed(0) + 'px';
      }
      box.addEventListener('mouseenter', size);
      addEventListener('resize', size, { passive: true });
    });
  }

  /* 18 — rail horizontal : glisser à la souris comme sur mobile */
  function initRail() {
    document.querySelectorAll('.fx-rail').forEach(function (rail) {
      if (rail.dataset.fxDone) return;
      rail.dataset.fxDone = '1';

      var down = false, startX = 0, startLeft = 0, moved = false;
      rail.addEventListener('pointerdown', function (e) {
        if (e.pointerType === 'touch') return;   // le défilement natif suffit
        down = true; moved = false;
        startX = e.clientX; startLeft = rail.scrollLeft;
        rail.setPointerCapture(e.pointerId);
      });
      rail.addEventListener('pointermove', function (e) {
        if (!down) return;
        var d = e.clientX - startX;
        if (Math.abs(d) > 4) { moved = true; rail.classList.add('fx-drag'); }
        rail.scrollLeft = startLeft - d;
      });
      ['pointerup', 'pointercancel'].forEach(function (ev) {
        rail.addEventListener(ev, function () {
          down = false;
          rail.classList.remove('fx-drag');
        });
      });
      // un glissement ne doit pas déclencher le clic de la carte
      rail.addEventListener('click', function (e) {
        if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
      }, true);
    });
  }

  /* 22 — compteur animé */
  function initCount() {
    var nums = [].slice.call(document.querySelectorAll('[data-to]'));
    onSeen(nums, function (el) {
      var to = parseFloat(el.dataset.to) || 0;
      var suffix = el.dataset.suffix || '';
      if (reduce) { el.textContent = to + suffix; return; }
      var dur = 1400, t0 = performance.now();
      requestAnimationFrame(function step(t) {
        var p = Math.min(1, (t - t0) / dur);
        el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(step);
      });
    });
  }

  /* 23 — bouton magnétique */
  function initMagnet() {
    if (reduce || !fine) return;
    document.querySelectorAll('.fx-magnet').forEach(function (el) {
      if (el.dataset.fxDone) return;
      el.dataset.fxDone = '1';

      var force = parseFloat(el.dataset.strength) || 0.32;
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * force;
        var y = (e.clientY - r.top - r.height / 2) * force;
        el.classList.add('fx-pull');
        el.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      });
      el.addEventListener('pointerleave', function () {
        el.classList.remove('fx-pull');
        el.style.transform = '';
      });
    });
  }

  /* 25 — construit les tuiles de la mosaïque (vague en diagonale) */
  function buildMosaic() {
    document.querySelectorAll('.fx-mosaic .fx-frame').forEach(function (frame) {
      if (frame.querySelector('.fx-tiles')) return;
      var cols = 6, rows = 4, html = '';
      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) html += '<i style="--ti:' + (r + c) + '"></i>';
      }
      var tiles = document.createElement('div');
      tiles.className = 'fx-tiles';
      tiles.setAttribute('aria-hidden', 'true');
      tiles.innerHTML = html;
      frame.appendChild(tiles);
    });
  }

  /* 26 — machine à écrire (phrases séparées par « | ») */
  function initTyped() {
    document.querySelectorAll('[data-type]').forEach(function (el) {
      if (el.dataset.fxDone) return;
      el.dataset.fxDone = '1';

      var list = el.dataset.type.split('|').filter(Boolean);
      if (!list.length) return;

      var out = document.createElement('span');
      var caret = document.createElement('span');
      caret.className = 'fx-caret';
      caret.setAttribute('aria-hidden', 'true');
      el.textContent = '';
      el.appendChild(out);
      el.appendChild(caret);

      if (reduce) { out.textContent = list[0]; return; }

      var i = 0, n = 0, erasing = false;
      (function tick() {
        var word = list[i];
        n += erasing ? -1 : 1;
        out.textContent = word.slice(0, n);
        var wait = erasing ? 45 : 85;
        if (!erasing && n >= word.length)  { erasing = true;  wait = 1600; }
        else if (erasing && n <= 0)        { erasing = false; i = (i + 1) % list.length; wait = 320; }
        setTimeout(tick, wait);
      })();
    });
  }

  var Effets = {
    init: function () {
      buildWords();
      buildCut();
      buildMosaic();
      indexCards();
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
      initReveal();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', Effets.init);
  } else {
    Effets.init();
  }

  global.Effets = Effets;
})(window);
