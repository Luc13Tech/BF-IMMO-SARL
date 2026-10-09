import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Plus, Trash2, Save, Bot, Tag } from 'lucide-react';
import {
  getAdminFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
} from '../api/client';

const CATEGORIES = [
  'general',
  'achat',
  'location',
  'gerance',
  'vente',
  'conseils',
  'btp',
  'suivi-chantier',
  'contact',
];

function getErrorMessage(err, fallback) {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    fallback
  );
}

/**
 * Chaque entrée = une question type + une liste de mots-clés qui, lorsqu'ils
 * apparaissent dans le message d'un visiteur, déclenchent la réponse
 * associée. Pas de clé API, pas de service externe — tout se joue ici.
 */
function FaqCard({ item, onUpdate, onDelete, onCreate }) {
  const [draft, setDraft] = useState({
    ...item,
    keywordsText: (item.keywords || []).join(', '),
  });

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSave() {
    if (saving || deleting) return;

    if (!draft.question?.trim()) {
      alert('Veuillez saisir une question.');
      return;
    }

    if (!draft.answer?.trim()) {
      alert('Veuillez saisir une réponse.');
      return;
    }

    const keywords = (draft.keywordsText || '')
      .split(',')
      .map((keyword) => keyword.trim())
      .filter(Boolean);

    if (keywords.length === 0) {
      alert('Veuillez saisir au moins un mot-clé.');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        question: draft.question.trim(),
        answer: draft.answer.trim(),
        category: draft.category || 'general',
        active: Boolean(draft.active),
        keywords,
      };

      if (item.isNew) {
        // Création réelle uniquement après validation du formulaire.
        await onCreate(draft._id, payload);
      } else {
        // Mise à jour d'une question déjà enregistrée.
        const updated = await updateFaq(draft._id, payload);

        onUpdate({
          ...updated,
          keywordsText: (updated.keywords || []).join(', '),
        });
      }

      alert('Question enregistrée avec succès.');
    } catch (err) {
      alert(
        getErrorMessage(
          err,
          "Erreur lors de l'enregistrement."
        )
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (deleting || saving) return;

    // Une carte qui n'a pas encore été enregistrée est uniquement locale.
    if (item.isNew) {
      onDelete(item._id);
      return;
    }

    await onDelete(
      draft._id,
      () => setDeleting(true),
      () => setDeleting(false)
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-white rounded-[20px] p-6 shadow-soft space-y-3"
    >
      <div className="flex items-center justify-between gap-3">
        <select
          value={draft.category || 'general'}
          onChange={(e) =>
            setDraft({ ...draft, category: e.target.value })
          }
          className="text-xs font-mono uppercase px-2.5 py-1 rounded-full border border-line outline-none"
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs text-ink/50">
            <input
              type="checkbox"
              checked={Boolean(draft.active)}
              onChange={(e) =>
                setDraft({ ...draft, active: e.target.checked })
              }
            />
            Active
          </label>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting || saving}
            className="text-ink/30 hover:text-brand-red disabled:opacity-50"
            aria-label="Supprimer cette question"
          >
            {deleting ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Trash2 size={15} />
            )}
          </button>
        </div>
      </div>

      <input
        value={draft.question || ''}
        onChange={(e) =>
          setDraft({ ...draft, question: e.target.value })
        }
        placeholder="Question type (ex : Comment louer un bien ?)"
        className="w-full px-4 py-2.5 rounded-xl border border-line text-sm font-semibold outline-none focus:border-brand-gold"
      />

      <div>
        <label className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wide text-ink/40 mb-1.5">
          <Tag size={11} />
          Mots-clés déclencheurs (séparés par des virgules)
        </label>

        <input
          value={draft.keywordsText || ''}
          onChange={(e) =>
            setDraft({ ...draft, keywordsText: e.target.value })
          }
          placeholder="louer, location appartement, trouver location"
          className="w-full px-4 py-2.5 rounded-xl border border-line text-sm outline-none focus:border-brand-gold font-mono"
        />
      </div>

      <textarea
        value={draft.answer || ''}
        onChange={(e) =>
          setDraft({ ...draft, answer: e.target.value })
        }
        placeholder="Réponse que l'Assistant donnera au visiteur…"
        rows={3}
        className="w-full px-4 py-2.5 rounded-xl border border-line text-sm outline-none focus:border-brand-gold"
      />

      <motion.button
        type="button"
        onClick={handleSave}
        disabled={saving || deleting}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 text-sm font-semibold text-ink disabled:opacity-50"
      >
        {saving ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Save size={14} />
        )}
        Enregistrer
      </motion.button>
    </motion.div>
  );
}

