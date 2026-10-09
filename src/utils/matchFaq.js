/**
 * Moteur de correspondance par mots-clés pour l'Assistant Virtuel.
 * Fonctionne entièrement dans le navigateur — aucune clé API, aucun appel
 * externe, aucun coût par question posée.
 *
 * Principe : chaque entrée FAQ porte une liste de mots-clés/expressions.
 * On normalise la question du visiteur (minuscules, sans accents, sans
 * ponctuation), puis on compte combien de mots-clés de chaque entrée y
 * apparaissent. L'entrée avec le meilleur score l'emporte ; en cas
 * d'égalité, le mot-clé le plus long/spécifique départage.
 */

function normalize(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // retire les accents
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ') // ponctuation -> espace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * @param {Array<{question:string, keywords:string[], answer:string}>} faqs
 * @param {string} userText - question tapée par le visiteur
 * @param {number} minScore - score minimum pour accepter une correspondance
 * @returns {{faq: object, score: number} | null}
 */
export function matchFaq(faqs, userText, minScore = 1) {
  const normalizedInput = normalize(userText);
  if (!normalizedInput) return null;

  let best = null;
  let bestScore = 0;

  for (const faq of faqs) {
    let score = 0;
    for (const kw of faq.keywords || []) {
      const normalizedKw = normalize(kw);
      if (!normalizedKw) continue;
      if (normalizedInput.includes(normalizedKw)) {
        // une expression plus longue/spécifique pèse davantage qu'un mot isolé
        score += 1 + normalizedKw.split(' ').length * 0.25;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = faq;
    }
  }

  if (!best || bestScore < minScore) return null;
  return { faq: best, score: bestScore };
}

export const FALLBACK_MESSAGE =
  "Je n'ai pas de réponse précise à cette question pour le moment. Contactez-nous directement sur WhatsApp, un conseiller BF IMMO vous répondra rapidement.";
