import React, { useState } from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { SOURCE_LABELS, safeEmbedUrl } from '../../utils/video';

/**
 * Lecteur « chargement au clic » : on affiche d'abord la vignette, et la vidéo
 * (ou l'iframe YouTube / Facebook / TikTok) n'est chargée qu'au toucher.
 * Cela évite de consommer les données mobiles de l'utilisateur pour rien.
 *
 * Utiliser `key={video._id}` côté parent pour réinitialiser le lecteur
 * lorsqu'on change de vidéo.
 */
function withParams(rawUrl, params) {
  try {
    const u = new URL(rawUrl);
    Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v));
    return u.toString();
  } catch {
    return rawUrl;
  }
}

export default function VideoPlayer({ video, fallbackPoster = '', className = '' }) {
  const [started, setStarted] = useState(false);

  if (!video) return null;

  const isFile = video.source === 'cloudinary' || video.source === 'external';
  const isTikTok = video.source === 'tiktok';
  const poster = video.thumbnail || fallbackPoster;
  const embed = !isFile ? safeEmbedUrl(video.embedUrl) : '';

  const ratio = isTikTok
    ? 'aspect-[9/16] max-h-[78vh] mx-auto'
    : 'aspect-video';

  let embedSrc = embed;
  if (embed) {
    if (video.source === 'youtube') {
      embedSrc = withParams(embed, { autoplay: '1', rel: '0', playsinline: '1' });
    } else if (video.source === 'facebook') {
      embedSrc = withParams(embed, { autoplay: 'true' });
    }
  }

  const canPlay = isFile ? !!video.url : !!embedSrc;

  return (
    <div className={className}>
      <div
        className={`relative w-full overflow-hidden rounded-[22px] bg-black shadow-[0_24px_50px_-24px_rgba(30,32,39,0.6)] ${ratio}`}
      >
        {started && canPlay ? (
          isFile ? (
            <video
              src={video.url}
              poster={poster || undefined}
              controls
              autoPlay
              playsInline
              preload="metadata"
              className="h-full w-full bg-black object-contain"
            >
              Votre navigateur ne peut pas lire cette vidéo.
            </video>
          ) : (
            <iframe
              src={embedSrc}
              title={video.title || 'Vidéo du bien'}
              className="h-full w-full"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          )
        ) : (
          <button
            type="button"
            onClick={() => canPlay && setStarted(true)}
            disabled={!canPlay}
            aria-label={`Lire la vidéo${video.title ? ` : ${video.title}` : ''}`}
            className="group absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ink-soft to-ink"
          >
            {poster && (
              <img
                src={poster}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}
            <span className="absolute inset-0 bg-ink/35" aria-hidden="true" />

            <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-brand-red text-white shadow-[0_12px_30px_-6px_rgba(226,35,26,0.7)] transition-transform duration-300 group-hover:scale-110">
              <Play size={30} className="ml-1 fill-white" aria-hidden="true" />
            </span>

            <span className="absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-wide text-white backdrop-blur">
              {SOURCE_LABELS[video.source] || 'Vidéo'}
            </span>
          </button>
        )}
      </div>

      {!canPlay && video.url && (
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-brand-gold underline underline-offset-4"
        >
          <ExternalLink size={14} aria-hidden="true" />
          Ouvrir la vidéo
        </a>
      )}

      {!isFile && canPlay && video.url && (
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-2 text-[13px] text-ink/55 underline underline-offset-4 hover:text-brand-gold"
        >
          <ExternalLink size={13} aria-hidden="true" />
          Voir sur {SOURCE_LABELS[video.source] || 'le site d\'origine'}
        </a>
      )}
    </div>
  );
}