export default function AIKnowledgeManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  async function load() {
    setLoading(true);
    setLoadError('');

    try {
      const data = await getAdminFaqs();

      if (!Array.isArray(data)) {
        throw new Error(
          'Le serveur a retourné une réponse inattendue.'
        );
      }

      setItems(
        data.map((item) => ({
          ...item,
          keywordsText: (item.keywords || []).join(', '),
        }))
      );
    } catch (err) {
      setLoadError(
        getErrorMessage(
          err,
          'Impossible de charger les questions.'
        )
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function handleAdd() {
    // Création d'une carte locale : aucun appel API à ce stade.
    const temporaryId = `new-${Date.now()}`;

    setItems((list) => [
      {
        _id: temporaryId,
        question: '',
        keywords: [],
        keywordsText: '',
        answer: '',
        category: 'general',
        active: true,
        isNew: true,
      },
      ...list,
    ]);

    setFilterCategory('');
  }

  async function handleCreate(temporaryId, payload) {
    const created = await createFaq(payload);

    if (!created?._id) {
      throw new Error(
        'Le serveur n’a pas confirmé la création de la question.'
      );
    }

    // Remplace la carte temporaire par la véritable entrée du serveur.
    setItems((list) =>
      list.map((entry) =>
        entry._id === temporaryId
          ? {
              ...created,
              keywordsText: (created.keywords || []).join(', '),
              isNew: false,
            }
          : entry
      )
    );

    return created;
  }

  function handleUpdate(updated) {
    setItems((list) =>
      list.map((item) =>
        item._id === updated._id ? updated : item
      )
    );
  }

  async function handleDelete(id, onStart, onFinish) {
    // Suppression d'une carte temporaire : rien à supprimer sur le serveur.
    if (String(id).startsWith('new-')) {
      setItems((list) =>
        list.filter((item) => item._id !== id)
      );
      return;
    }

    if (!window.confirm('Supprimer cette entrée de la FAQ ?')) {
      return;
    }

    onStart?.();

    try {
      await deleteFaq(id);

      setItems((list) =>
        list.filter((item) => item._id !== id)
      );
    } catch (err) {
      alert(
        getErrorMessage(
          err,
          'Erreur lors de la suppression.'
        )
      );
    } finally {
      onFinish?.();
    }
  }

  const filtered = filterCategory
    ? items.filter((item) => item.category === filterCategory)
    : items;

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-full bg-ink flex items-center justify-center">
            <Bot size={18} className="text-brand-red" />
          </span>

          <div>
            <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-ink">
              Assistant Virtuel
            </h1>

            <p className="text-ink/55 font-light text-sm mt-1">
              {items.length} question(s) type — répond par mots-clés, sans clé API ni service externe.
            </p>
          </div>
        </div>

        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleAdd}
          className="flex items-center gap-2 bg-ink text-white text-sm font-semibold px-5 py-3 rounded-full"
        >
          <Plus size={16} />
          Ajouter une question
        </motion.button>
      </div>

      <div className="flex gap-2 mt-6 flex-wrap">
        <button
          type="button"
          onClick={() => setFilterCategory('')}
          className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase border ${
            !filterCategory
              ? 'bg-ink text-white border-ink'
              : 'border-line text-ink/50'
          }`}
        >
          Toutes
        </button>

        {CATEGORIES.map((category) => (
          <button
            type="button"
            key={category}
            onClick={() => setFilterCategory(category)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase border ${
              filterCategory === category
                ? 'bg-ink text-white border-ink'
                : 'border-line text-ink/50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <Loader2
            className="animate-spin text-brand-gold"
            size={26}
          />
        </div>
      ) : loadError ? (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>{loadError}</p>
          <button
            type="button"
            onClick={load}
            className="mt-3 underline font-semibold"
          >
            Réessayer
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5 mt-6">
          <AnimatePresence>
            {filtered.map((item) => (
              <FaqCard
                key={item._id}
                item={item}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onCreate={handleCreate}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
