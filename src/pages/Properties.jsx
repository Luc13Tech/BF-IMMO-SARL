import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, SearchX } from 'lucide-react';

import { getProperties } from '../api/client';
import { PropertiesGridSkeleton } from '../components/ui/Skeleton';
import PropertyCard from '../components/properties/PropertyCard';
import SEO from '../components/ui/SEO';

const TYPES = [
  { value: '', label: 'Tous types' },
  { value: 'villa', label: 'Villa' },
  { value: 'appartement', label: 'Appartement' },
  { value: 'maison', label: 'Maison' },
  { value: 'chambre', label: 'Chambre' },
  { value: 'hotel', label: 'Hôtel' },
  { value: 'terrain', label: 'Terrain' },
  { value: 'bureau', label: 'Bureau' },
  { value: 'commerce', label: 'Commerce' },
];

const LISTING = [
  { value: '', label: 'Tous les biens' },
  { value: 'vente', label: 'À vendre' },
  { value: 'location', label: 'À louer' },
  { value: 'location_nuitee', label: 'Par nuitée' },
  { value: 'location_journaliere', label: 'À la journée' },
];

/**
 * Normalise les différents formats possibles de réponse de l'API.
 * Ne modifie et ne supprime aucune donnée côté serveur.
 */
function extractProperties(response) {
  if (Array.isArray(response)) {
    return response;
  }

  const candidates = [
    response?.data?.properties,
    response?.data?.data,
    response?.data,
    response?.properties,
  ];

  return candidates.find(Array.isArray) || [];
}

export default function Properties() {
  const [filters, setFilters] = useState({
    listingType: '',
    type: '',
    q: '',
  });

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchProperties = async () => {
      setLoading(true);
      setError(false);

      try {
        // N'envoie à l'API que les filtres renseignés.
        const params = Object.fromEntries(
          Object.entries(filters).filter(
            ([, value]) => value.trim() !== ''
          )
        );

        const response = await getProperties(params);
        const data = extractProperties(response);

        if (!cancelled) {
          setProperties(data);
        }
      } catch (err) {
        console.error(
          'Erreur lors du chargement des biens immobiliers :',
          err
        );

        if (!cancelled) {
          setError(true);
          setProperties([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProperties();

    return () => {
      cancelled = true;
    };
  }, [filters]);

  const cacheKey = `properties_${JSON.stringify(filters)}`;

  const updateFilter = (name, value) => {
    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  };

  return (
    <div>
      <SEO
        title="Nos biens immobiliers à Dakar"
        description="Découvrez nos villas, appartements, maisons, chambres, terrains, bureaux et commerces à vendre ou à louer avec BF IMMO SARL à Dakar."
        path="/biens"
      />

      {/* En-tête */}
      <section className="relative overflow-hidden bg-ink pt-32 pb-20">
        <motion.div
          aria-hidden="true"
          className="absolute -top-20 -left-16 h-[380px] w-[380px] rounded-[50%_50%_65%_35%/40%_45%_55%_60%] bg-brand-red/10 blur-3xl"
          animate={{ rotate: [0, -18, 0] }}
          transition={{
            duration: 17,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <div className="container-bf relative z-10">
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand-goldSoft">
            Nos biens
          </span>

          <h1 className="mt-4 max-w-xl font-sans text-4xl font-extrabold text-white sm:text-5xl">
            Trouvez le bien qui vous correspond
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
            Explorez nos offres immobilières et utilisez les filtres
            pour trouver le bien adapté à votre projet.
          </p>
        </div>

        <svg
          aria-hidden="true"
          className="absolute bottom-0 left-0 w-full text-offwhite"
          style={{ transform: 'translateY(1px)' }}
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
        >
          <path
            d="M0,45 C300,90 600,0 900,35 C1200,70 1320,20 1440,40 L1440,90 L0,90 Z"
            fill="currentColor"
          />
        </svg>
      </section>

      {/* Filtres et résultats */}
      <section className="bg-offwhite pb-28">
        <div className="container-bf">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="-mt-10 relative z-10 mb-14 flex flex-col gap-4 rounded-[24px] bg-white p-5 shadow-soft sm:flex-row sm:items-center sm:p-6"
          >
            <div className="flex shrink-0 items-center gap-2 text-ink/50">
              <SlidersHorizontal size={16} aria-hidden="true" />
              <span className="font-mono text-[12px] uppercase tracking-wide">
                Filtrer
              </span>
            </div>

            <select
              aria-label="Filtrer par type d'offre"
              value={filters.listingType}
              onChange={(event) =>
                updateFilter('listingType', event.target.value)
              }
              className="min-w-0 flex-1 rounded-xl border border-line bg-offwhite px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand-gold"
            >
              {LISTING.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              aria-label="Filtrer par type de bien"
              value={filters.type}
              onChange={(event) =>
                updateFilter('type', event.target.value)
              }
              className="min-w-0 flex-1 rounded-xl border border-line bg-offwhite px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand-gold"
            >
              {TYPES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <input
              type="search"
              aria-label="Rechercher un quartier"
              placeholder="Rechercher un quartier…"
              value={filters.q}
              onChange={(event) => updateFilter('q', event.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-line bg-offwhite px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-ink/35 focus:border-brand-gold"
            />
          </motion.div>

          {/* Chargement initial */}
          {loading && properties.length === 0 ? (
            <PropertiesGridSkeleton />
          ) : error ? (
            <div
              className="flex flex-col items-center py-20 text-center text-ink/60"
              role="alert"
            >
              <SearchX size={30} className="mb-3" />
              <p className="font-medium">
                Impossible de charger les biens pour le moment.
              </p>
              <p className="mt-2 text-sm">
                Vérifiez votre connexion puis réessayez.
              </p>

              <button
                type="button"
                onClick={() =>
                  setFilters((current) => ({ ...current }))
                }
                className="mt-5 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Réessayer
              </button>
            </div>
          ) : properties.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center text-ink/50">
              <SearchX size={30} className="mb-3" />
              <p className="font-medium">
                Aucun bien ne correspond à ces critères.
              </p>
              <button
                type="button"
                onClick={() =>
                  setFilters({
                    listingType: '',
                    type: '',
                    q: '',
                  })
                }
                className="mt-4 text-sm font-semibold text-brand-gold underline underline-offset-4"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between gap-4">
                <p className="text-sm text-ink/55" aria-live="polite">
                  {properties.length}{' '}
                  {properties.length > 1 ? 'biens trouvés' : 'bien trouvé'}
                </p>

                {loading && (
                  <span className="text-xs text-ink/45" role="status">
                    Actualisation…
                  </span>
                )}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={cacheKey}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {properties.map((property, index) => (
                    <PropertyCard
                      key={property._id || property.id || index}
                      property={property}
                      index={index}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
