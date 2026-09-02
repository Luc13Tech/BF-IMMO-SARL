import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { GripVertical, Save, Loader2, Check, Plus, Trash2 } from 'lucide-react';
import { getAllServicesAdmin, updateService, reorderServices } from '../api/client';

function FieldEditor({ field, onChange, onRemove }) {
  return (
    <div className="flex items-center gap-2 bg-offwhite rounded-xl p-3">
      <input
        value={field.label}
        onChange={(e) => onChange({ ...field, label: e.target.value })}
        placeholder="Libellé du champ"
        className="flex-1 px-3 py-2 rounded-lg border border-line text-sm outline-none focus:border-brand-gold"
      />
      <select
        value={field.type}
        onChange={(e) => onChange({ ...field, type: e.target.value })}
        className="px-3 py-2 rounded-lg border border-line text-sm outline-none"
      >
        {['text', 'email', 'tel', 'number', 'select', 'textarea', 'date'].map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <button onClick={onRemove} className="text-ink/30 hover:text-brand-red p-2">
        <Trash2 size={15} />
      </button>
    </div>
  );
}

function ServiceEditor({ service, onSaved }) {
  const [draft, setDraft] = useState(service);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => setDraft(service), [service]);

  function updateField(index, updated) {
    const fields = [...draft.formFields];
    fields[index] = updated;
    setDraft({ ...draft, formFields: fields });
  }

  function addField() {
    setDraft({
      ...draft,
      formFields: [...draft.formFields, { name: `champ_${Date.now()}`, label: 'Nouveau champ', type: 'text', required: true }],
    });
  }

  function removeField(index) {
    setDraft({ ...draft, formFields: draft.formFields.filter((_, i) => i !== index) });
  }

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await updateService(draft._id, draft);
      onSaved(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-[22px] p-6 shadow-soft space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] text-brand-gold uppercase tracking-wide">
          {draft.slug}
        </span>
        <label className="flex items-center gap-2 text-xs text-ink/60">
          <input
            type="checkbox"
            checked={draft.active}
            onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
          />
          Actif sur le site
        </label>
      </div>

      <input
        value={draft.name}
        onChange={(e) => setDraft({ ...draft, name: e.target.value })}
        className="w-full px-4 py-2.5 rounded-xl border border-line text-base font-bold outline-none focus:border-brand-gold"
      />
      <textarea
        value={draft.shortDescription}
        onChange={(e) => setDraft({ ...draft, shortDescription: e.target.value })}
        rows={2}
        className="w-full px-4 py-2.5 rounded-xl border border-line text-sm outline-none focus:border-brand-gold"
      />

      <div>
        <p className="text-xs font-mono uppercase tracking-wide text-ink/40 mb-2">
          Champs du formulaire
        </p>
        <div className="space-y-2">
          {draft.formFields.map((f, i) => (
            <FieldEditor
              key={i}
              field={f}
              onChange={(updated) => updateField(i, updated)}
              onRemove={() => removeField(i)}
            />
          ))}
        </div>
        <button
          onClick={addField}
          className="mt-2 flex items-center gap-1.5 text-brand-red text-sm font-semibold"
        >
          <Plus size={15} /> Ajouter un champ
        </button>
      </div>

      <motion.button
        onClick={handleSave}
        disabled={saving}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 bg-ink text-white text-sm font-semibold px-6 py-3 rounded-full disabled:opacity-70"
      >
        {saving ? (
          <Loader2 size={15} className="animate-spin" />
        ) : saved ? (
          <Check size={15} className="text-emerald-400" />
        ) : (
          <Save size={15} />
        )}
        {saved ? 'Enregistré' : 'Enregistrer'}
      </motion.button>
    </div>
  );
}

export default function ServicesManager() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllServicesAdmin()
      .then(setServices)
      .finally(() => setLoading(false));
  }, []);

  function handleSaved(updated) {
    setServices((list) => list.map((s) => (s._id === updated._id ? updated : s)));
  }

  async function handleReorder(newOrder) {
    setServices(newOrder);
    await reorderServices(newOrder.map((s, i) => ({ id: s._id, order: i + 1 })));
  }

  if (loading) {
    return <Loader2 className="animate-spin text-brand-gold" size={26} />;
  }

  return (
    <div>
      <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-ink">Les 7 métiers</h1>
      <p className="text-ink/55 font-light mt-2 max-w-lg">
        Glissez-déposez pour changer l'ordre d'affichage. Chaque métier garde son propre
        formulaire, entièrement personnalisable.
      </p>

      <Reorder.Group
        axis="y"
        values={services}
        onReorder={handleReorder}
        className="space-y-5 mt-8"
      >
        <AnimatePresence>
          {services.map((service) => (
            <Reorder.Item key={service._id} value={service}>
              <div className="flex items-start gap-3">
                <div className="mt-6 text-ink/25 cursor-grab active:cursor-grabbing">
                  <GripVertical size={18} />
                </div>
                <div className="flex-1">
                  <ServiceEditor service={service} onSaved={handleSaved} />
                </div>
              </div>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </div>
  );
}
