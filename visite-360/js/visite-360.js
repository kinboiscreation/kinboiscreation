// Visite 360° - Logique principale avec Babylon.js

class Tour360 {
  constructor() {
    this.engine = null;
    this.scene = null;
    this.camera = null;
    this.currentSceneIndex = 0;
    this.panoramaTextures = {};
    this.isLoading = false;
    this.hotspots = [];

    this.init();
  }

  async init() {
    try {
      // Créer engine Babylon.js
      const canvas = document.getElementById('canvas');
      this.engine = new BABYLON.Engine(canvas, true);

      // Créer scène de base
      this.scene = new BABYLON.Scene(this.engine);
      this.scene.clearColor = new BABYLON.Color3(0.08, 0.06, 0.05);
      this.scene.collisionsEnabled = true;

      // Créer camera 360°
      this.setupCamera();

      // Charger première scène
      await this.loadScene(0);

      // Setup UI
      this.setupUI();

      // Setup interactions
      this.setupInteractions();

      // Animation loop
      this.engine.runRenderLoop(() => {
        this.scene.render();
      });

      // Handle resize
      window.addEventListener('resize', () => this.engine.resize());

      // Gérer permissions
      document.addEventListener('click', this.requestPermissions.bind(this), { once: true });

    } catch (error) {
      console.error('Erreur initialisation tour:', error);
      this.showError('Erreur lors du chargement de la visite');
    }
  }

  setupCamera() {
    // Camera de visite 360°
    this.camera = new BABYLON.UniversalCamera('UniversalCamera', new BABYLON.Vector3(0, 0, 0), this.scene);
    this.camera.attachControl(document.getElementById('canvas'), true);

    // Paramètres
    this.camera.inertia = 0.7;
    this.camera.angularSensibility = 100;
    this.camera.speed = 0;
    this.camera.wheelPrecision = 30;

    // Inertie & zoom
    this.camera.lowerRadiusLimit = 1;
    this.camera.upperRadiusLimit = 1;
    this.camera.radius = 1;
  }

  async loadScene(index) {
    if (this.isLoading) return;
    this.isLoading = true;

    try {
      const sceneData = SCENES[index];
      this.currentSceneIndex = index;

      // Mettre à jour UI
      this.updateSceneUI(sceneData);

      // Charger texture panorama
      const texture = await this.loadPanoramaTexture(sceneData.image);

      // Remplacer skybox
      this.updateSkybox(texture);

      // Charger hotspots
      this.loadHotspots(sceneData.hotspots);

      // Masquer écran de chargement après première scène
      if (index === 0) {
        setTimeout(() => {
          document.getElementById('loadingScreen').classList.add('hidden');
        }, 800);
      }

      // Animer transition
      this.animateTransition();

    } finally {
      this.isLoading = false;
    }
  }

  async loadPanoramaTexture(imagePath) {
    return new Promise((resolve, reject) => {
      const texture = new BABYLON.Texture(imagePath, this.scene);
      texture.onLoadObservable.addOnce(() => {
        resolve(texture);
      });
      texture.onErrorObservable.addOnce(() => {
        reject(new Error(`Erreur chargement: ${imagePath}`));
      });

      // Mise à jour barre de progression
      this.updateProgress((this.currentSceneIndex + 1) / SCENES.length * 100);
    });
  }

  updateSkybox(texture) {
    // Skybox 360° depuis panorama équirectangulaire
    const skybox = BABYLON.MeshBuilder.CreateSphere('skybox', { segments: 64, diameter: 1000 }, this.scene);

    // Créer material
    const skyboxMaterial = new BABYLON.StandardMaterial('skybox', this.scene);
    skyboxMaterial.emissiveTexture = texture;
    skyboxMaterial.emissiveTexture.uScale = 1.0;
    skyboxMaterial.emissiveTexture.vScale = 1.0;
    skyboxMaterial.backFaceCulling = false;

    skybox.material = skyboxMaterial;

    // Nettoyer ancien skybox
    if (this.currentSkybox) {
      this.currentSkybox.dispose();
      this.currentSkybox.material.dispose();
    }
    this.currentSkybox = skybox;
  }

  loadHotspots(hotspotsData) {
    // Nettoyer anciens hotspots
    this.hotspots.forEach(h => h.dispose());
    this.hotspots = [];

    hotspotsData.forEach((hotspot) => {
      this.createHotspot(hotspot);
    });
  }

