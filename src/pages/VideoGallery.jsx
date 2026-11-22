import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, SearchX, Clapperboard } from 'lucide-react';

import { getProperties } from '../api/client';
import useCachedData from '../hooks/useCachedData';
import { PropertiesGridSkeleton } from '../components/ui/Skeleton';
import VideoCard from '../components/video/VideoCard';
import SEO from '../components/ui/SEO';
import { canonicalListing } from '../utils/propertyLabels';
import { hasVideos } from '../utils/video';

const LISTING = [
  { value: '', label: 'Tous les biens' },
  { value: 'vente', label: 'À vendre' },
  { value: 'location', label: 'À louer' },
  { value: 'location_nuitee', label: 'Par nuitée' },
  { value: 'location_journaliere', label: 'À la journée' },
];

function extractProperties(response) {
  if (Array.isArray(response)) return response;
  const candidates = [
    response?.properties,
    response?.results,
    response?.data?.properties,
    response?.data,
  ];
  return candidates.find(Array.isArray) || [];
}

function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

export default function VideoGallery() {
  const [listing, setListing] = useState('');
  const [query, setQuery] = useState('');

  const { data, loading, error } = useCachedData(
    'videos_gallery',
    async () => {
      const response = await getProperties({ hasVideo: 'true' });
      return extractProperties(response).filter(hasVideos);
    },
    []
  );

  const properties = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return properties.filter((p) => {
      if (listing && canonicalListing(p.listingType) !== listing) return false;
      if (!q) return true;
      return normalize(`${p.title} ${p.location} ${p.type}`).includes(q);
    });
  }, [properties, listing, query]);

  const totalVideos = properties.reduce(
    (sum, p) => sum + (p.videos?.length || 0),
    0
  );

  return (
    <div>
      <SEO
        title="Nos biens en vidéo"
        description="Visitez en vidéo nos villas, appartements, studios, terrains et chantiers à Dakar. Regardez, copiez le lien et partagez les vidéos de nos biens avec BF IMMO SARL."
        path="/galerie-video"
      />

      {/* En-tête */}
      <section className="relative overflow-hidden bg-ink pb-20 pt-32">
        <motion.div
          aria-hidden="true"
          className="absolute -left-16 -top-20 h-[380px] w-[380px] rounded-[50%_50%_65%_35%/40%_45%_55%_60%] bg-brand-red/10 blur-3xl"
          animate={{ rotate: [0, -18, 0] }}
          transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="container-bf relative z-10">
          <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-brand-goldSoft">
            <Clapperboard size={14} aria-hidden="true" />
            Galerie Vidéo
          </span>

          <h1 className="mt-4 max-w-xl font-sans text-4xl font-extrabold text-white sm:text-5xl">
            Nos biens en vidéo
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
            Visitez nos biens depuis votre téléphone. Chaque vidéo possède son
            propre lien : copiez-le et partagez-le en un geste.
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
            className="relative z-10 -mt-10 mb-14 flex flex-col gap-4 rounded-[24px] bg-white p-5 shadow-soft sm:flex-row sm:items-center sm:p-6"
          >
            <div className="flex shrink-0 items-center gap-2 text-ink/50">
              <SlidersHorizontal size={16} aria-hidden="true" />
              <span className="font-mono text-[12px] uppercase tracking-wide">
                Filtrer
              </span>
            </div>

            <select
              aria-label="Filtrer par type d'offre"
              value={listing}
              onChange={(e) => setListing(e.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-line bg-offwhite px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand-gold"
            >
              {LISTING.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            <input
              type="search"
              aria-label="Rechercher un bien ou un quartier"
              placeholder="Rechercher un bien ou un quartier…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-w-0 flex-[2] rounded-xl border border-line bg-offwhite px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-ink/35 focus:border-brand-gold"
            />
          </motion.div>

          {loading && properties.length === 0 ? (
            <PropertiesGridSkeleton />
          ) : error && properties.length === 0 ? (
            <div
              className="flex flex-col items-center py-20 text-center text-ink/60"
              role="alert"
            >
              <SearchX size={30} className="mb-3" />
              <p className="font-medium">
                Impossible de charger les vidéos pour le moment.
              </p>
              <p className="mt-2 text-sm">
                Vérifiez votre connexion puis réessayez.
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Réessayer
              </button>
            </div>
          ) : properties.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center text-ink/50">
              <Clapperboard size={30} className="mb-3" />
              <p className="font-medium">
                Les vidéos de nos biens arrivent bientôt.
              </p>
              <p className="mt-2 text-sm">
                En attendant, découvrez nos biens en photos.
              </p>
              <a
                href="/biens"
                className="mt-4 text-sm font-semibold text-brand-gold underline underline-offset-4"
              >
                Voir les biens
              </a>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center text-ink/50">
              <SearchX size={30} className="mb-3" />
              <p className="font-medium">
                Aucune vidéo ne correspond à ces critères.
              </p>
              <button
                type="button"
                onClick={() => {
                  setListing('');
                  setQuery('');
                }}
                className="mt-4 text-sm font-semibold text-brand-gold underline underline-offset-4"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <>
              <p className="mb-6 text-sm text-ink/55" aria-live="polite">
                {filtered.length} {filtered.length > 1 ? 'biens' : 'bien'} ·{' '}
                {totalVideos} {totalVideos > 1 ? 'vidéos' : 'vidéo'}
              </p>

              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((property, index) => (
                  <VideoCard
                    key={property._id || property.id || index}
                    property={property}
                    index={index}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
