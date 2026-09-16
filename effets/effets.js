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

  /* 1 & 4 & 12 — suivi du curseur */
  function initPointer() {
    if (reduce || !fine) return;
    document.querySelectorAll(
      '.fx-parallax .fx-card, .fx-glass .fx-card, .fx-spotlight'
    ).forEach(trackPointer);
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

  /* 8 — parallaxe au défilement (colonnes à vitesses différentes) */
  function initScrollParallax() {
    var cols = [].slice.call(document.querySelectorAll('.fx-scroll-parallax .fx-col'));
    if (!cols.length || reduce) return;
    var raf = null;
    function tick() {
      var vh = innerHeight;
      cols.forEach(function (col) {
        var r = col.getBoundingClientRect();
        var prog = (vh - r.top) / (vh + r.height);        // 0 → 1 pendant la traversée
        var sp = parseFloat(col.dataset.speed || 0);       // px, négatif = monte
        col.style.transform = 'translateY(' + ((prog - 0.5) * sp).toFixed(1) + 'px)';
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

  /* 10, 11, 13 — déclenchement au scroll, avec filet de sécurité :
     si l'observateur rate un élément, on l'affiche quand même. */
  function initReveal() {
    var targets = [].slice.call(document.querySelectorAll('.fx-words, .fx-unfurl, .fx-cut'));
    if (!targets.length) return;
    if (reduce || !('IntersectionObserver' in window)) {
      targets.forEach(function (t) { t.classList.add('seen'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('seen'); io.unobserve(e.target); }
      });
    }, { threshold: 0.25 });
    targets.forEach(function (t) { io.observe(t); });
    setTimeout(function () {
      targets.forEach(function (t) { t.classList.add('seen'); });
    }, 2500);
  }

  var Effets = {
    init: function () {
      buildWords();
      buildCut();
      initPointer();
      initLightbox();
      initScrollParallax();
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
