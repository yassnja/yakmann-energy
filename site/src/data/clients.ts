import type { ImageMetadata } from 'astro';

// Diapositive 2 « Nos références » de la présentation.
// Logos extraits de la présentation (détourés), sauf Siemens Healthineers :
// logo vectoriel officiel (Wikimedia Commons, domaine public).

interface ClientSource {
  name: string;
  file: string;
  /** Version « lettrage seul » pour les logos imprimés sur un fond coloré. */
  mark?: string;
}

const sources: ClientSource[] = [
  { name: 'Siemens Healthineers', file: 'siemens-healthineers.svg' },
  { name: 'CNSS', file: 'cnss.png' },
  { name: 'Ministère de la Santé — Hôpital Mohammed VI, M’diq', file: 'hopital-mdiq.png' },
  { name: 'CHU Souss Massa', file: 'chu-souss-massa.png' },
  { name: 'Centre hospitalier Mohammed VI, Oujda', file: 'chu-oujda.png' },
  { name: 'Promamec', file: 'promamec.png' },
  { name: 'T2S Group', file: 't2s.png' },
  { name: 'IMAlliance', file: 'imalliance.png' },
  { name: 'Oncorad Groupe', file: 'oncorad.png' },
  { name: 'Clinique Ville Verte — Elsan', file: 'ville-verte.png' },
  { name: 'Vital Radiology', file: 'vital-radiology.png' },
  { name: 'Clinique Riviera', file: 'riviera.png' },
  { name: 'Clinique El Mesbahi', file: 'mesbahi.png' },
  { name: 'Clinique Al Amal', file: 'al-amal.png' },
  { name: 'Clinique Jnane Taddart', file: 'jnane-taddart.png' },
  { name: 'Clinique Ibn Badis', file: 'ibn-badis.png', mark: 'ibn-badis-mark.png' },
  { name: 'Radiologie Stendhal', file: 'stendhal.png', mark: 'stendhal-mark.png' },
  { name: 'Radiologie Al Quods', file: 'al-quods.png' },
  { name: 'Radiologie Dakhla', file: 'dakhla.png' },
  { name: 'Radiologie Al Madina', file: 'al-madina.png' },
  { name: 'Centre de radiologie Le Littoral', file: 'le-littoral.png' },
  { name: 'Centre de radiologie Les Lumières', file: 'les-lumieres.png' },
  { name: 'Centre de radiologie C.I.L (Siyal)', file: 'siyal.png' },
  { name: 'Centre de radiologie Riverside', file: 'riverside.png' },
  { name: 'FLSH Aïn Chock — Université Hassan II', file: 'flsh.png' },
  { name: 'Passage Fitness', file: 'passage-fitness.png' },
];

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/clients/*.{png,svg}', { eager: true });
const asset = (file: string) => {
  const img = files[`../assets/clients/${file}`]?.default;
  if (!img) throw new Error(`Logo introuvable : ${file}`);
  return img;
};

export interface Client {
  name: string;
  logo: ImageMetadata;
  mark: ImageMetadata;
  /** Hauteur d'affichage (px) qui donne à chaque logo une surface visuelle comparable. */
  height: number;
}

const TARGET_AREA = 54 * 140;

export const clients: Client[] = sources.map((c) => {
  const logo = asset(c.file);
  const mark = c.mark ? asset(c.mark) : logo;
  const ratio = mark.width / mark.height;
  const height = Math.round(Math.min(64, Math.max(22, Math.sqrt(TARGET_AREA / ratio))));
  return { name: c.name, logo, mark, height };
});
