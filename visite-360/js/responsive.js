// Gestion responsive, tactile et gyroscope

class ResponsiveHandler {
  constructor() {
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchDistance = 0;
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    this.isTablet = /iPad|Android/i.test(navigator.userAgent);

    this.init();
  }

  init() {
    // Gestion tactile
    document.addEventListener('touchstart', this.onTouchStart.bind(this), false);
    document.addEventListener('touchmove', this.onTouchMove.bind(this), false);
    document.addEventListener('touchend', this.onTouchEnd.bind(this), false);

    // Gestion pinch zoom
    document.addEventListener('touchstart', this.onPinchStart.bind(this), false);
    document.addEventListener('touchmove', this.onPinchMove.bind(this), false);

    // Oreinetation change
    window.addEventListener('orientationchange', this.onOrientationChange.bind(this));

    // Detecter appareil
    this.adaptUIToDevice();
  }

  onTouchStart(e) {
    if (e.touches.length === 1) {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
    }
  }

  onTouchMove(e) {
    if (e.touches.length === 1 && window.tourInstance) {
      const touch = e.touches[0];
      const deltaX = touch.clientX - this.touchStartX;
      const deltaY = touch.clientY - this.touchStartY;

      // Rotation panorama avec geste tactile
      const camera = window.tourInstance.camera;
      if (camera) {
        camera.alpha += (deltaX * 0.005);
        camera.beta += (deltaY * 0.005);

        // Limiter beta
        camera.beta = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.beta));
      }

      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
    }
  }

  onTouchEnd(e) {
    // Inertie
    const touch = e.changedTouches[0];
  }

  onPinchStart(e) {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dx = touch1.clientX - touch2.clientX;
      const dy = touch1.clientY - touch2.clientY;
      this.touchDistance = Math.sqrt(dx * dx + dy * dy);
    }
  }

  onPinchMove(e) {
    if (e.touches.length === 2 && window.tourInstance) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dx = touch1.clientX - touch2.clientX;
      const dy = touch1.clientY - touch2.clientY;
      const currentDistance = Math.sqrt(dx * dx + dy * dy);

      const delta = currentDistance - this.touchDistance;
      const camera = window.tourInstance.camera;

      if (camera) {
        // Zoom
        camera.fov = Math.max(0.5, Math.min(2, camera.fov - (delta * 0.002)));
      }

      this.touchDistance = currentDistance;
    }
  }

  onOrientationChange() {
    setTimeout(() => {
      if (window.tourInstance) {
        window.tourInstance.engine.resize();
      }
    }, 100);
  }

  adaptUIToDevice() {
    const canvas = document.getElementById('canvas');

    if (this.isMobile) {
      document.body.classList.add('mobile');

      // Fullscreen recommandé sur mobile
      this.suggestFullscreen();

      // Paysage pour meilleure expérience
      if (window.innerHeight > window.innerWidth) {
        console.log('Orientation portrait détectée. Paysage recommandé.');
      }
    }

    if (this.isTablet) {
      document.body.classList.add('tablet');
    }

    // Désactiver double-tap zoom par défaut
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  suggestFullscreen() {
    // Suggestion discrète de passer en plein écran
    const btn = document.getElementById('fullscreenBtn');
    if (btn) {
      btn.style.animation = 'pulse 2s ease-in-out infinite';
    }
  }

  enableFullscreenLandscape() {
    const canvas = document.getElementById('canvas');
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen().then(() => {
        if (screen.orientation && screen.orientation.lock) {
          screen.orientation.lock('landscape').catch(err => {
            console.log('Verrouillage orientation non supporté:', err);
          });
        }
      });
    }
  }

  static handleMenuVisibility() {
    const menuPanel = document.getElementById('menuPanel');
    const menuToggle = document.getElementById('menuToggle');
    const viewport = window.innerWidth;

    // Sur desktop, menu toujours visible
    if (viewport > 768) {
      // Afficher menu inline à gauche
    } else {
      // Sur mobile, menu caché par défaut (toggle)
      menuToggle.style.display = 'flex';
    }
  }
}

// Animation pulse
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  .control-button.active {
    background: rgba(201, 169, 97, 0.4);
    border-color: var(--or-fin);
  }
`;
document.head.appendChild(style);

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', () => {
  new ResponsiveHandler();
  ResponsiveHandler.handleMenuVisibility();

  // Re-check au resize
  window.addEventListener('resize', ResponsiveHandler.handleMenuVisibility);
});

// Export pour accès externe
window.ResponsiveHandler = ResponsiveHandler;