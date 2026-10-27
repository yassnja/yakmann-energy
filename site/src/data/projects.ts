import type { ImageMetadata } from 'astro';

// Réalisations présentées dans « PRESENTATION YAKMANN ENERGY - 2026 » (diapositives 5 à 72).
// Le périmètre (`scope`) n'est renseigné que lorsque la présentation le précise.

export type ProjectCategory = 'imagerie' | 'hopital' | 'clinique' | 'dialyse' | 'energie';

export const categoryLabels: Record<ProjectCategory, string> = {
  imagerie: 'Centre d’imagerie',
  hopital: 'Hôpital public',
  clinique: 'Clinique',
  dialyse: 'Dialyse',
  energie: 'Énergie',
};

interface ProjectSource {
  slug: string;
  name: string;
  cities: string[];
  category: ProjectCategory;
  scope?: string[];
  partners?: string[];
  cover: number;
  featured?: boolean;
}

const sources: ProjectSource[] = [
  {
    slug: 'hopital-mohammed-vi-mdiq',
    name: 'Hôpital Mohammed VI',
    cities: ['M’diq'],
    category: 'hopital',
    scope: ['Salle IRM'],
    cover: 3,
    featured: true,
  },
  {
    slug: 'chu-agadir',
    name: 'CHU Agadir',
    cities: ['Agadir'],
    category: 'hopital',
    scope: ['2 salles IRM', '2 salles de cathétérisme', '2 salles de mammographie', 'Salle de panoramique dentaire'],
    cover: 9,
    featured: true,
  },
  {
    slug: 'cnss',
    name: 'CNSS — réseau national',
    cities: ['Casablanca', 'Mohammedia', 'Kénitra', 'Settat', 'El Jadida', 'Tanger', 'Oujda', 'Agadir'],
    category: 'hopital',
    scope: ['Sites : Ziraoui, Derb Ghalef, Mohammedia, Kénitra, Settat, El Jadida, Tanger, Oujda, Agadir'],
    partners: ['CNSS', 'Siemens Healthineers'],
    cover: 9,
    featured: true,
  },
  { slug: 'chu-oujda', name: 'CHU Oujda', cities: ['Oujda'], category: 'hopital', scope: ['Salle de cathétérisme'], cover: 3 },
  {
    slug: 'clinique-ville-verte',
    name: 'Clinique Ville Verte',
    cities: ['Bouskoura'],
    category: 'clinique',
    scope: [
      'Clinique multidisciplinaire',
      'Blocs opératoires',
      'Chambres d’hospitalisation',
      'Installation d’un système de mise en sécurité incendie (SMSI)',
    ],
    cover: 3,
  },
  { slug: 'clinique-mesbahi', name: 'Clinique El Mesbahi', cities: ['El Jadida'], category: 'clinique', cover: 1 },
  { slug: 'clinique-riviera', name: 'Clinique Riviera', cities: ['Casablanca'], category: 'clinique', cover: 2 },
  { slug: 'clinique-al-amal', name: 'Centre de radiologie Clinique Al Amal', cities: ['Casablanca'], category: 'imagerie', cover: 5 },
  { slug: 'al-hadika', name: 'Centre de radiologie Al Hadika', cities: ['Casablanca'], category: 'imagerie', cover: 4 },
  { slug: 'castilla', name: 'Centre Castilla de radiologie', cities: ['Tanger'], category: 'imagerie', cover: 1 },
  { slug: 'jnan-al-alia', name: 'Centre de radiologie Jnan Al Alia', cities: ['Casablanca'], category: 'imagerie', cover: 15 },
  { slug: 'radiopole', name: 'Centre de radiologie Radiopôle', cities: ['Casablanca'], category: 'imagerie', cover: 15 },
  { slug: 'stendhal', name: 'Centre de radiologie Stendhal', cities: ['Casablanca'], category: 'imagerie', cover: 4 },
  { slug: 'vital-radiology', name: 'Vital Radiology', cities: ['Casablanca'], category: 'imagerie', cover: 6 },
  { slug: 'cil', name: 'Centre de radiologie C.I.L', cities: ['Casablanca'], category: 'imagerie', cover: 4 },
  { slug: 'les-lumieres', name: 'Centre de radiologie Les Lumières', cities: ['Casablanca'], category: 'imagerie', cover: 9 },
  {
    slug: 'le-littoral',
    name: 'Centre de radiologie Le Littoral',
    cities: ['Casablanca'],
    category: 'imagerie',
    partners: ['Oncorad Groupe'],
    cover: 8,
  },
  { slug: 'al-quods', name: 'Centre de radiologie Al Quods', cities: ['Casablanca'], category: 'imagerie', cover: 10 },
  { slug: 'riverside', name: 'Centre de radiologie Riverside', cities: ['Salé'], category: 'imagerie', cover: 17 },
  { slug: 'dakhla', name: 'Centre de radiologie Dakhla', cities: ['Khouribga'], category: 'imagerie', cover: 11 },
  { slug: 'al-madina', name: 'Centre de radiologie Al Madina', cities: ['El Jadida'], category: 'imagerie', cover: 3 },
  { slug: 'dialyse-deroua', name: 'Centre de dialyse et maladies du rein', cities: ['Deroua'], category: 'dialyse', cover: 5 },
  { slug: 'poste-mt', name: 'Poste MT 630 kVA', cities: [], category: 'energie', scope: ['Poste de transformation moyenne tension 630 kVA'], cover: 4 },
  {
    slug: 'tableaux-1600a',
    name: 'Tableaux électriques jusqu’à 1600 A',
    cities: [],
    category: 'energie',
    scope: ['Câblage de tableaux électriques jusqu’à 1600 A'],
    cover: 2,
  },
];

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/projects/*/*.jpg', { eager: true });

function photosFor(slug: string): ImageMetadata[] {
  return Object.keys(files)
    .filter((path) => path.includes(`/projects/${slug}/`))
    .sort()
    .map((path) => files[path].default);
}

export interface Project extends ProjectSource {
  photos: ImageMetadata[];
  coverImage: ImageMetadata;
  location: string;
}

export const projects: Project[] = sources.map((p) => {
  const photos = photosFor(p.slug);
  const coverImage = photos[p.cover - 1];
  if (!coverImage) throw new Error(`Photo de couverture introuvable pour « ${p.slug} »`);
  return {
    ...p,
    photos,
    coverImage,
    location: p.cities.length > 2 ? `${p.cities.length} villes` : p.cities.join(', ') || 'Références techniques',
  };
});

export function projectPhoto(slug: string, index: number): ImageMetadata {
  const photo = projects.find((p) => p.slug === slug)?.photos[index - 1];
  if (!photo) throw new Error(`Photo ${index} introuvable pour « ${slug} »`);
  return photo;
}

export const cities = (() => {
  const map = new Map<string, Project[]>();
  for (const p of projects) for (const c of p.cities) map.set(c, [...(map.get(c) ?? []), p]);
  return [...map.entries()]
    .map(([city, list]) => ({ city, projects: list }))
    .sort((a, b) => b.projects.length - a.projects.length || a.city.localeCompare(b.city, 'fr'));
})();
