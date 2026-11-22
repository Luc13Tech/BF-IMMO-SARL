import React, { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ChevronLeft,
  Loader2,
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  Play,
  ArrowRight,
  Images,
} from 'lucide-react';

import { getProperty } from '../api/client';
import SEO from '../components/ui/SEO';
import VideoPlayer from '../components/video/VideoPlayer';
import ShareButtons from '../components/ui/ShareButtons';
import {
  LISTING_LABELS,
  PRICE_SUFFIX,
  TYPE_LABELS,
  formatPrice,
} from '../utils/propertyLabels';
import {
  SOURCE_LABELS,
  formatDuration,
  hasPhotos,
  hasVideos,
  propertyCover,
  videoUrl,
} from '../utils/video';

export default function VideoDetail() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [property, setProperty] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let mounted = true;
    setStatus('loading');
    setProperty(null);

    getProperty(id)
      .then((data) => {
        if (!mounted) return;
        if (!data) {
          setStatus('not-found');
          return;
        }
        setProperty(data);
        setStatus('ready');
      })
      .catch(() => mounted && setStatus('not-found'));

    window.scrollTo({ top: 0, behavior: 'auto' });

    return () => {
      mounted = false;
    };
  }, [id]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="animate-spin text-brand-gold" size={28} />
      </div>
    );
  }

  if (status === 'not-found' || !property) {
    return (
      <>
        <SEO title="Vidéo introuvable" noindex />
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
          <h1 className="font-sans text-2xl font-extrabold text-ink">
            Vidéo introuvable
          </h1>
          <Link
            to="/galerie-video"
            className="mt-6 font-semibold text-brand-red hover:underline"
          >
            Retour à la Galerie Vidéo
          </Link>
        </div>
      </>
    );
  }

  // Bien sans vidéo : on renvoie vers sa fiche classique.
  if (!hasVideos(property)) {
    return (
      <>
        <SEO title={property.title} noindex />
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
          <h1 className="font-sans text-2xl font-extrabold text-ink">
            Ce bien n'a pas encore de vidéo
          </h1>
          <Link
            to={`/biens/${property.slug || property._id}`}
            className="mt-6 font-semibold text-brand-red hover:underline"
          >
            Voir la fiche du bien
          </Link>
        </div>
      </>
    );
  }

  const videos = property.videos;
  const wantedId = searchParams.get('v');
  const selected = videos.find((v) => v._id === wantedId) || videos[0];
  const others = videos.filter((v) => v !== selected);

  const typeLabel =
    TYPE_LABELS[property.type] || property.type || 'Bien immobilier';
  const listingLabel =
    LISTING_LABELS[property.listingType] || property.listingType || '';
  const suffix = PRICE_SUFFIX[property.listingType] || '';
  const price = formatPrice(property.price);
  const hasPrice = price !== null && Number(property.price) > 0;

  const shareUrl = videoUrl(property, selected);
  const pageTitle = selected.title
    ? `${selected.title} — ${property.title}`
    : `Vidéo : ${property.title}`;
  const description = [
    property.title,
    property.location,
    listingLabel,
    'Regardez la vidéo de ce bien avec BF IMMO SARL.',
  ]
    .filter(Boolean)
    .join(' — ');

  const seoImage = selected.thumbnail || propertyCover(property) || undefined;

  const jsonLd = selected.thumbnail
    ? {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: pageTitle,
        description,
        thumbnailUrl: [selected.thumbnail],
        uploadDate: property.updatedAt || property.createdAt || undefined,
        ...(selected.duration > 0
          ? { duration: `PT${Math.round(selected.duration)}S` }
          : {}),
        ...(selected.source === 'cloudinary' || selected.source === 'external'
          ? { contentUrl: selected.url }
          : selected.embedUrl
          ? { embedUrl: selected.embedUrl }
          : {}),
      }
    : null;

  function selectVideo(video) {
    setSearchParams({ v: video._id }, { replace: true });
  }

  return (
    <div className="bg-offwhite pb-24 pt-28">
      <SEO
        title={pageTitle}
        description={description}
        path={`/galerie-video/${property.slug || property._id}`}
        image={seoImage}
        type="video.other"
      />

      {jsonLd && (
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        </Helmet>
      )}

      <div className="container-bf">
        <Link
          to="/galerie-video"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink/50 transition-colors hover:text-ink"
        >
          <ChevronLeft size={16} />
          Retour à la Galerie Vidéo
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <VideoPlayer
              key={selected._id || selected.url}
              video={selected}
              fallbackPoster={propertyCover(property)}
            />

            {/* Partage de CETTE vidéo */}
            <div className="mt-6 rounded-[22px] bg-white p-5 shadow-soft">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/45">
                Partager cette vidéo
              </p>
              <ShareButtons
                url={shareUrl}
                title={pageTitle}
                text={`Regardez cette vidéo : ${property.title}`}
                className="mt-3"
              />
              <p className="mt-3 break-all font-mono text-[11px] text-ink/40">
                {shareUrl}
              </p>
            </div>

            <h1 className="mt-8 font-sans text-3xl font-extrabold text-ink">
              {property.title}
            </h1>
            {selected.title && (
              <p className="mt-1 text-ink/60">
                {selected.title}
                <span className="ml-2 font-mono text-[11px] text-ink/40">
                  {SOURCE_LABELS[selected.source]}
                  {selected.duration > 0
                    ? ` · ${formatDuration(selected.duration)}`
                    : ''}
                </span>
              </p>
            )}

            <p className="mt-3 flex items-center gap-1.5 font-mono text-[12px] text-ink/50">
              <MapPin size={13} aria-hidden="true" />
              {property.location || 'Localisation sur demande'} · {typeLabel}
              {listingLabel ? ` · ${listingLabel}` : ''}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-6 border-t border-line pt-6 text-sm text-ink/60">
              {property.bedrooms > 0 && (
                <span className="flex items-center gap-2">
                  <BedDouble size={17} /> {property.bedrooms} chambres
                </span>
              )}
              {property.bathrooms > 0 && (
                <span className="flex items-center gap-2">
                  <Bath size={17} /> {property.bathrooms} sdb
                </span>
              )}
              {property.surface > 0 && (
                <span className="flex items-center gap-2">
                  <Ruler size={17} /> {property.surface} m²
                </span>
              )}
            </div>

            {property.description && (
              <p className="mt-6 font-light leading-relaxed text-ink/70">
                {property.description}
              </p>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-[26px] bg-white p-7 shadow-soft lg:sticky lg:top-28">
              <p className="font-sans text-xl font-extrabold text-brand-gold">
                {hasPrice ? (
                  <>
                    {price} {property.priceUnit || 'FCFA'}
                    <span className="text-xs font-normal text-ink/40">
                      {' '}
                      {suffix}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-semibold">Prix sur demande</span>
                )}
              </p>

              <Link
                to={`/biens/${property.slug || property._id}`}
                className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-brand-red px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-redDark"
              >
                {hasPhotos(property) ? (
                  <Images size={16} aria-hidden="true" />
                ) : (
                  <ArrowRight size={16} aria-hidden="true" />
                )}
                Voir la fiche et nous contacter
              </Link>

              {others.length > 0 && (
                <div className="mt-7">
                  <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/45">
                    Autres vidéos de ce bien ({others.length})
                  </p>
                  <ul className="space-y-3">
                    {others.map((video) => (
                      <li key={video._id || video.url}>
                        <button
                          type="button"
                          onClick={() => selectVideo(video)}
                          className="group flex w-full items-center gap-3 rounded-2xl border border-line p-2 text-left transition-colors hover:border-brand-gold"
                        >
                          <span className="relative flex h-16 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-ink-soft to-ink">
                            {video.thumbnail && (
                              <img
                                src={video.thumbnail}
                                alt=""
                                loading="lazy"
                                className="absolute inset-0 h-full w-full object-cover"
                              />
                            )}
                            <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-brand-red text-white">
                              <Play size={13} className="ml-0.5 fill-white" />
                            </span>
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-[13px] font-semibold text-ink">
                              {video.title || 'Vidéo du bien'}
                            </span>
                            <span className="block font-mono text-[11px] text-ink/45">
                              {SOURCE_LABELS[video.source]}
                              {video.duration > 0
                                ? ` · ${formatDuration(video.duration)}`
                                : ''}
                            </span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
