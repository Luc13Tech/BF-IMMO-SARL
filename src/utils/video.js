import { SITE_URL } from '../components/ui/SEO';

/**
 * Aides communes à la Galerie Vidéo (cartes, page vidéo, admin).
 */

export const SOURCE_LABELS = {
  cloudinary: 'Vidéo BF IMMO',
  youtube: 'YouTube',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  external: 'Lien vidéo',
};

// Seuls ces hôtes peuvent être chargés dans un <iframe> (liste fermée).
const EMBED_HOSTS = [
  'www.youtube-nocookie.com',
  'www.youtube.com',
  'www.tiktok.com',
  'www.facebook.com',
];

export function safeEmbedUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && EMBED_HOSTS.includes(u.hostname)
      ? u.toString()
      : '';
  } catch {
    return '';
  }
}

export function hasVideos(property) {
  return Array.isArray(property?.videos) && property.videos.length > 0;
}

export function hasPhotos(property) {
  return Array.isArray(property?.images) && property.images.length > 0;
}

/** Visuel de couverture : première photo, sinon vignette de la première vidéo. */
export function propertyCover(property) {
  return property?.images?.[0]?.url || property?.videos?.[0]?.thumbnail || '';
}

/** Chemin interne de la page d'une vidéo (lien partageable). */
export function videoPath(property, video) {
  const base = `/galerie-video/${property.slug || property._id}`;
  return video?._id ? `${base}?v=${video._id}` : base;
}

/** Lien complet (avec domaine) d'une vidéo, à copier ou partager. */
export function videoUrl(property, video) {
  return `${SITE_URL}${videoPath(property, video)}`;
}

export function formatDuration(seconds) {
  const s = Math.round(Number(seconds) || 0);
  if (s <= 0) return '';
  const m = Math.floor(s / 60);
  const r = String(s % 60).padStart(2, '0');
  return `${m}:${r}`;
}

/**
 * Détection côté navigateur, uniquement pour l'aperçu dans l'admin avant
 * l'enregistrement. La vraie validation est faite par le serveur.
 */
export function guessVideoSource(rawUrl) {
  try {
    const u = new URL(String(rawUrl).trim());
    const host = u.hostname.toLowerCase();

    if (host === 'youtu.be' || host.endsWith('youtube.com')) {
      let id = null;
      if (host === 'youtu.be') id = u.pathname.split('/')[1];
      else if (u.pathname === '/watch') id = u.searchParams.get('v');
      else id = (u.pathname.match(/^\/(?:embed|shorts|live|v)\/([\w-]+)/) || [])[1];
      return {
        source: 'youtube',
        thumbnail: id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '',
      };
    }
    if (host.endsWith('tiktok.com')) return { source: 'tiktok', thumbnail: '' };
    if (host.endsWith('facebook.com') || host === 'fb.watch') {
      return { source: 'facebook', thumbnail: '' };
    }
    return { source: 'external', thumbnail: '' };
  } catch {
    return { source: 'external', thumbnail: '' };
  }
}

/** Vignette d'une vidéo Cloudinary (image extraite à 0 s), pour l'aperçu admin. */
export function cloudinaryThumb(url) {
  if (typeof url !== 'string' || !url.includes('/video/upload/')) return '';
  return url
    .replace('/video/upload/', '/video/upload/so_0,w_800,h_450,c_fill,q_auto,f_jpg/')
    .replace(/\.[a-z0-9]+(\?.*)?$/i, '.jpg');
}
