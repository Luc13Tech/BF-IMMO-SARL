
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, MapPin, Sparkles } from 'lucide-react';

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
  location: '/mois',
  location_nuitee: '/nuit',
  location_journaliere: '/jour',
  Location: '/mois',
  Nuitée: '/nuit',
  'Location nuitée': '/nuit',
  'Location journalière': '/jour',
};

const STATUS_LABELS = {
  disponible: 'Disponible',
  nouveau: 'Nouveau',
  sous_offre: 'Sous offre',
  loue: 'Loué',
  vendu: 'Vendu',
};

function formatPrice(value) {
  if (value === null || value === undefined || String(value).trim() === '') {
    return null;
  }

  const amount = Number(value);

  if (!Number.isFinite(amount) || amount < 0) {
    return null;
  }

  return amount.toLocaleString('fr-FR');
}

export default function AdsCarousel({
  properties = [],
  autoPlayInterval = 2000,
}) {
  const trackRef = useRef(null);
  const timerRef = useRef(null);

  const [paused, setPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const items = Array.isArray(properties)
    ? properties.filter((item) => item && (item._id || item.slug))
    : [];

  const getStep = useCallback(() => {
    const track = trackRef.current;
    const card = track?.firstElementChild;

    if (!track || !card) return 0;

    const styles = window.getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap) || 0;

    return card.getBoundingClientRect().width + gap;
  }, []);

  const move = useCallback((direction = 1) => {
    const track = trackRef.current;

    if (!track || items.length < 2) return;

    const step = getStep();

    if (!step) return;

    const max = track.scrollWidth - track.clientWidth;
    const target = track.scrollLeft + step * direction;

    if (direction > 0 && target >= max - 3) {
      track.scrollTo({
        left: 0,
        behavior: 'smooth',
      });
    } else if (direction < 0 && track.scrollLeft <= 3) {
      track.scrollTo({
        left: max,
        behavior: 'smooth',
      });
    } else {
      track.scrollTo({
        left: Math.max(0, Math.min(target, max)),
        behavior: 'smooth',
      });
    }
  }, [getStep, items.length]);

  useEffect(() => {
    const track = trackRef.current;

    if (!track || items.length < 2 || paused) {
      return undefined;
    }

    const reduceMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reduceMotion) return undefined;

    timerRef.current = window.setInterval(() => {
      move(1);
    }, Math.max(2000, Number(autoPlayInterval) || 2000));

    return () => {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [autoPlayInterval, items.length, move, paused]);

  useEffect(() => {
    const track = trackRef.current;

    if (!track) return undefined;

    const updateIndex = () => {
      const step = getStep();

      if (step) {
        setCurrentIndex(
          Math.max(0, Math.round(track.scrollLeft / step))
        );
      }
    };

    track.addEventListener('scroll', updateIndex, {
      passive: true,
    });

    return () => {
      track.removeEventListener('scroll', updateIndex);
    };
  }, [getStep, items.length]);

  if (!items.length) return null;

  return (
    <section
      className="relative z-20 -mt-12 px-4 pb-16 sm:-mt-16 sm:px-6 lg:px-8"
      aria-label="Biens immobiliers en vedette"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setPaused(false);
        }
      }}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] rounded-tl-[4.5rem] border border-white/70 bg-[#fbfaf7] px-5 py-7 shadow-[0_28px_80px_-35px_rgba(0,0,0,0.48)] sm:px-8 sm:py-9 lg:px-10">

        {/* Décoration du cadre */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-brand-gold/10 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -left-16 h-64 w-64 rounded-full bg-brand-red/5 blur-3xl"
        />

        {/* En-tête du carrousel */}
        <div className="relative mb-6 flex items-end justify-between gap-4 sm:mb-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-gold">
              <Sparkles size={13} />
              Sélection BF IMMO
            </span>

            <h2 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight text-ink sm:text-3xl lg:text-4xl">
              Nos biens en vedette
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/65 sm:text-base">
              Découvrez nos opportunités immobilières sélectionnées pour vous.
            </p>
          </div>

          {items.length > 1 && (
            <div className="hidden shrink-0 items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={() => move(-1)}
                aria-label="Biens précédents"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-white text-ink shadow-sm transition hover:-translate-x-0.5 hover:border-brand-gold hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              >
                <ArrowLeft size={18} />
              </button>

              <button
                type="button"
                onClick={() => move(1)}
                aria-label="Biens suivants"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white shadow-md transition hover:translate-x-0.5 hover:bg-brand-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Cartes des biens */}
        <div
          ref={trackRef}
          className="relative flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-5 lg:gap-6"
          style={{ scrollBehavior: 'smooth' }}
          aria-live="off"
        >
          {items.map((property, index) => {
            const image =
              property.images?.[0]?.url || property.images?.[0];

            const price = formatPrice(property.price);
            const listing = property.listingType;

            const status =
              STATUS_LABELS[
                String(property.status || '').toLowerCase()
              ] || 'Disponible';

            const path = `/biens/${property.slug || property._id}`;

            return (
              <article
                key={property._id || property.slug}
                className="group min-w-0 basis-[88%] snap-start sm:basis-[calc(50%-10px)] lg:basis-[calc(33.333%-16px)]"
              >
                <Link
                  to={path}
                  aria-label={`Voir le bien : ${property.title || 'Bien immobilier'}`}
                  className="block h-full overflow-hidden rounded-[1.65rem] rounded-br-[2.8rem] border border-ink/5 bg-white shadow-[0_14px_35px_-24px_rgba(25,28,35,0.55)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_42px_-24px_rgba(25,28,35,0.55)]"
                >
                  {/* Photo */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-ink/10">
                    {image ? (
                      <img
                        src={image}
                        alt={property.title || 'Bien immobilier BF IMMO'}
                        loading={index < 3 ? 'eager' : 'lazy'}
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-ink-soft via-ink to-black" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

                    <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-brand-gold px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider text-ink shadow-lg">
                      {LISTING_LABELS[listing] || listing || 'Offre'}
                    </span>

                    <span className="absolute right-4 top-4 rounded-full border border-white/35 bg-black/45 px-3 py-2 text-[10px] font-semibold text-white shadow-sm backdrop-blur-md">
                      {status}
                    </span>
                  </div>

                  {/* Informations du bien */}
                  <div className="flex min-h-[190px] flex-col p-4 sm:p-5">
                    <p className="mb-2 flex items-start gap-2 text-xs leading-relaxed text-ink/60 sm:text-[13px]">
                      <MapPin
                        size={15}
                        className="mt-0.5 shrink-0 text-brand-gold"
                      />

                      <span>
                        {property.location || 'Localisation sur demande'}
                      </span>
                    </p>

                    <h3 className="text-lg font-extrabold leading-snug text-ink sm:text-xl">
                      {property.title || 'Bien immobilier'}
                    </h3>

                    <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-5">
                      <p className="text-base font-extrabold leading-tight text-brand-red sm:text-lg">
                        {price !== null ? (
                          <>
                            {price}{' '}
                            <span className="whitespace-nowrap">
                              {property.priceUnit || 'FCFA'}
                              {PRICE_SUFFIX[listing] || ''}
                            </span>
                          </>
                        ) : (
                          'Prix sur demande'
                        )}
                      </p>

                      <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-gold/50 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-ink transition group-hover:border-brand-gold group-hover:bg-brand-gold/10">
                        Voir le bien
                        <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>

        {/* Barre de progression */}
        {items.length > 1 && (
          <div className="relative mt-1 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-gold to-brand-red transition-[width] duration-300"
                style={{
                  width: `${Math.min(
                    100,
                    ((currentIndex + 1) / items.length) * 100
                  )}%`,
                }}
              />
            </div>

            <span className="min-w-[3.5rem] text-right font-mono text-[10px] tabular-nums text-ink/50">
              {Math.min(currentIndex + 1, items.length)} / {items.length}
            </span>
          </div>
        )}

        {/* Flèches sur mobile */}
        {items.length > 1 && (
          <div className="mt-5 flex justify-center gap-3 sm:hidden">
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Biens précédents"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-white text-ink shadow-sm"
            >
              <ArrowLeft size={18} />
            </button>

            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Biens suivants"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white shadow-sm"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
