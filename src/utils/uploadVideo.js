import { getVideoUploadSignature } from '../api/client';

/**
 * Téléversement d'une vidéo DIRECTEMENT vers Cloudinary (sans passer par Render).
 *
 * - Le serveur ne fournit qu'une signature courte, réservée aux admins connectés.
 * - Le fichier est envoyé par morceaux de 6 Mo : plus fiable sur une connexion
 *   mobile instable, avec 2 nouvelles tentatives par morceau.
 */

const CHUNK_SIZE = 6 * 1024 * 1024;
export const MAX_VIDEO_MB = 100;

function uniqueId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

function sendChunk({ cloudName, params, blob, headers, onLoaded }) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`);
    Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onLoaded(e.loaded);
    };

    xhr.onload = () => {
      let body = null;
      try {
        body = JSON.parse(xhr.responseText);
      } catch {
        // réponse non JSON
      }
      if (xhr.status >= 200 && xhr.status < 300) return resolve(body);
      reject(new Error(body?.error?.message || `Échec du téléversement (${xhr.status}).`));
    };

    xhr.onerror = () => reject(new Error('Connexion interrompue pendant le téléversement.'));

    const form = new FormData();
    form.append('file', blob);
    Object.entries(params).forEach(([k, v]) => form.append(k, v));
    xhr.send(form);
  });
}

/**
 * @param {File} file
 * @param {(percent:number)=>void} onProgress
 * @returns {Promise<{url:string, publicId:string, duration:number}>}
 */
export async function uploadVideoToCloudinary(file, onProgress = () => {}) {
  const sig = await getVideoUploadSignature();

  const params = {
    api_key: sig.apiKey,
    timestamp: sig.timestamp,
    folder: sig.folder,
    signature: sig.signature,
  };

  const total = file.size;
  const chunkCount = Math.max(1, Math.ceil(total / CHUNK_SIZE));
  const id = uniqueId();
  let result = null;

  for (let i = 0; i < chunkCount; i += 1) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, total);
    const blob = file.slice(start, end);

    const headers =
      chunkCount > 1
        ? {
            'X-Unique-Upload-Id': id,
            'Content-Range': `bytes ${start}-${end - 1}/${total}`,
          }
        : {};

    let attempt = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        result = await sendChunk({
          cloudName: sig.cloudName,
          params,
          blob,
          headers,
          onLoaded: (loaded) =>
            onProgress(Math.min(99, Math.round(((start + loaded) / total) * 100))),
        });
        break;
      } catch (err) {
        attempt += 1;
        if (attempt > 2) throw err;
        await new Promise((r) => setTimeout(r, 1000 * attempt));
      }
    }
  }

  onProgress(100);

  if (!result?.secure_url || !result?.public_id) {
    throw new Error('Réponse Cloudinary incomplète. Réessayez.');
  }

  return {
    url: result.secure_url,
    publicId: result.public_id,
    duration: Number(result.duration) || 0,
  };
}
