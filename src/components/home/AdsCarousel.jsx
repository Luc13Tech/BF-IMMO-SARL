
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Home,
  Sparkles,
} from 'lucide-react';

const LISTING_LABELS = {
  vente: 'À VENDRE',
  Vente: 'À VENDRE',
  location: 'À LOUER',
  Location: 'À LOUER',
  location_nuitee: 'LOCATION NUITÉE',
  'Location nuitée': 'LOCATION NUITÉE',
  Nuitée: 'LOCATION NUITÉE',
  location_journaliere: 'LOCATION JOURNALIÈRE',
  'Location journalière': 'LOCATION JOURNALIÈRE',
};

const STATUS_LABELS = {
  disponible: 'DISPONIBLE',
  nouveau: 'NOUVEAUTÉ',
  sous_offre: 'SOUS OFFRE',
  loue: 'LOUÉ',
  vendu: 'VENDU',
};

const TYPE_LABELS = {
  villa: 'Villa',
  appartement: 'Appartement',
  maison: 'Maison',
  chambre: 'Chambre',
  hotel: 'Hôtel',
  terrain: 'Terrain',
  bureau: 'Bureau',
  commerce: 'Commerce',
  immeuble: 'Immeuble',
  studio: 'Studio',
  mini_studio: 'Mini-studio',
  autre: 'Bien immobilier',
};

function formatPrice(price) {
  if (price === null || price === undefined || price === '') {
    return null;
  }

  const value = Number(price);

  if (!Number.isFinite(value) || value < 0) {
    return null;
  }

  return value.toLocaleString('fr-FR');
}

