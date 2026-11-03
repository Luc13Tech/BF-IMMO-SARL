import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react';

const LISTING_LABELS = {
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

const PRICE_SUFFIX = {
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

const STATUS_LABELS = {
  disponible: 'Disponible',
  nouveau: 'Nouveau',
  sous_offre: 'Sous offre',
};

function formatPrice(price) {
  if (
    price === null ||
    price === undefined ||
    (typeof price === 'string' && price.trim() === '')
  ) {
    return null;
  }

  const numericPrice = Number(price);
  if (!Number.isFinite(numericPrice) || numericPrice < 0) return null;

  return numericPrice.toLocaleString('fr-FR');
}

/**
 * Carrousel publicitaire des biens mis en avant.
 *
 * Ce composant est volontairement en lecture seule : il ne modifie aucun bien,
 * n'appelle aucune API et ne touche à aucune donnée persistante.
 *
 * Props:
 * - properties: tableau de biens déjà récupérés par la page d'accueil.
 * - autoPlayInterval: délai entre deux déplacements automatiques (ms).
 */
export default function AdsCarousel({
  properties = [],
  autoPlayInterval = 2000,
}) {
  const trackRef = useRef(null);
  const intervalRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const items = Array.isArray(properties)
    ? properties.filter((property) => property && (property._id || property.slug))
    : [];

  const getStep = useCallback(() => {
    const track = trackRef.current;
    const firstCard = track?.firstElementChild;

    if (!track || !firstCard) return 0;

    const trackStyle = window.getComputedStyle(track);
    const gap = Number.parseFloat(trackStyle.columnGap || trackStyle.gap) || 0;

    return firstCard.getBoundingClientRect().width + gap;
  }, []);

  const moveNext = useCallback(() => {
    const track = trackRef.current;
    if (!track || items.length < 2) return;

    const step = getStep();
    if (!step) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    const nextPosition = track.scrollLeft + step;

    // Retour au début lorsque la dernière carte a été atteinte.
    if (nextPosition >= maxScroll - 4) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
      setCurrentIndex(0);
      return;
    }

    track.scrollBy({ left: step, behavior: 'smooth' });
    setCurrentIndex((index) => Math.min(index + 1, items.length - 1));
  }, [getStep, items.length]);

  const movePrevious = useCallback(() => {
    const track = trackRef.current;
    if (!track || items.length < 2) return;

    const step = getStep();
    if (!step) return;

    if (track.scrollLeft <= 4) {
      track.scrollTo({
        left: track.scrollWidth - track.clientWidth,
        behavior: 'smooth',
      });
      setCurrentIndex(items.length - 1);
      return;
    }

    track.scrollBy({ left: -step, behavior: 'smooth' });
    setCurrentIndex((index) => Math.max(index - 1, 0));
  }, [getStep, items.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || items.length < 2 || isPaused) return undefined;

    const reduceMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reduceMotion) return undefined;

    intervalRef.current = window.setInterval(
      moveNext,
      Math.max(1000, Number(autoPlayInterval) || 2000)
    );

    return () => {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [autoPlayInterval, isPaused, items.length, moveNext]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const handleScroll = () => {
      const step = getStep();
      if (!step) return;

      const index = Math.round(track.scrollLeft / step);
      setCurrentIndex(Math.min(index, Math.max(items.length - 1, 0)));
    };

    track.addEventListener('scroll', handleScroll, { passive: true });
    return () => track.removeEventListener('scroll', handleScroll);
  }, [getStep, items.length]);

  if (items.length === 0) return null;

  return (
    <section
      className="relative z-20 -mt-20 bg-offwhite pb-16 sm:-mt-24 sm:pb-20"
      aria-label="Biens immobiliers en vedette"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsPaused(false);
        }
      }}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="container-bf">
        <div className="mb-5 flex items-end justify-between gap-4 sm:mb-7">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand-gold">
              Sélection BF IMMO
            </span>
            <h2 className="mt-2 font-sans text-2xl font-extrabold text-ink sm:text-3xl">
              Nos biens en vedette
            </h2>
            <p className="mt-1 text-sm text-ink/55">
              Découvrez nos dernières opportunités immobilières.
            </p>
          </div>

          {items.length > 1 && (
            <div className="hidden shrink-0 items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={movePrevious}
                aria-label="Afficher les biens précédents"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink transition hover:border-brand-gold hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              >
                <ArrowLeft size={17} />
              </button>
              <button
                type="button"
                onClick={moveNext}
                aria-label="Afficher les biens suivants"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink transition hover:border-brand-gold hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              >
                <ArrowRight size={17} />
              </button>
            </div>
          )}
        </div>

        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-5"
          style={{ scrollBehavior: 'smooth' }}
          aria-live="off"
        >
          {items.map((property) => {
            const image = property.images?.[0]?.url;
            const price = formatPrice(property.price);
            const listingType = property.listingType;
            const propertyPath = `/biens/${property.slug || property._id}`;

            return (
              <article
                key={property._id || property.slug}
                className="group relative min-w-0 basis-[88%] snap-start overflow-hidden rounded-[22px] rounded-tr-md bg-ink shadow-[0_18px_40px_-22px_rgba(30,32,39,0.55)] sm:basis-[calc(50%-10px)]"
              >
                <Link
                  to={propertyPath}
                  className="relative block aspect-[16/9] min-h-[220px] overflow-hidden sm:min-h-[250px]"
                  aria-label={`Voir le bien : ${property.title || 'Bien immobilier'}`}
                >
                  {image ? (
                    <img
                      src={image}
                      alt={property.title || 'Bien immobilier BF IMMO'}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-ink-soft via-ink to-black" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/10" />

                  <span className="absolute left-4 top-4 rounded-full bg-brand-gold px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-ink">
                    {LISTING_LABELS[listingType] || listingType || 'Offre'}
                  </span>

                  <span className="absolute right-4 top-4 rounded-full border border-white/30 bg-black/35 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-white backdrop-blur-sm">
                    {STATUS_LABELS[property.status] || 'Disponible'}
                  </span>

                  <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                    <p className="mb-2 flex items-center gap-1.5 text-xs text-white/75">
                      <MapPin size={13} />
                      {property.location || 'Localisation sur demande'}
                    </p>

                    <h3 className="max-w-2xl font-sans text-xl font-bold leading-tight sm:text-2xl">
                      {property.title || 'Bien immobilier'}
                    </h3>

                    <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
                      <p className="font-sans text-lg font-extrabold text-brand-goldSoft sm:text-xl">
                        {price !== null ? (
                          <>
                            {price} {property.priceUnit || 'FCFA'}
                            <span className="ml-1 text-xs font-medium text-white/70">
                              {PRICE_SUFFIX[listingType] || ''}
                            </span>
                          </>
                        ) : (
                          'Prix sur demande'
                        )}
                      </p>

                      <span className="inline-flex items-center gap-2 border-b border-brand-gold pb-1 text-xs font-semibold uppercase tracking-wider text-white">
                        Voir le bien <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>

        {items.length > 1 && (
          <div className="mt-3 flex items-center justify-between gap-4">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-ink/10">
              <div
                className="h-full rounded-full bg-brand-gold transition-[width] duration-300"
                style={{
                  width: `${((currentIndex + 1) / items.length) * 100}%`,
                }}
              />
            </div>
            <span className="font-mono text-[10px] tabular-nums text-ink/45">
              {Math.min(currentIndex + 1, items.length)} / {items.length}
            </span>
          </div>
        )}

        {items.length > 1 && (
          <div className="mt-4 flex justify-center gap-2 sm:hidden">
            <button
              type="button"
              onClick={movePrevious}
              aria-label="Afficher les biens précédents"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink"
            >
              <ArrowLeft size={17} />
            </button>
            <button
              type="button"
              onClick={moveNext}
              aria-label="Afficher les biens suivants"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink"
            >
              <ArrowRight size={17} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