  createHotspot(data) {
    // Créer mesh hotspot invisible
    const hotspotMesh = BABYLON.MeshBuilder.CreateSphere('hotspot', { diameter: 0.3 }, this.scene);

    // Positionner basé sur latitude/longitude
    const lat = data.latitude;
    const lon = data.longitude;

    const radius = 100;
    const x = radius * Math.sin(lon) * Math.cos(lat);
    const y = radius * Math.sin(lat);
    const z = radius * Math.cos(lon) * Math.cos(lat);

    hotspotMesh.position = new BABYLON.Vector3(x, y, z);

    // Material transparent
    const material = new BABYLON.StandardMaterial('hotspotMat', this.scene);
    material.emissiveColor = new BABYLON.Color3(0.72, 0.45, 0.2);
    material.alpha = 0.3;
    hotspotMesh.material = material;

    // Interaction
    hotspotMesh.actionManager = new BABYLON.ActionManager(this.scene);
    hotspotMesh.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPointerOverTrigger,
        () => this.onHotspotHover(hotspotMesh, material)
      )
    );
    hotspotMesh.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPointerOutTrigger,
        () => this.onHotspotOut(hotspotMesh, material)
      )
    );
    hotspotMesh.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPickTrigger,
        () => this.onHotspotClick(data)
      )
    );

    this.hotspots.push(hotspotMesh);
  }

  onHotspotHover(mesh, material) {
    material.alpha = 0.8;
    mesh.scaling = new BABYLON.Vector3(1.2, 1.2, 1.2);
  }

  onHotspotOut(mesh, material) {
    material.alpha = 0.3;
    mesh.scaling = new BABYLON.Vector3(1, 1, 1);
  }

  onHotspotClick(hotspot) {
    showHotspotInfo(
      hotspot.title,
      hotspot.description,
      hotspot.buttonText,
      hotspot.action
    );
  }

  updateSceneUI(sceneData) {
    document.getElementById('sceneNumber').textContent = sceneData.id;
    document.getElementById('sceneName').textContent = sceneData.name;
    document.getElementById('totalScenes').textContent = SCENES.length;

    updateMenuState(sceneData.id);
    hideHotspotInfo();
  }

  updateProgress(percent) {
    document.getElementById('progressFill').style.width = percent + '%';
  }

  animateTransition() {
    // Animation caméra de transition
    BABYLON.Animation.CreateAndStartAnimation(
      'transition',
      this.camera,
      'alpha',
      60,
      6,
      this.camera.alpha,
      this.camera.alpha + 0.1,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
  }

  setupUI() {
    // Boutons navigation
    document.getElementById('menuToggle')?.addEventListener('click', () => {
      document.getElementById('menuPanel').classList.toggle('open');
    });

    document.getElementById('menuClose')?.addEventListener('click', () => {
      document.getElementById('menuPanel').classList.remove('open');
    });

    // Créer menu scènes
    this.setupSceneMenu();

    // Fullscreen
    document.getElementById('fullscreenBtn')?.addEventListener('click', () => {
      this.requestFullscreen();
    });

    // Navigation précédent/suivant
    document.getElementById('prevBtn')?.addEventListener('click', () => this.prevScene());
    document.getElementById('nextBtn')?.addEventListener('click', () => this.nextScene());
  }

  setupSceneMenu() {
    const menuScenes = document.getElementById('menuScenes');
    menuScenes.innerHTML = '';

    SCENES.forEach((scene, idx) => {
      const item = document.createElement('div');
      item.className = 'menu-scene-item' + (idx === 0 ? ' active' : '');
      item.innerHTML = `
        <div class="menu-scene-num">0${scene.id}</div>
        <div class="menu-scene-name">${scene.name}</div>
        <div class="menu-scene-desc">${scene.description}</div>
      `;
      item.addEventListener('click', () => {
        this.loadScene(idx);
        document.getElementById('menuPanel').classList.remove('open');
      });
      menuScenes.appendChild(item);
    });
  }

  setupInteractions() {
    // Zoom avec molette
    document.getElementById('canvas').addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoom = this.camera.fov + (e.deltaY > 0 ? 0.05 : -0.05);
      this.camera.fov = Math.max(0.5, Math.min(2, zoom));
    });

    // Contrôles mobiles
    document.getElementById('zoomInBtn')?.addEventListener('click', () => {
      this.camera.fov = Math.max(0.5, this.camera.fov - 0.1);
    });
    document.getElementById('zoomOutBtn')?.addEventListener('click', () => {
      this.camera.fov = Math.min(2, this.camera.fov + 0.1);
    });

    // Navigation clavier
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prevScene();
      if (e.key === 'ArrowRight') this.nextScene();
      if (e.key === 'Escape') this.closeFullscreen();
    });
  }

  prevScene() {
    if (this.currentSceneIndex > 0) {
      this.loadScene(this.currentSceneIndex - 1);
    }
  }

  nextScene() {
    if (this.currentSceneIndex < SCENES.length - 1) {
      this.loadScene(this.currentSceneIndex + 1);
    }
  }

  goToScene(index) {
    if (index >= 0 && index < SCENES.length) {
      this.loadScene(index);
    }
  }

  requestFullscreen() {
    const elem = document.getElementById('canvas');
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  }

  closeFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }

  requestPermissions() {
    // Demander accès gyroscope si disponible
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      document.getElementById('gyroBtn')?.addEventListener('click', () => {
        DeviceOrientationEvent.requestPermission()
          .then(permissionState => {
            if (permissionState === 'granted') {
              this.enableGyroscope();
            }
          })
          .catch(console.error);
      });
    }
  }

  enableGyroscope() {
    window.addEventListener('deviceorientation', (event) => {
      const alpha = BABYLON.Tools.ToRadians(event.alpha || 0);
      const beta = BABYLON.Tools.ToRadians(event.beta || 0);
      const gamma = BABYLON.Tools.ToRadians(event.gamma || 0);

      // Appliquer rotation caméra
      this.camera.alpha = alpha;
      this.camera.beta = beta;
    });

    document.getElementById('gyroBtn')?.classList.add('active');
  }

  showError(message) {
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.querySelector('.loading-text').textContent = message;
    loadingScreen.querySelector('.spinner').style.display = 'none';
  }

  dispose() {
    if (this.engine) {
      this.engine.dispose();
    }
  }
}

// Initialiser au chargement DOM
window.tourInstance = null;
document.addEventListener('DOMContentLoaded', () => {
  window.tourInstance = new Tour360();
});