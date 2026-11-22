import { useEffect, useState, useCallback } from 'react';

/**
 * Installation de l'application (PWA).
 *
 * L'évènement `beforeinstallprompt` n'est émis qu'une seule fois, souvent
 * avant l'affichage des composants. Il est donc capturé ici, au niveau du
 * module, puis partagé avec tous les composants qui utilisent ce hook.
 */

let deferredPrompt = null;
let installedDuringSession = false;
const listeners = new Set();

function notify() {
  listeners.forEach((listener) => listener());
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    notify();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    installedDuringSession = true;
    notify();
  });
}

export function isStandalone() {
  if (typeof window === 'undefined') return false;
  try {
    return (
      window.matchMedia?.('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    );
  } catch {
    return false;
  }
}

export function isIOSDevice() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const iPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  return /iphone|ipad|ipod/i.test(ua) || iPadOS;
}

export default function useInstallPrompt() {
  const [, force] = useState(0);

  useEffect(() => {
    const listener = () => force((n) => n + 1);
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return 'unavailable';

    const promptEvent = deferredPrompt;
    deferredPrompt = null;
    notify();

    try {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      return choice?.outcome === 'accepted' ? 'accepted' : 'dismissed';
    } catch {
      return 'unavailable';
    }
  }, []);

  return {
    canInstall: !!deferredPrompt,
    installed: installedDuringSession || isStandalone(),
    isIOS: isIOSDevice(),
    promptInstall,
  };
}
