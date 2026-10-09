import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Plus, Trash2, Save, Bot, Tag } from 'lucide-react';
import { getAdminFaqs, createFaq, updateFaq, deleteFaq } from '../api/client';

const CATEGORIES = ['general', 'achat', 'location', 'gerance', 'vente', 'conseils', 'btp', 'suivi-chantier', 'contact'];

/**
 * Chaque entrée = une question type + une liste de mots-clés qui, lorsqu'ils
 * apparaissent dans le message d'un visiteur, déclenchent la réponse
 * associée. Pas de clé API, pas de service externe — tout se joue ici.
 */
function FaqCard({ item, onUpdate, onDelete }) {
  const [draft, setDraft] = useState({ ...item, keywordsText: (item.keywords || []).join(', ') });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const keywords = draft.keywordsText.split(',').map((k) => k.trim()).filter(Boolean);
      const payload = { question: draft.question, answer: draft.answer, category: draft.category, active: draft.active, keywords };
      const updated = await updateFaq(draft._id, payload);
      onUpdate({ ...updated, keywordsText: (updated.keywords || []).join(', ') });
    } catch (err) {
      alert(err?.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-[20px] p-6 shadow-soft space-y-3">
      <div className="flex items-center justify-between gap-3">
        <select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className="text-xs font-mono uppercase px-2.5 py-1 rounded-full border border-line outline-none">
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs text-ink/50">
            <input type="checkbox" checked={draft.active} onChange={(e) => setDraft({ ...draft, active: e.target.checked })} />
            Active
          </label>
          <button onClick={() => onDelete(draft._id)} className="text-ink/30 hover:text-brand-red"><Trash2 size={15} /></button>
        </div>
      </div>

      <input
        value={draft.question}
        onChange={(e) => setDraft({ ...draft, question: e.target.value })}
        placeholder="Question type (ex : Comment louer un bien ?)"
        className="w-full px-4 py-2.5 rounded-xl border border-line text-sm font-semibold outline-none focus:border-brand-gold"
      />

      <div>
        <label className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wide text-ink/40 mb-1.5">
          <Tag size={11} /> Mots-clés déclencheurs (séparés par des virgules)
        </label>
        <input
          value={draft.keywordsText}
          onChange={(e) => setDraft({ ...draft, keywordsText: e.target.value })}
          placeholder="louer, location appartement, trouver location"
          className="w-full px-4 py-2.5 rounded-xl border border-line text-sm outline-none focus:border-brand-gold font-mono"
        />
      </div>

      <textarea
        value={draft.answer}
        onChange={(e) => setDraft({ ...draft, answer: e.target.value })}
        placeholder="Réponse que l'Assistant donnera au visiteur…"
        rows={3}
        className="w-full px-4 py-2.5 rounded-xl border border-line text-sm outline-none focus:border-brand-gold"
      />

      <motion.button onClick={handleSave} disabled={saving} whileTap={{ scale: 0.97 }} className="flex items-center gap-2 text-sm font-semibold text-ink">
        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
        Enregistrer
      </motion.button>
    </motion.div>
  );
}

export default function AIKnowledgeManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('');

  function load() {
    setLoading(true);
    getAdminFaqs()
      .then((data) => setItems(data.map((d) => ({ ...d, keywordsText: (d.keywords || []).join(', ') }))))
      .finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function handleAdd() {
    const created = await createFaq({
      question: 'Nouvelle question',
      keywords: ['mot-cle'],
      answer: '',
      category: 'general',
      active: true,
    });
    setItems((list) => [{ ...created, keywordsText: (created.keywords || []).join(', ') }, ...list]);
  }

  function handleUpdate(updated) {
    setItems((list) => list.map((i) => (i._id === updated._id ? updated : i)));
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer cette entrée de la FAQ ?')) return;
    await deleteFaq(id);
    setItems((list) => list.filter((i) => i._id !== id));
  }

  const filtered = filterCategory ? items.filter((i) => i.category === filterCategory) : items;

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-full bg-ink flex items-center justify-center"><Bot size={18} className="text-brand-red" /></span>
          <div>
            <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-ink">Assistant Virtuel</h1>
            <p className="text-ink/55 font-light text-sm mt-1">
              {items.length} question(s) type — répond par mots-clés, sans clé API ni service externe.
            </p>
          </div>
        </div>
        <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={handleAdd} className="flex items-center gap-2 bg-ink text-white text-sm font-semibold px-5 py-3 rounded-full">
          <Plus size={16} /> Ajouter une question
        </motion.button>
      </div>

      <div className="flex gap-2 mt-6 flex-wrap">
        <button onClick={() => setFilterCategory('')} className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase border ${!filterCategory ? 'bg-ink text-white border-ink' : 'border-line text-ink/50'}`}>
          Toutes
        </button>
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setFilterCategory(c)} className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase border ${filterCategory === c ? 'bg-ink text-white border-ink' : 'border-line text-ink/50'}`}>
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 flex justify-center"><Loader2 className="animate-spin text-brand-gold" size={26} /></div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5 mt-6">
          <AnimatePresence>
            {filtered.map((item) => (
              <FaqCard key={item._id} item={item} onUpdate={handleUpdate} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
