/**
 * Libellés partagés par les pages de la Galerie Vidéo.
 * Compatibles avec les valeurs techniques et les anciens libellés français.
 */

export const LISTING_LABELS = {
  vente: 'À vendre',
  location: 'À louer',
  location_nuitee: 'Par nuitée',
  location_journaliere: 'À la journée',
  Vente: 'À vendre',
  Location: 'À louer',
  Nuitée: 'Par nuitée',
  'Location nuitée': 'Par nuitée',
  'Location journalière': 'À la journée',
};

export const PRICE_SUFFIX = {
  vente: '',
  location: '/mois',
  location_nuitee: '/nuit',
  location_journaliere: '/jour',
  Vente: '',
  Location: '/mois',
  Nuitée: '/nuit',
  'Location nuitée': '/nuit',
  'Location journalière': '/jour',
};

// Ramène les anciens libellés aux valeurs techniques (pour les filtres).
export const LISTING_CANONICAL = {
  Vente: 'vente',
  Location: 'location',
  Nuitée: 'location_nuitee',
  'Location nuitée': 'location_nuitee',
  'Location journalière': 'location_journaliere',
};

export function canonicalListing(value) {
  return LISTING_CANONICAL[value] || value;
}

export const TYPE_LABELS = {
  villa: 'Villa',
  appartement: 'Appartement',
  maison: 'Maison',
  chambre: 'Chambre',
  hotel: 'Hôtel',
  terrain: 'Terrain',
  bureau: 'Bureau',
  commerce: 'Commerce',
  autre: 'Autre',
  realisation_en_cours: 'Réalisation en cours',
  projet_en_cours: 'Projet en cours',
  immeuble: 'Immeuble',
  studio: 'Studio',
  mini_studio: 'Mini-studio',
};

/** Prix formaté, ou null si le prix n'est pas renseigné ("Prix sur demande"). */
export function formatPrice(price) {
  if (price === null || price === undefined) return null;
  if (typeof price === 'string' && price.trim() === '') return null;
  const n = Number(price);
  if (!Number.isFinite(n) || n < 0) return null;
  return n.toLocaleString('fr-FR');
}
