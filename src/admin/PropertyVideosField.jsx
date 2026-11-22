import React, { useEffect, useRef, useState } from 'react';
import {
  Film,
  Loader2,
  Trash2,
  Upload,
  Link2,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { uploadVideoToCloudinary, MAX_VIDEO_MB } from '../utils/uploadVideo';
import { deleteVideoAsset } from '../api/client';
import {
  SOURCE_LABELS,
  cloudinaryThumb,
  formatDuration,
  guessVideoSource,
} from '../utils/video';

const MAX_VIDEOS = 10;

function baseName(fileName) {
  return String(fileName || 'Vidéo')
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .trim()
    .slice(0, 120);
}

/**
 * Champ « Vidéos du bien » de l'éditeur de bien (admin).
 *
 * - Téléverser un fichier (envoyé directement vers Cloudinary, avec progression)
 * - ou coller un lien YouTube / Facebook / TikTok / .mp4
 *
 * `onChange` reçoit une fonction `(liste) => nouvelleListe`.
 * `sessionIds` (ref) mémorise les vidéos téléversées pendant cette ouverture de
 * l'éditeur : si l'admin annule, elles sont supprimées de Cloudinary par le parent.
 */
export default function PropertyVideosField({ videos, onChange, sessionIds, onBusyChange }) {
  const fileRef = useRef(null);
  const [uploads, setUploads] = useState([]); // [{ key, name, progress, error }]
  const [link, setLink] = useState('');
  const [linkError, setLinkError] = useState('');

  const list = Array.isArray(videos) ? videos : [];
  const busy = uploads.some((u) => !u.error);
  const slotsLeft = MAX_VIDEOS - list.length;

  // Prévient l'éditeur : pas d'enregistrement tant qu'un téléversement est en cours.
  useEffect(() => {
    onBusyChange?.(busy);
  }, [busy, onBusyChange]);

  function patchUpload(key, patch) {
    setUploads((current) =>
      current.map((u) => (u.key === key ? { ...u, ...patch } : u))
    );
  }

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    if (fileRef.current) fileRef.current.value = '';
    if (!files.length) return;

    let addedCount = 0;

    for (const file of files) {
      const key = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      if (!file.type.startsWith('video/')) {
        setUploads((c) => [...c, { key, name: file.name, progress: 0, error: 'Ce fichier n\'est pas une vidéo.' }]);
        continue;
      }
      if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
        setUploads((c) => [
          ...c,
          {
            key,
            name: file.name,
            progress: 0,
            error: `Trop lourde (${Math.round(file.size / 1024 / 1024)} Mo). Maximum ${MAX_VIDEO_MB} Mo : compressez la vidéo (20 à 50 Mo suffisent).`,
          },
        ]);
        continue;
      }
      if (list.length + addedCount >= MAX_VIDEOS) {
        setUploads((c) => [
          ...c,
          { key, name: file.name, progress: 0, error: `Maximum ${MAX_VIDEOS} vidéos par bien.` },
        ]);
        continue;
      }

      setUploads((c) => [...c, { key, name: file.name, progress: 0, error: '' }]);

      try {
        const result = await uploadVideoToCloudinary(file, (progress) =>
          patchUpload(key, { progress })
        );

        sessionIds?.current?.add(result.publicId);

        addedCount += 1;
        const newVideo = {
          title: baseName(file.name),
          source: 'cloudinary',
          url: result.url,
          publicId: result.publicId,
          duration: result.duration,
          thumbnail: cloudinaryThumb(result.url),
        };
        // Mise à jour immédiate (fonction) : la vidéo apparaît dès qu'elle est prête,
        // sans écraser les modifications faites pendant le téléversement.
        onChange((current) => [...current, newVideo]);
        setUploads((c) => c.filter((u) => u.key !== key));
      } catch (err) {
        patchUpload(key, {
          error: err?.response?.data?.message || err?.message || 'Échec du téléversement.',
        });
      }
    }
  }

  function handleAddLink() {
    const value = link.trim();
    setLinkError('');

    if (!value) return;
    if (list.length >= MAX_VIDEOS) {
      setLinkError(`Maximum ${MAX_VIDEOS} vidéos par bien.`);
      return;
    }

    let parsed;
    try {
      parsed = new URL(value);
    } catch {
      setLinkError('Lien invalide. Collez l\'adresse complète de la vidéo.');
      return;
    }
    if (parsed.protocol !== 'https:') {
      setLinkError('Le lien doit commencer par https://');
      return;
    }
    if (list.some((v) => v.url === parsed.toString() || v.url === value)) {
      setLinkError('Cette vidéo est déjà ajoutée.');
      return;
    }

    const guess = guessVideoSource(value);
    onChange((current) => [
      ...current,
      { title: '', source: guess.source, url: value, thumbnail: guess.thumbnail },
    ]);
    setLink('');
  }

  function updateTitle(index, title) {
    onChange((current) =>
      current.map((v, i) => (i === index ? { ...v, title } : v))
    );
  }

  function move(index, delta) {
    const target = index + delta;
    if (target < 0 || target >= list.length) return;
    onChange((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function remove(index) {
    const video = list[index];
    onChange((current) => current.filter((_, i) => i !== index));

    // Vidéo téléversée pendant cette session et jamais enregistrée : on la supprime tout de suite.
    // Une vidéo déjà enregistrée n'est supprimée de Cloudinary qu'à l'enregistrement du bien.
    if (video?.publicId && sessionIds?.current?.has(video.publicId)) {
      sessionIds.current.delete(video.publicId);
      deleteVideoAsset(video.publicId).catch(() => {});
    }
  }

  return (
    <div>
      <p className="text-xs font-mono uppercase tracking-wide text-ink/40 mb-2">
        Vidéos du bien ({list.length}/{MAX_VIDEOS})
      </p>

      {list.length > 0 && (
        <ul className="space-y-3 mb-3">
          {list.map((video, i) => (
            <li
              key={video._id || video.publicId || video.url}
              className="flex items-center gap-3 rounded-2xl border border-line p-2.5"
            >
              <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-ink-soft to-ink">
                {video.thumbnail ? (
                  <img src={video.thumbnail} alt="" className="h-full w-full object-cover" />
                ) : (
                  <Film size={18} className="absolute inset-0 m-auto text-white/60" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <input
                  value={video.title || ''}
                  onChange={(e) => updateTitle(i, e.target.value)}
                  maxLength={120}
                  placeholder="Titre de la vidéo (ex : Visite du salon)"
                  aria-label="Titre de la vidéo"
                  className="w-full rounded-lg border border-line px-3 py-1.5 text-[13px] outline-none focus:border-brand-gold"
                />
                <p className="mt-1 font-mono text-[10.5px] text-ink/45">
                  {SOURCE_LABELS[video.source] || 'Vidéo'}
                  {video.duration > 0 ? ` · ${formatDuration(video.duration)}` : ''}
                  {i === 0 ? ' · vignette principale' : ''}
                </p>
              </div>

              <div className="flex shrink-0 flex-col gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label="Monter la vidéo"
                  className="rounded-md p-1 text-ink/40 hover:text-ink disabled:opacity-25"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === list.length - 1}
                  aria-label="Descendre la vidéo"
                  className="rounded-md p-1 text-ink/40 hover:text-ink disabled:opacity-25"
                >
                  <ArrowDown size={14} />
                </button>
              </div>

              <button
                type="button"
                onClick={() => remove(i)}
                aria-label="Supprimer cette vidéo"
                className="shrink-0 rounded-full border border-line p-2 text-ink/40 transition-colors hover:border-brand-red hover:text-brand-red"
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {uploads.length > 0 && (
        <ul className="space-y-2 mb-3" aria-live="polite">
          {uploads.map((u) => (
            <li
              key={u.key}
              className={`rounded-xl border px-3 py-2.5 text-[12.5px] ${
                u.error ? 'border-red-200 bg-red-50 text-brand-redDark' : 'border-line'
              }`}
            >
              <div className="flex items-start gap-2">
                {u.error ? (
                  <AlertCircle size={15} className="mt-0.5 shrink-0" />
                ) : (
                  <Loader2 size={15} className="mt-0.5 shrink-0 animate-spin text-brand-gold" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{u.name}</p>
                  {u.error ? (
                    <p className="mt-0.5">{u.error}</p>
                  ) : (
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink/10">
                      <div
                        className="h-full rounded-full bg-brand-gold transition-all"
                        style={{ width: `${u.progress}%` }}
                      />
                    </div>
                  )}
                </div>
                {u.error ? (
                  <button
                    type="button"
                    onClick={() => setUploads((c) => c.filter((x) => x.key !== u.key))}
                    className="shrink-0 text-[11px] font-semibold underline"
                  >
                    Fermer
                  </button>
                ) : (
                  <span className="shrink-0 font-mono text-[11px]">{u.progress}%</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy || slotsLeft <= 0}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line px-4 py-3 text-[13px] font-semibold text-ink/55 transition-colors hover:border-brand-gold hover:text-brand-gold disabled:opacity-50"
          >
            {busy ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {busy ? 'Téléversement…' : 'Téléverser une vidéo'}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="video/*"
            multiple
            hidden
            onChange={handleFiles}
          />
        </div>

        <div className="flex gap-2">
          <input
            type="url"
            inputMode="url"
            value={link}
            onChange={(e) => {
              setLink(e.target.value);
              setLinkError('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddLink();
              }
            }}
            placeholder="Coller un lien (YouTube, Facebook, TikTok…)"
            aria-label="Lien de la vidéo"
            className="min-w-0 flex-1 rounded-xl border border-line px-3 py-2.5 text-[13px] outline-none focus:border-brand-gold"
          />
          <button
            type="button"
            onClick={handleAddLink}
            aria-label="Ajouter ce lien"
            className="shrink-0 rounded-xl bg-ink px-3.5 text-white transition-opacity hover:opacity-90"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {linkError && (
        <p className="mt-2 flex items-center gap-1.5 text-[12px] text-brand-redDark" role="alert">
          <Link2 size={13} /> {linkError}
        </p>
      )}

      <p className="mt-2 text-[11px] leading-5 text-ink/40">
        Fichier : {MAX_VIDEO_MB} Mo maximum par vidéo (compressez à 20–50 Mo pour un chargement
        rapide sur mobile). Liens acceptés : YouTube, Facebook, TikTok ou fichier .mp4. Les
        vidéos sont enregistrées avec le bien : n'oubliez pas « Enregistrer le bien ».
      </p>
    </div>
  );
}
