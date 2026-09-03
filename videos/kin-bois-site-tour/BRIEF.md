---
workflow: product-launch-video
flow: automation
storyboard: yes
message: "Découvrez le site de Kin Bois Création — le catalogue et le savoir-faire de Jeantim, à Kinshasa"
destination: tiktok
aspect: 1080x1920
language: fr
audience: "Particuliers et entreprises à Kinshasa cherchant du mobilier ou de l'agencement sur mesure"
length: 35s
angle: site tour (show-it-as-is)
---

## Intent

Deuxième vidéo promo pour Kin Bois Création (la première, videos/kin-bois-promo,
montrait le catalogue photo sans site). Celle-ci est une visite guidée du
site web lui-même : le logo KB (nouveau, fourni par le client) s'ouvre en
signature de marque, puis on découvre le site à l'écran comme un visiteur
mobile — accueil, l'artisan, catalogue, pourquoi le choisir, contact —
avant un appel à l'action WhatsApp. Objectif : donner envie de visiter le
site et de commander, pas seulement montrer des captures d'écran statiques.

## Assets

- Logo : /root/.claude/uploads/1719ebdb-7aa4-59d5-a818-b38239dc62b3/8c5b9407-image.jpg
  (monogramme KB sculpté dans le bois, cercle, fourni par le client)
- Site à capturer : fichier local /home/user/kinboiscreation/index.html
  (PAS l'URL en ligne https://kinboiscreation.github.io/kinboiscreation/ —
  le déploiement n'a pas encore les derniers changements locaux, et l'accès
  réseau sortant de ce bac à sable est de toute façon restreint)

## Customizations

- Capture depuis le fichier local (file://) plutôt que crawl de l'URL en
  ligne — mêmes tokens de marque déjà connus du premier projet vidéo :
  ivoire (#F7F4EE), bois profond (#33241A), noir-ébène (#15110C),
  cuivre (#B87333) ; Cormorant Garamond (titres) + Space Grotesk (texte).
- Le nouveau logo KB doit être un moment fort et net de la vidéo (ouverture
  et/ou clôture), pas juste une icône en coin.
- Sections à montrer, dans l'ordre du site : hero → l'artisan (Jeantim) →
  catalogue (quelques pièces représentatives) → pourquoi me choisir →
  contact/CTA WhatsApp.
- Musique : aucune (mêmes limites techniques que le premier projet — pas
  d'accès réseau pour générer/télécharger un fond sonore dans ce bac à
  sable).
- CTA final : WhatsApp +243 964 459 228, devis gratuit.

## Notes

- Le client veut voir le plan (storyboard texte) avant toute fabrication —
  ne pas lancer l'audio, les frames ni le rendu avant validation explicite.
- Mode automatique (pas de session collaborative pas à pas), mais la
  validation du storyboard reste un point d'arrêt obligatoire, comme pour
  le premier projet.
- Accès push GitHub toujours bloqué (403) dans cette session — sans
  incidence sur la fabrication de la vidéo, à mentionner seulement au
  moment de livrer/committer.
