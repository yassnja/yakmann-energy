# Yakmann Energy — site vitrine

Site statique (Astro 7, TypeScript, CSS natif) construit à partir de la présentation
`PRESENTATION YAKMANN ENERGY - 2026.pdf`.

## Commandes

Prérequis : Node.js ≥ 22.22.0.

```bash
npm install        # installe les dépendances
npm run dev        # serveur de développement → http://localhost:4321
npm run build      # vérification TypeScript (astro check) + build statique dans dist/
npm run preview    # sert le build de production localement
```

Sur Netlify, les URL canoniques et les balises Open Graph utilisent automatiquement le domaine principal fourni dans `URL`. Pour imposer un domaine sur Netlify ou un autre hébergement :

```bash
SITE_URL=https://www.votre-domaine.ma npm run build
```

## Structure

```
src/
  data/company.ts      coordonnées, identifiants légaux, prestations, références (source : diapositives 1–4)
  data/projects.ts     réalisations, catégories, photo de couverture, villes (source : diapositives 5–72)
  assets/projects/     photos extraites de la présentation, un dossier par réalisation
  assets/brand/        nouveau logo fourni, déclinaisons couleur/blanc, symbole et lettrage
  components/          sections de la page d'accueil
  pages/index.astro    page d'accueil
  pages/realisations/[slug].astro   une page par réalisation, avec galerie et visionneuse
  styles/global.css    design tokens et styles de base
public/                favicon, icônes, image Open Graph, robots.txt, manifest
```

Ajouter une réalisation : créer `src/assets/projects/<slug>/01.jpg…`, puis ajouter une entrée dans
`src/data/projects.ts` (le numéro `cover` désigne la photo de couverture).

## Contenu — règles suivies

- Toutes les informations proviennent de la présentation : aucun chiffre, client ou témoignage n'a été ajouté.
- Le périmètre d'une réalisation n'est affiché que lorsque la présentation le précise.
- Le RIB bancaire présent dans la présentation n'est volontairement pas publié.
- Logos clients (`src/assets/clients/`, liste dans `src/data/clients.ts`) : extraits de la diapositive 2 et
  détourés, sauf Siemens Healthineers (SVG officiel, Wikimedia Commons). Plusieurs logos de la présentation
  sont en basse résolution : les remplacer par les fichiers fournis par les clients améliorera la netteté.

## À compléter avant la mise en production

- **Domaine** : Netlify fournit automatiquement le domaine principal ; `SITE_URL` permet une valeur explicite.
- **Formulaire** : envoi direct via FormSubmit (https://formsubmit.co), sans ouverture de messagerie.
  Destinataire de test : `njari.yassine61@gmail.com`. La variable de build `PUBLIC_CONTACT_RECIPIENT` remplace la valeur par défaut de `src/data/contact.ts`.
  Envoyer une première demande, puis confirmer le lien FormSubmit reçu par e-mail (vérifier les spams).
  Après création de la boîte Zoho, définir `PUBLIC_CONTACT_RECIPIENT=contact@yakmannenergy.com`, reconstruire et activer cette nouvelle adresse.
  Les demandes transitent par FormSubmit ; en cas d’échec, les champs restent remplis. Une confirmation du service ne garantit pas l’arrivée en boîte de réception.
  Les tests automatiques simulent le service et n’envoient pas d’e-mail. Les coordonnées publiques de l’entreprise sont distinctes du destinataire temporaire de test.
- **Mentions légales / confidentialité** : à rédiger par l'entreprise.
- **Photos** : celles de la présentation sont de résolution modeste (souvent < 1300 px). Des originaux en
  haute définition amélioreraient nettement le rendu, en particulier pour le visuel principal.
- **Identité visuelle** : nouveau logo fourni (`logo-source.png`), marine `#092b5b` et déclinaisons bleu-gris. Les marges transparentes sont recadrées pour l’affichage ; les proportions sont conservées. Les icônes et l’image de partage utilisent cette identité. Un fichier SVG officiel permettrait une version vectorielle.
- **Réseaux sociaux** : aucun compte n'apparaît dans la présentation, aucun n'est donc lié.

## Déploiement

Le dossier `dist/` est entièrement statique : Netlify, Vercel, Cloudflare Pages ou tout hébergement
classique (Apache/Nginx) conviennent. Sur Netlify, `../netlify.toml` définit la base `site`, la commande `npm run build` et le dossier publié `dist`. Voir le [guide à la racine](../README.md#déployer-sur-netlify).

## Mouvement et interactions

Direction « Le courant » : les éléments s'allument (mots qui montent hors d'un masque, images qui s'ouvrent
depuis une ligne, tracés qui se dessinent). Une seule courbe d'accélération (expo-out) pour tout le site.

- `src/scripts/circuit.ts` — circuit vivant du hero (canvas 2D, réagit au pointeur, en pause hors écran).
- `src/scripts/motion.ts` — GSAP + ScrollTrigger : parallaxe du hero, vague de transition, compteurs.
- `src/scripts/interactions.ts` — progression de lecture, curseur, boutons magnétiques (`data-magnetic`),
  inclinaison 3D (`data-tilt`). Libellé du curseur : attribut `data-cursor="Voir"`.
- `ImagingRoom.astro` — maquette en perspective (`ImagingModel.astro`, volumes `RoomPrism.astro`) : six repères cliquables, navigation clavier et tactile, mise en évidence des lots et retour à la vue d’ensemble. SVG natif, sans moteur 3D.
- `Expertises.astro` — explorateur de services (défilement automatique, accordéon sur mobile).

Le curseur, l'aimantation, l'inclinaison et l'épinglage ne s'activent qu'à la souris sur grand écran.
Avec « réduire les animations », tout le contenu s'affiche directement, sans mouvement.
