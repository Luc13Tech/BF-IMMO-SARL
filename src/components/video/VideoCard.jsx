import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, MapPin, Link2, Check, Film } from 'lucide-react';
import {
  LISTING_LABELS,
  PRICE_SUFFIX,
  TYPE_LABELS,
  formatPrice,
} from '../../utils/propertyLabels';
import {
  formatDuration,
  propertyCover,
  videoPath,
  videoUrl,
} from '../../utils/video';
import { copyText } from '../../utils/share';

/** Carte d'un bien dans la Galerie Vidéo. */
export default function VideoCard({ property, index = 0 }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const videos = property.videos || [];
  const first = videos[0];
  const poster = first?.thumbnail || propertyCover(property);
  const duration = formatDuration(first?.duration);

  const price = formatPrice(property.price);
  const typeLabel =
    TYPE_LABELS[property.type] || property.type || 'Bien immobilier';
  const listing = LISTING_LABELS[property.listingType] || property.listingType;
  const suffix = PRICE_SUFFIX[property.listingType] || '';

  async function handleCopy(e) {
    e.preventDefault();
    e.stopPropagation();
    const ok = await copyText(videoUrl(property, first));
    setCopied(ok);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        delay: (index % 6) * 0.08,
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        to={videoPath(property, first)}
        className="group block overflow-hidden rounded-[26px] rounded-tr-lg bg-white shadow-[0_18px_40px_-24px_rgba(30,32,39,0.35)] transition-shadow duration-300 hover:shadow-[0_24px_50px_-20px_rgba(30,32,39,0.45)]"
      >
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-ink-soft to-ink">
          {poster && (
            <img
              src={poster}
              alt={property.title || typeLabel}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          <span className="absolute inset-0 bg-ink/25" aria-hidden="true" />

          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-red text-white shadow-[0_10px_26px_-6px_rgba(226,35,26,0.7)] transition-transform duration-300 group-hover:scale-110">
              <Play size={24} className="ml-0.5 fill-white" aria-hidden="true" />
            </span>
          </span>

          {listing && (
            <span className="absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-wide text-white backdrop-blur">
              {listing}
            </span>
          )}

          <span className="absolute bottom-3 right-3 flex items-center gap-2">
            {videos.length > 1 && (
              <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 font-mono text-[11px] text-ink">
                <Film size={12} aria-hidden="true" />
                {videos.length} vidéos
              </span>
            )}
            {duration && (
              <span className="rounded-md bg-black/75 px-2 py-1 font-mono text-[11px] text-white">
                {duration}
              </span>
            )}
          </span>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-sans text-[17px] font-bold text-ink transition-colors group-hover:text-brand-red">
              {property.title || typeLabel}
            </h3>

            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copier le lien de cette vidéo"
              title="Copier le lien de la vidéo"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-ink/40 transition-colors hover:border-brand-gold hover:text-brand-gold"
            >
              {copied ? (
                <Check size={13} className="text-emerald-600" />
              ) : (
                <Link2 size={13} />
              )}
            </button>
          </div>

          <p className="mt-2 flex items-center gap-1.5 font-mono text-[11px] text-ink/50">
            <MapPin size={12} aria-hidden="true" />
            {property.location || 'Localisation sur demande'}
          </p>

          <p className="mt-2 text-xs font-medium text-ink/45">{typeLabel}</p>

          <p className="mt-4 font-sans text-lg font-extrabold text-brand-gold">
            {price !== null ? (
              <>
                {price} {property.priceUnit || 'FCFA'}
                <span className="text-xs font-normal text-ink/40"> {suffix}</span>
              </>
            ) : (
              <span className="text-base font-semibold">Prix sur demande</span>
            )}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