export default function AdsCarousel({
  properties = [],
  autoPlayInterval = 2000,
}) {
  const items = Array.isArray(properties)
    ? properties.filter((property) => property && (property._id || property.slug))
    : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
  }, [items.length]);

  useEffect(() => {
    if (items.length < 2) return undefined;

    const interval = window.setInterval(() => {
      setCurrentIndex((previous) => (previous + 1) % items.length);
      setImageLoaded(false);
    }, Math.max(2000, Number(autoPlayInterval) || 2000));

    return () => window.clearInterval(interval);
  }, [items.length, autoPlayInterval]);

  const previous = () => {
    setCurrentIndex((index) => (index - 1 + items.length) % items.length);
    setImageLoaded(false);
  };

  const next = () => {
    setCurrentIndex((index) => (index + 1) % items.length);
    setImageLoaded(false);
  };

  if (items.length === 0) return null;

  const property = items[currentIndex];

  const image = property.images?.[0]?.url || property.images?.[0] || null;
  const price = formatPrice(property.price);
  const listingLabel =
    LISTING_LABELS[property.listingType] || 'BIEN IMMOBILIER';
  const statusLabel =
    STATUS_LABELS[property.status] || 'DISPONIBLE';
  const typeLabel =
    TYPE_LABELS[property.type] || 'Bien immobilier';

  const propertyUrl = `/biens/${property.slug || property._id}`;

  return (
    <section
      aria-label="Publicités immobilières BF IMMO"
      className="relative mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8"
    >
      <div className="relative overflow-hidden rounded-[2rem] border border-[#d8b85c]/70 bg-[#101522] p-4 shadow-[0_0_30px_rgba(216,184,92,0.16),0_25px_65px_rgba(0,0,0,0.35)] sm:rounded-[2.5rem] sm:p-7 lg:p-9">

        {/* Halo doré */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-1 rounded-[2.5rem] bg-gradient-to-br from-[#f5d77c]/15 via-transparent to-[#a77b24]/10 blur-xl"
        />

        {/* Décoration intérieure */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#d8b85c]/10 blur-3xl"
        />

        <div className="relative z-10">

          {/* En-tête */}
          <div className="mb-5 flex items-center justify-between gap-3 sm:mb-7">

            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ffe28a] to-[#c4942e] text-[#111827] shadow-[0_0_20px_rgba(226,190,86,0.3)] sm:h-14 sm:w-14">
                <Home size={25} strokeWidth={2.5} />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Sparkles
                    size={12}
                    className="shrink-0 text-[#e7c66f]"
                  />
                  <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-[#e7c66f] sm:text-[10px]">
                    Sélection BF IMMO
                  </span>
                </div>

                <h2 className="mt-1 text-lg font-extrabold leading-tight text-white sm:text-2xl lg:text-3xl">
                  Nos biens <span className="text-[#f2cc62]">en vedette</span>
                </h2>
              </div>
            </div>

            <Link
              to="/biens"
              className="shrink-0 text-xs font-bold text-white underline decoration-[#e5bd50] decoration-2 underline-offset-4 transition hover:text-[#f2cc62] sm:text-sm"
            >
              Voir tous
              <ArrowRight className="ml-1 inline" size={15} />
            </Link>
          </div>

          {/* Publicité principale */}
          <div className="relative">

            {/* Flèche précédente */}
            {items.length > 1 && (
              <button
                type="button"
                onClick={previous}
                aria-label="Afficher le bien précédent"
                className="absolute -left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#e6c96e]/80 bg-[#111827] text-white shadow-[0_0_16px_rgba(0,0,0,0.4)] transition hover:scale-110 hover:bg-[#d6ad43] hover:text-[#101522] sm:-left-5 sm:h-14 sm:w-14"
              >
                <ArrowLeft size={22} />
              </button>
            )}

            {/* Carte du bien */}
            <div
              key={property._id || property.slug}
              className="mx-auto max-w-4xl overflow-hidden rounded-[1.5rem] border border-white/15 bg-white shadow-[0_12px_45px_rgba(0,0,0,0.35)] sm:rounded-[2rem]"
            >

              {/* Image */}
              <Link
                to={propertyUrl}
                className="group relative block aspect-[16/9] overflow-hidden bg-[#252d3d] sm:aspect-[16/8]"
              >
                {image && (
                  <img
                    src={image}
                    alt={property.title || 'Bien immobilier BF IMMO'}
                    loading="eager"
                    decoding="async"
                    onLoad={() => setImageLoaded(true)}
                    className={`h-full w-full object-cover transition duration-700 group-hover:scale-[1.035] ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                )}

                {!image && (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#1b2638] to-[#080d18]">
                    <Home size={55} className="text-[#d6b65d]/60" />
                  </div>
                )}

                {/* Voile pour la lisibilité des étiquettes */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/20" />

                {/* Type de transaction */}
                <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-[#e7bd4d] px-4 py-2 text-[10px] font-extrabold tracking-wider text-[#101522] shadow-lg sm:left-6 sm:top-6 sm:px-6 sm:py-3 sm:text-sm">
                  {listingLabel}
                </span>

                {/* Statut */}
                <span className="absolute right-4 top-4 rounded-full border border-white/25 bg-black/55 px-3 py-2 text-[9px] font-bold tracking-wider text-white backdrop-blur-md sm:right-6 sm:top-6 sm:text-[10px]">
                  {statusLabel}
                </span>

                {/* Prix sur la photo */}
                <div className="absolute bottom-4 right-4 max-w-[85%] rounded-xl border border-[#ffe28a]/70 bg-gradient-to-r from-[#f9dc78] to-[#d9aa35] px-4 py-3 text-right shadow-[0_5px_25px_rgba(0,0,0,0.25)] sm:bottom-6 sm:right-6 sm:rounded-2xl sm:px-6 sm:py-4">
                  <p className="text-base font-black leading-tight text-[#101522] sm:text-2xl lg:text-3xl">
                    {price !== null
                      ? `${price} ${property.priceUnit || 'FCFA'}`
                      : 'Prix sur demande'}
                  </p>
                </div>
              </Link>

              {/* Informations sous la photo */}
              <Link
                to={propertyUrl}
                className="grid gap-3 px-5 py-5 sm:grid-cols-2 sm:items-center sm:px-8 sm:py-6"
              >
                <div className="min-w-0 space-y-2">
                  <p className="flex items-center gap-2 text-sm font-semibold text-[#d52c36] sm:text-base">
                    <MapPin size={18} className="shrink-0" />
                    <span className="truncate">
                      {property.location || 'Localisation sur demande'}
                    </span>
                  </p>

                  <h3 className="flex items-center gap-2 text-base font-extrabold leading-snug text-[#151a24] sm:text-xl">
                    <Home size={19} className="shrink-0 text-[#151a24]" />
                    <span>{property.title || typeLabel}</span>
                  </h3>
                </div>

                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <span className="rounded-full bg-[#f4f0e5] px-3 py-2 text-xs font-bold text-[#8c6b25]">
                    {typeLabel}
                  </span>

                  <span className="inline-flex items-center gap-2 rounded-full bg-[#111827] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#d5ad46] hover:text-[#101522]">
                    Voir le bien
                    <ArrowRight size={15} />
                  </span>
                </div>
              </Link>
            </div>

            {/* Flèche suivante */}
            {items.length > 1 && (
              <button
                type="button"
                onClick={next}
                aria-label="Afficher le bien suivant"
                className="absolute -right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#e6c96e]/80 bg-[#111827] text-white shadow-[0_0_16px_rgba(0,0,0,0.4)] transition hover:scale-110 hover:bg-[#d6ad43] hover:text-[#101522] sm:-right-5 sm:h-14 sm:w-14"
              >
                <ArrowRight size={22} />
              </button>
            )}
          </div>

          {/* Indicateurs de navigation */}
          {items.length > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2.5">
              {items.map((item, index) => (
                <button
                  key={item._id || item.slug || index}
                  type="button"
                  onClick={() => {
                    setCurrentIndex(index);
                    setImageLoaded(false);
                  }}
                  aria-label={`Afficher le bien ${index + 1}`}
                  aria-current={currentIndex === index ? 'true' : undefined}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    currentIndex === index
                      ? 'w-8 bg-[#e7bd4d] shadow-[0_0_12px_rgba(231,189,77,0.55)]'
                      : 'w-2.5 bg-white/35 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Compteur */}
          <p className="mt-3 text-center font-mono text-[10px] tracking-widest text-white/45">
            {String(currentIndex + 1).padStart(2, '0')}
            {' / '}
            {String(items.length).padStart(2, '0')}
          </p>

        </div>
      </div>
    </section>
  );
}
