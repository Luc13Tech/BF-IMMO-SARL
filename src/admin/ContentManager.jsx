import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Save, Check } from 'lucide-react';
import { getAllContentAdmin, bulkUpdateContent } from '../api/client';

const SECTIONS_ORDER = ['accueil', 'a_propos', 'contact', 'legal', 'general'];
const SECTION_LABELS = {
  accueil: "Page d'accueil",
  a_propos: 'À propos',
  contact: 'Contact',
  legal: 'Mentions légales',
  general: 'Général',
};

export default function ContentManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getAllContentAdmin()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  function updateValue(key, value) {
    setItems((list) => list.map((i) => (i.key === key ? { ...i, value } : i)));
  }

  async function handleSaveAll() {
    setSaving(true);
    try {
      await bulkUpdateContent(items);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <Loader2 className="animate-spin text-brand-gold" size={26} />;
  }

  const grouped = SECTIONS_ORDER.map((section) => ({
    section,
    items: items.filter((i) => (i.section || 'general') === section),
  })).filter((g) => g.items.length > 0);

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-ink">
            Contenu du site
          </h1>
          <p className="text-ink/55 font-light mt-2">
            Modifiez ici tous les textes affichés sur la plateforme publique.
          </p>
        </div>
        <motion.button
          onClick={handleSaveAll}
          disabled={saving}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 bg-brand-red text-white text-sm font-semibold px-6 py-3 rounded-full disabled:opacity-70"
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : saved ? (
            <Check size={16} />
          ) : (
            <Save size={16} />
          )}
          {saved ? 'Enregistré' : 'Tout enregistrer'}
        </motion.button>
      </div>

      <div className="space-y-8 mt-8">
        {grouped.map((group) => (
          <div key={group.section}>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-gold mb-3">
              {SECTION_LABELS[group.section] || group.section}
            </h2>
            <div className="bg-white rounded-[20px] shadow-soft divide-y divide-line">
              {group.items.map((item) => (
                <div key={item.key} className="p-5">
                  <label className="block text-xs font-mono text-ink/40 mb-2">
                    {item.label || item.key}
                  </label>
                  {String(item.value).length > 80 ? (
                    <textarea
                      value={item.value}
                      onChange={(e) => updateValue(item.key, e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-line text-sm outline-none focus:border-brand-gold"
                    />
                  ) : (
                    <input
                      value={item.value}
                      onChange={(e) => updateValue(item.key, e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-line text-sm outline-none focus:border-brand-gold"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
