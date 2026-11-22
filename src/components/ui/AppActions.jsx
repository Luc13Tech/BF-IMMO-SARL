import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Download,
  Link2,
  Check,
  Share2,
  Smartphone,
  X,
  MoreVertical,
} from 'lucide-react';
import useInstallPrompt from '../../hooks/useInstallPrompt';
import { SITE_URL } from './SEO';
import {
  copyText,
  canNativeShare,
  nativeShare,
  whatsappShareUrl,
} from '../../utils/share';

const SHARE_TITLE = 'BF IMMO SARL';
const SHARE_TEXT =
  "Découvrez BF IMMO SARL : achat, location, gérance et BTP à Dakar.";

/** Explications d'installation quand le navigateur ne propose pas l'installation directe. */
function InstallHelpModal({ open, onClose, isIOS }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/70 p-4 sm:items-center"
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Installer l'application BF IMMO"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-[26px] bg-white p-7 shadow-soft"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="absolute right-4 top-4 rounded-full p-2 text-ink/50 hover:text-ink"
            >
              <X size={18} />
            </button>

            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gold/15 text-brand-gold">
              <Smartphone size={22} aria-hidden="true" />
            </span>

            <h2 className="mt-4 font-sans text-xl font-extrabold text-ink">
              Installer BF IMMO
            </h2>
            <p className="mt-1 text-sm text-ink/60">
              Ajoutez l'application sur votre écran d'accueil pour y accéder en
              un geste, même avec une connexion lente.
            </p>

            {isIOS ? (
              <ol className="mt-5 space-y-3 text-sm text-ink/80">
                <li className="flex gap-3">
                  <b className="font-mono text-brand-gold">1.</b>
                  <span>
                    Ouvrez ce site dans <b>Safari</b>, puis touchez le bouton{' '}
                    <b>Partager</b> (le carré avec une flèche vers le haut).
                  </span>
                </li>
                <li className="flex gap-3">
                  <b className="font-mono text-brand-gold">2.</b>
                  <span>
                    Faites défiler puis touchez{' '}
                    <b>« Sur l'écran d'accueil »</b>.
                  </span>
                </li>
                <li className="flex gap-3">
                  <b className="font-mono text-brand-gold">3.</b>
                  <span>
                    Touchez <b>Ajouter</b> : l'icône BF IMMO apparaît sur votre
                    téléphone.
                  </span>
                </li>
              </ol>
            ) : (
              <ol className="mt-5 space-y-3 text-sm text-ink/80">
                <li className="flex gap-3">
                  <b className="font-mono text-brand-gold">1.</b>
                  <span className="inline-flex flex-wrap items-center gap-1">
                    Ouvrez le menu du navigateur
                    <MoreVertical size={14} aria-hidden="true" /> (en haut à
                    droite).
                  </span>
                </li>
                <li className="flex gap-3">
                  <b className="font-mono text-brand-gold">2.</b>
                  <span>
                    Choisissez <b>« Installer l'application »</b> ou{' '}
                    <b>« Ajouter à l'écran d'accueil »</b>.
                  </span>
                </li>
                <li className="flex gap-3">
                  <b className="font-mono text-brand-gold">3.</b>
                  <span>Confirmez : l'icône BF IMMO est ajoutée.</span>
                </li>
              </ol>
            )}

            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              J'ai compris
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/**
 * Trois actions : installer l'application, copier le lien de la plateforme,
 * partager la plateforme.
 *
 * variant :
 *  - "popover" : icône dans la barre de navigation qui ouvre un petit menu
 *  - "list"    : lignes dans le menu mobile plein écran (fond sombre)
 *  - "card"    : bloc complet pour la page Contact (fond clair)
 */
export default function AppActions({ variant = 'card', onAction }) {
  const { canInstall, installed, isIOS, promptInstall } = useInstallPrompt();
  const [copied, setCopied] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const wrapRef = useRef(null);
  const timer = useRef(null);
  const copyTimer = useRef(null);

  useEffect(
    () => () => {
      clearTimeout(timer.current);
      clearTimeout(copyTimer.current);
    },
    []
  );

  // Fermeture du petit menu : clic extérieur ou touche Échap
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  function flash(message) {
    setNotice(message);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setNotice(''), 2500);
  }

  async function handleInstall() {
    if (canInstall) {
      const result = await promptInstall();
      if (result === 'accepted') flash('Application installée');
      else if (result === 'unavailable') setHelpOpen(true);
    } else {
      setHelpOpen(true);
    }
    onAction?.();
    setMenuOpen(false);
  }

  async function handleCopy() {
    const ok = await copyText(SITE_URL);
    setCopied(ok);
    flash(ok ? 'Lien copié' : 'Copie impossible, copiez le lien manuellement');
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 2200);
  }

  async function handleShare() {
    if (canNativeShare()) {
      await nativeShare({ title: SHARE_TITLE, text: SHARE_TEXT, url: SITE_URL });
    } else {
      window.open(
        whatsappShareUrl(SHARE_TEXT, SITE_URL),
        '_blank',
        'noopener,noreferrer'
      );
    }
    onAction?.();
  }

  const items = [
    !installed && {
      key: 'install',
      icon: Download,
      label: "Installer l'application",
      hint: 'Accès direct depuis votre écran',
      onClick: handleInstall,
    },
    {
      key: 'copy',
      icon: copied ? Check : Link2,
      label: copied ? 'Lien copié' : 'Copier le lien du site',
      hint: SITE_URL.replace('https://', ''),
      onClick: handleCopy,
    },
    {
      key: 'share',
      icon: Share2,
      label: 'Partager le site',
      hint: canNativeShare() ? 'Envoyer à un proche' : 'Via WhatsApp',
      onClick: handleShare,
    },
  ].filter(Boolean);

  const help = (
    <InstallHelpModal
      open={helpOpen}
      onClose={() => setHelpOpen(false)}
      isIOS={isIOS}
    />
  );

  const live = (
    <span className="sr-only" role="status" aria-live="polite">
      {notice}
    </span>
  );

  if (variant === 'popover') {
    return (
      <div ref={wrapRef} className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Application : installer, copier le lien, partager"
          aria-expanded={menuOpen}
          aria-haspopup="true"
          title="Application & partage"
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/75 transition-colors hover:border-brand-goldSoft hover:text-white"
        >
          <Smartphone size={16} aria-hidden="true" />
          {!installed && canInstall && (
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-brand-red" />
          )}
        </button>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="absolute right-0 top-full z-50 mt-3 w-72 overflow-hidden rounded-2xl bg-white p-2 shadow-soft"
            >
              {items.map(({ key, icon: Icon, label, hint, onClick }) => (
                <button
                  key={key}
                  type="button"
                  onClick={onClick}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-offwhite"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-gold/15 text-brand-gold">
                    <Icon size={16} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold text-ink">
                      {label}
                    </span>
                    <span className="block truncate font-mono text-[11px] text-ink/50">
                      {hint}
                    </span>
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        {live}
        {help}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="mt-8 border-t border-white/10 pt-6">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-brand-goldSoft">
          Application & partage
        </p>
        <div className="flex flex-col gap-2.5">
          {items.map(({ key, icon: Icon, label, onClick }) => (
            <button
              key={key}
              type="button"
              onClick={onClick}
              className="flex items-center gap-3 rounded-2xl border border-white/12 px-4 py-3.5 text-left text-[15px] font-medium text-white transition-colors active:bg-white/10"
            >
              <Icon size={18} className="text-brand-goldSoft" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
        {live}
        {help}
      </div>
    );
  }

  // variant === 'card'
  return (
    <div className="rounded-[26px] bg-white p-7 shadow-soft">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-gold/15 text-brand-gold">
          <Smartphone size={22} aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-sans text-lg font-extrabold text-ink">
            L'application BF IMMO
          </h2>
          <p className="mt-1 text-sm leading-6 text-ink/60">
            Installez la plateforme sur votre téléphone ou partagez-la avec vos
            proches.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {items.map(({ key, icon: Icon, label, onClick }) => (
          <button
            key={key}
            type="button"
            onClick={onClick}
            className="flex items-center justify-center gap-2 rounded-xl border border-line bg-offwhite px-4 py-3.5 text-[13px] font-semibold text-ink transition-colors hover:border-brand-gold hover:text-brand-gold"
          >
            <Icon size={16} aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      {installed && (
        <p className="mt-4 flex items-center gap-2 text-sm text-emerald-700">
          <Check size={15} aria-hidden="true" /> L'application est déjà installée
          sur cet appareil.
        </p>
      )}
      {live}
      {help}
    </div>
  );
}
