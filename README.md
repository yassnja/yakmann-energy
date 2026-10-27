# Yakmann Energy

Site vitrine de Yakmann Energy, entreprise de travaux techniques pour les établissements de santé au Maroc.

Le site comprend les expertises de l’entreprise, une maquette interactive de salle d’imagerie, les réalisations, les références et un formulaire de contact.

## Développement

Prérequis : **Node.js 22.22.0 ou version compatible plus récente**, et npm.

Depuis la racine du dépôt :

```sh
npm install
npm run dev
```

Le site est accessible sur <http://localhost:4321>.

```sh
npm run build    # Vérification Astro/TypeScript et génération du site
npm run preview  # Prévisualisation du site compilé
```

## Organisation

- `site/` : application Astro, composants, styles et images.
- `site/src/data/` : coordonnées, prestations, réalisations et destinataire du formulaire.
- `site/public/` : icônes, favicon et ressources publiques.
- `skills/skill.md` : brief de conception du projet.

La documentation détaillée est disponible dans [site/README.md](site/README.md).

## Formulaire de contact

Le formulaire utilise [FormSubmit](https://formsubmit.co) pour transmettre les demandes sans ouvrir la messagerie du visiteur.

Le destinataire temporaire des essais est défini dans [`site/src/data/contact.ts`](site/src/data/contact.ts). Après création de la boîte professionnelle, remplacer cette adresse par `contact@yakmannenergy.com`, puis activer le formulaire depuis l’e-mail envoyé par FormSubmit à cette nouvelle adresse.

L’adresse publique affichée sur le site est définie séparément dans [`site/src/data/company.ts`](site/src/data/company.ts).

## Hébergement

Le build produit un site statique dans **`site/dist/`**. Sur un hébergement qui exécute les commandes à la racine du dépôt :

- Installation : `npm install`
- Build : `npm run build`
- Dossier à publier : `site/dist`

Définir `SITE_URL` avec le domaine de production pour les URL canoniques et les métadonnées de partage.

Les dépendances, les sorties de compilation, les configurations locales et la présentation PDF d’origine restent hors du dépôt.
