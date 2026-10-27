// @ts-check
import { defineConfig } from 'astro/config';

// Renseigner `site` avec le domaine de production (ex. 'https://www.exemple.ma')
// pour activer l'URL canonique et les balises Open Graph absolues.
export default defineConfig({
  site: process.env.SITE_URL || undefined,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  image: { responsiveStyles: false },
});
