// @ts-check
import { defineConfig } from 'astro/config';

// Netlify supplies URL for its primary domain, including a configured custom domain.
// SITE_URL remains an optional explicit override for Netlify and other hosts.
export default defineConfig({
  site: process.env.SITE_URL || process.env.URL || undefined,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  image: { responsiveStyles: false },
});
