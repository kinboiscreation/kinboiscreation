// Définition des scènes du tour 360°

const SCENES = [
  {
    id: 1,
    name: "Accueil",
    description: "Bienvenue dans l'univers Kin Bois Création",
    image: "assets/360/01-accueil.jpg",
    hotspots: [
      {
        name: "entrance",
        latitude: 0,
        longitude: 0,
        title: "Entrer dans l'atelier",
        description: "Découvrez l'espace de travail principal",
        buttonText: "Entrer →",
        action: () => gotoScene(2)
      }
    ]
  },

  {
    id: 2,
    name: "Atelier & Showroom",
    description: "Espace principal de présentation",
    image: "assets/360/02-atelier.jpg",
    hotspots: [
      {
        name: "fabrication",
        latitude: 0.3,
        longitude: -0.4,
        title: "Espace de Fabrication",
        description: "Voir les établis et outils de travail",
        buttonText: "Visiter →",
        action: () => gotoScene(3)
      },
      {
        name: "materiaux",
        latitude: -0.2,
        longitude: 0.5,
        title: "Sélection de Matériaux",
        description: "Découvrez nos différents bois",
        buttonText: "Explorer →",
        action: () => gotoScene(4)
      }
    ]
  },

  {
    id: 3,
    name: "Espace de Fabrication",
    description: "Où prend forme chaque création",
    image: "assets/360/03-fabrication.jpg",
    hotspots: [
      {
        name: "tools",
        latitude: 0,
        longitude: 0,
        title: "Précision & Savoir-faire",
        description: "Chaque détail est façonné à la main",
        buttonText: "Voir les matériaux →",
        action: () => gotoScene(4)
      }
    ]
  },

  {
    id: 4,
    name: "Matériaux & Bois",
    description: "Sélection des plus beaux bois",
    image: "assets/360/04-materiaux.jpg",
    hotspots: [
      {
        name: "materials",
        latitude: -0.2,
        longitude: -0.3,
        title: "Bois de Qualité",
        description: "Bois massif sélectionnés avec soin",
        buttonText: "Galerie créations →",
        action: () => gotoScene(5)
      }
    ]
  },

  {
    id: 5,
    name: "Réalisations",
    description: "Galerie de nos créations",
    image: "assets/360/05-realisations.jpg",
    hotspots: [
      {
        name: "showcase",
        latitude: 0.1,
        longitude: 0.2,
        title: "Nos Créations",
        description: "Meubles sur mesure et pièces uniques",
        buttonText: "Détail œuvre →",
        action: () => gotoScene(6)
      }
    ]
  },

  {
    id: 6,
    name: "Détail d'une Œuvre",
    description: "Finitions et personnalisation",
    image: "assets/360/06-showcase.jpg",
    hotspots: [
      {
        name: "detail",
        latitude: 0,
        longitude: 0,
        title: "Finitions Artisanales",
        description: "Chaque pièce reflète notre passion",
        buttonText: "Demander un devis →",
        action: () => gotoScene(7)
      }
    ]
  },

  {
    id: 7,
    name: "Contact & Devis",
    description: "Créons ensemble votre projet",
    image: "assets/360/07-contact.jpg",
    hotspots: [
      {
        name: "contact",
        latitude: 0,
        longitude: 0,
        title: "Parlons de votre projet",
        description: "Contactez-nous pour un devis gratuit",
        buttonText: "Contacter",
        action: () => contactUs()
      }
    ]
  }
];

// Fonction pour naviguer vers une scène
function gotoScene(sceneId) {
  const scene = SCENES.find(s => s.id === sceneId);
  if (scene) {
    window.tourInstance?.goToScene(sceneId - 1);
    hideHotspotInfo();
    updateMenuState(sceneId);
  }
}

// Fonction contact
function contactUs() {
  const phone = "+243836002274";
  const message = "Bonjour, j'aimerais discuter d'un projet de menuiserie artisanale.";
  const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}

// Fonction pour mettre à jour l'état du menu
function updateMenuState(sceneId) {
  document.querySelectorAll('.menu-scene-item').forEach((item, idx) => {
    item.classList.toggle('active', idx + 1 === sceneId);
  });
}

// Fonction pour afficher/masquer info hotspot
function showHotspotInfo(title, description, buttonText, onButtonClick) {
  const hotspotInfo = document.getElementById('hotspotInfo');
  document.getElementById('hotspotTitle').textContent = title;
  document.getElementById('hotspotDesc').textContent = description;
  document.getElementById('hotspotBtn').textContent = buttonText;
  document.getElementById('hotspotBtn').onclick = () => {
    onButtonClick();
  };
  hotspotInfo.classList.add('visible');
}

function hideHotspotInfo() {
  document.getElementById('hotspotInfo').classList.remove('visible');
}

// Exporter pour utilisation dans visite-360.js
window.SCENES = SCENES;
window.gotoScene = gotoScene;
window.contactUs = contactUs;
window.updateMenuState = updateMenuState;
window.showHotspotInfo = showHotspotInfo;
window.hideHotspotInfo = hideHotspotInfo;