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

Le destinataire temporaire des essais est `njari.yassine61@gmail.com`, avec une valeur par défaut dans [`site/src/data/contact.ts`](site/src/data/contact.ts). Après création de la boîte Zoho, définir la variable de build `PUBLIC_CONTACT_RECIPIENT=contact@yakmannenergy.com` et relancer un déploiement, puis activer le formulaire depuis l’e-mail envoyé par FormSubmit à cette nouvelle adresse.

L’adresse publique affichée sur le site est définie séparément dans [`site/src/data/company.ts`](site/src/data/company.ts).

## Déployer sur Netlify

Le fichier [netlify.toml](netlify.toml) configure le build du site statique. Aucun adaptateur serveur Astro n’est nécessaire.

1. Dans Netlify, importer un projet existant depuis GitHub.
2. Autoriser l’accès au dépôt privé `yassnja/yakmann-energy`, puis sélectionner ce dépôt et la branche `main`.
3. Netlify lit le fichier de configuration. Les valeurs attendues sont :

| Paramètre | Valeur |
| --- | --- |
| Base directory | `site` |
| Build command | `npm run build` |
| Publish directory | `dist` (relatif à `site`, donc `site/dist` dans le dépôt) |
| Node.js | `22.22.0` |

Netlify installe les dépendances directement dans `site/`, y compris les outils de vérification Astro/TypeScript. Le script `postinstall` de la racine n’est pas utilisé par ce build.

### Variables de build

Aucune variable personnalisée n’est indispensable pour un premier déploiement de test.

| Variable | Utilisation |
| --- | --- |
| `SITE_URL` | Facultative. Remplace explicitement le domaine utilisé pour les URL canoniques et les images de partage. Sans cette valeur, le build utilise le domaine principal fourni automatiquement par Netlify dans `URL`. |
| `PUBLIC_CONTACT_RECIPIENT` | Facultative. Destinataire du formulaire FormSubmit. Par défaut : `njari.yassine61@gmail.com` pour les essais. Après création de la boîte Zoho : `contact@yakmannenergy.com`. |

Définir ces variables dans Netlify avec la portée **Builds** lorsqu’elle est proposée, puis relancer le déploiement après toute modification. Le destinataire figure dans le formulaire livré au navigateur : ce n’est pas un secret ni un mot de passe SMTP.

Pour le développement local, un modèle commenté est fourni dans [site/.env.example](site/.env.example). Les fichiers `.env` locaux restent exclus de Git.

### Résultat du build

Le dossier `site/dist/` contient les pages HTML, les images optimisées et `404.html`. Les pages de réalisations ont leur propre route : aucune redirection globale vers `index.html` n’est ajoutée. Les ressources Astro avec noms empreintés bénéficient d’un cache longue durée.

Les dépendances, les sorties de compilation, les configurations locales et la présentation PDF d’origine restent hors du dépôt. Les paramètres de domaine et la création du projet Netlify se font ensuite dans votre compte Netlify.

Documentation : [Astro sur Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/astro/) · [Configuration Netlify](https://docs.netlify.com/build/configure-builds/file-based-configuration/).
