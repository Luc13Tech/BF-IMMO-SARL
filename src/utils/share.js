/**
 * Copier / partager un lien. Fonctionne aussi quand l'API presse-papiers
 * moderne est indisponible (anciens navigateurs, certains navigateurs intégrés).
 */

export async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // on tente la méthode de secours ci-dessous
  }

  try {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

export function canNativeShare() {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

/** Ouvre le menu de partage du téléphone. Retourne false si annulé ou indisponible. */
export async function nativeShare({ title, text, url }) {
  if (!canNativeShare()) return false;
  try {
    await navigator.share({ title, text, url });
    return true;
  } catch {
    return false; // annulé par l'utilisateur
  }
}

export function whatsappShareUrl(text, url) {
  return `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`.trim())}`;
}
