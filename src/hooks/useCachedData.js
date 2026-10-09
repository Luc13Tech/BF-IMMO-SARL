import { useState, useEffect } from 'react';

const CACHE_PREFIX = 'bfimmo_cache_';

/**
 * Vérifie si localStorage est disponible.
 */
function isStorageAvailable() {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch {
    return false;
  }
}

/**
 * Lit les données enregistrées dans le cache.
 */
function readCache(key) {
  if (!isStorageAvailable()) return null;

  try {
    const raw = window.localStorage.getItem(CACHE_PREFIX + key);

    if (!raw) return null;

    const parsed = JSON.parse(raw);

    if (
      !parsed ||
      typeof parsed !== 'object' ||
      !Object.prototype.hasOwnProperty.call(parsed, 'data')
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

/**
 * Enregistre les données dans le cache.
 */
function writeCache(key, data) {
  if (!isStorageAvailable()) return;

  try {
    window.localStorage.setItem(
      CACHE_PREFIX + key,
      JSON.stringify({
        data,
        savedAt: Date.now(),
      })
    );
  } catch {
    // Le cache est facultatif :
    // un stockage plein ou indisponible ne bloque pas l'application.
  }
}

/**
 * Supprime une entrée du cache.
 */
export function clearCachedData(key) {
  if (!isStorageAvailable()) return;

  try {
    window.localStorage.removeItem(CACHE_PREFIX + key);
  } catch {
    // Suppression du cache non bloquante.
  }
}

/**
 * Hook de récupération et de mise en cache des données.
 *
 * @param {string} key Clé unique du cache.
 * @param {Function} fetchFn Fonction retournant une Promise de données.
 * @param {Array} deps Dépendances qui déclenchent une nouvelle récupération.
 *
 * @returns {{ data: *, loading: boolean, error: Error|null, isStale: boolean }}
 */
export function useCachedData(key, fetchFn, deps = []) {
  const [data, setData] = useState(() => readCache(key)?.data ?? null);
  const [loading, setLoading] = useState(() => !readCache(key));
  const [error, setError] = useState(null);
  const [isStale, setIsStale] = useState(() => !!readCache(key));

  useEffect(() => {
    let cancelled = false;

    const cached = readCache(key);

    if (cached) {
      setData(cached.data);
      setIsStale(true);
      setLoading(false);
    } else {
      setLoading(true);
    }

    setError(null);

    Promise.resolve()
      .then(() => fetchFn())
      .then((freshData) => {
        if (cancelled) return;

        setData(freshData);
        setError(null);
        setIsStale(false);

        writeCache(key, freshData);
      })
      .catch((err) => {
        if (cancelled) return;

        // Conserve les données en cache si l'API est indisponible.
        if (!cached) {
          setError(
            err instanceof Error
              ? err
              : new Error('Impossible de récupérer les données.')
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };

    // Les dépendances sont fournies par le composant appelant.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, ...deps]);

  return {
    data,
    loading,
    error,
    isStale,
  };
}

export default useCachedData;
