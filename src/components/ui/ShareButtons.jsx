import React, { useEffect, useRef, useState } from 'react';
import { Link2, Check, Share2, MessageCircle } from 'lucide-react';
import {
  copyText,
  canNativeShare,
  nativeShare,
  whatsappShareUrl,
} from '../../utils/share';

/**
 * Boutons « Copier le lien », « Partager » et « WhatsApp » pour un lien donné.
 * `theme` : "light" (fond clair) ou "dark" (fond sombre).
 */
export default function ShareButtons({
  url,
  title,
  text = '',
  theme = 'light',
  className = '',
}) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const base =
    theme === 'dark'
      ? 'border-white/20 text-white hover:border-brand-goldSoft hover:text-brand-goldSoft'
      : 'border-line bg-white text-ink hover:border-brand-gold hover:text-brand-gold';

  const btn = `inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-[13px] font-semibold transition-colors ${base}`;

  async function handleCopy() {
    const ok = await copyText(url);
    setCopied(ok);
    setFailed(!ok);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setCopied(false);
      setFailed(false);
    }, 2200);
  }

  async function handleShare() {
    const done = await nativeShare({ title, text, url });
    if (!done && !canNativeShare()) handleCopy();
  }

  return (
    <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>
      <button type="button" onClick={handleCopy} className={btn}>
        {copied ? (
          <Check size={15} className="text-emerald-500" aria-hidden="true" />
        ) : (
          <Link2 size={15} aria-hidden="true" />
        )}
        {copied ? 'Lien copié' : failed ? 'Copie impossible' : 'Copier le lien'}
      </button>

      <button type="button" onClick={handleShare} className={btn}>
        <Share2 size={15} aria-hidden="true" />
        Partager
      </button>

      <a
        href={whatsappShareUrl(title || text, url)}
        target="_blank"
        rel="noopener noreferrer"
        className={btn}
      >
        <MessageCircle size={15} aria-hidden="true" />
        WhatsApp
      </a>

      <span className="sr-only" role="status" aria-live="polite">
        {copied ? 'Lien copié dans le presse-papiers' : ''}
      </span>
    </div>
  );
}
