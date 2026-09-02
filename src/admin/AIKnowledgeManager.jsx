import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Plus, Trash2, Save, Bot } from 'lucide-react';
import {
  getAIKnowledgeAdmin,
  createAIKnowledge,
  updateAIKnowledge,
  deleteAIKnowledge,
} from '../api/client';

function KnowledgeCard({ item, onUpdate, onDelete }) {
  const [draft, setDraft] = useState(item);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await updateAIKnowledge(draft._id, draft);
      onUpdate(updated);
    } finally {
      setSaving(false);
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-white rounded-[20px] p-6 shadow-soft space-y-3"
    >
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs text-ink/50">
          <input
            type="checkbox"
            checked={draft.active}
            onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
          />
          Utilisé par l'Assistant
        </label>
        <button onClick={() => onDelete(draft._id)} className="text-ink/30 hover:text-brand-red">
          <Trash2 size={15} />
        </button>
      </div>
      <input
        value={draft.topic}
        onChange={(e) => setDraft({ ...draft, topic: e.target.value })}
        placeholder="Sujet (ex : Processus de visite)"
        className="w-full px-4 py-2.5 rounded-xl border border-line text-sm font-semibold outline-none focus:border-brand-gold"
      />
      <textarea
        value={draft.content}
        onChange={(e) => setDraft({ ...draft, content: e.target.value })}
        placeholder="Information que l'Assistant pourra utiliser pour répondre…"
        rows={3}
        className="w-full px-4 py-2.5 rounded-xl border border-line text-sm outline-none focus:border-brand-gold"
      />
      <motion.button
        onClick={handleSave}
        disabled={saving}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 text-sm font-semibold text-ink"
      >
        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
        Enregistrer
      </motion.button>
    </motion.div>
  );
}

export default function AIKnowledgeManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    getAIKnowledgeAdmin()
      .then(setItems)
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleAdd() {
    const created = await createAIKnowledge({
      topic: 'Nouveau sujet',
      content: '',
      active: true,
    });
    setItems((list) => [created, ...list]);
  }

  function handleUpdate(updated) {
    setItems((list) => list.map((i) => (i._id === updated._id ? updated : i)));
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer cette entrée de connaissance ?')) return;
    await deleteAIKnowledge(id);
    setItems((list) => list.filter((i) => i._id !== id));
  }

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
              Base de connaissance utilisée pour répondre aux visiteurs.
            </p>
          </div>
        </div>
        <motion.button
          onClick={handleAdd}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 bg-ink text-white text-sm font-semibold px-5 py-3 rounded-full"
        >
          <Plus size={16} /> Ajouter un sujet
        </motion.button>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <Loader2 className="animate-spin text-brand-gold" size={26} />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5 mt-8">
          <AnimatePresence>
            {items.map((item) => (
              <KnowledgeCard
                key={item._id}
                item={item}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
