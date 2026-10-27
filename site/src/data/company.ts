// Source : « PRESENTATION YAKMANN ENERGY - 2026 » (diapositives 1 à 4).
// Toute donnée ajoutée ici doit provenir d'un document fourni par l'entreprise.

export const company = {
  name: 'Yakmann Energy',
  legalName: 'YAKMANN ENERGY SARL AU',
  tagline: 'Courant fort & faible',
  phone: '+212 6 66 32 37 24',
  phoneHref: 'tel:+212666323724',
  email: 'contact@yakmannenergy.com',
  address: {
    street: 'KM16 Route El Jadida, N°6 GH1 Imm. 2, DR Old Azouz, Fraction Old Jafar et Lhfafra',
    city: 'Casablanca',
    country: 'Maroc',
  },
  // Identifiants légaux figurant sur chaque page de la présentation.
  // Le RIB bancaire est volontairement exclu du site.
  legal: [
    { label: 'RC', value: '422981' },
    { label: 'IF', value: '33632334' },
    { label: 'ICE', value: '002203515000045' },
    { label: 'Patente', value: '34172853' },
    { label: 'CNSS', value: '1386513' },
  ],
} as const;

export interface ExpertiseDomain {
  id: string;
  title: string;
  lead: string;
  services: string[];
  proof?: string[];
  image: { project: string; index: number; alt: string };
}

// Les 15 prestations de la diapositive 4, regroupées par domaine.
export const expertises: ExpertiseDomain[] = [
  {
    id: 'energie',
    title: 'Courant fort & courant faible',
    lead: "L'alimentation des équipements d'imagerie, la distribution et les réseaux de sécurité, du poste de transformation jusqu'à la prise.",
    services: [
      'Électricité — courant fort (CFO) et courant faible (CFA)',
      'Système de désenfumage et asservissement SMSI',
    ],
    proof: ['Poste MT 630 kVA', 'Câblage de tableaux électriques jusqu’à 1600 A'],
    image: { project: 'tableaux-1600a', index: 2, alt: 'Jeu de barres et départs d’un tableau électrique de puissance câblé par Yakmann Energy' },
  },
  {
    id: 'air',
    title: 'Climatisation, air & fluides',
    lead: 'Un air maîtrisé pour les patients, le personnel et des équipements sensibles à la chaleur.',
    services: ['Climatisation et VMC', 'Traitement d’air', 'Travaux de plomberie'],
    image: { project: 'clinique-mesbahi', index: 13, alt: 'Réseau de gaines de traitement d’air en toiture de la Clinique Mesbahi, El Jadida' },
  },
  {
    id: 'imagerie',
    title: 'Radioprotection & bloc opératoire',
    lead: 'Les ouvrages spécifiques au médical : protection au plomb, contrôle des fuites et revêtements techniques de bloc.',
    services: [
      'Plombage des salles de radiologie',
      'Contrôle des fuites de rayons X en salle de radiologie',
      'Revêtement mural de bloc opératoire',
      'Revêtement de sol conducteur de bloc opératoire',
    ],
    image: { project: 'al-quods', index: 15, alt: 'Parois d’une salle de radiologie en cours de plombage, Centre de radiologie Al Quods' },
  },
  {
    id: 'finitions',
    title: 'Second œuvre & finitions',
    lead: 'Les corps d’état qui livrent un espace fini, cohérent et prêt à accueillir des patients.',
    services: [
      'Menuiserie bois',
      'Menuiserie aluminium',
      'Peinture',
      'Construction métallique',
      'Plâtre et BA13',
      'Revêtement de sol',
    ],
    image: { project: 'stendhal', index: 4, alt: 'Couloir habillé de bois et éclairage linéaire, Centre de radiologie Stendhal' },
  },
];

export const serviceCount = expertises.reduce((n, d) => n + d.services.length, 0);
