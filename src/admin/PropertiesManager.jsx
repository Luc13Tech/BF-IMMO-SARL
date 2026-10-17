import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Loader2, Trash2, X, ImagePlus, Save, Pencil } from 'lucide-react';
import {
  getAllPropertiesAdmin, createProperty, updateProperty, deleteProperty,
  uploadMultipleImages, deleteImage,
} from '../api/client';

// Types de biens existants et nouveaux types autorisés par le backend.
const TYPE_OPTIONS = [
  'villa',
  'appartement',
  'maison',
  'chambre',
  'hotel',
  'terrain',
  'bureau',
  'commerce',
  'autre',
  'realisation_en_cours',
  'projet_en_cours',
  'immeuble',
  'studio',
  'mini_studio',
];

// Les 4 modes de transaction existants.
const LISTING_OPTIONS = [
  { value: 'vente', label: 'À vendre' },
  { value: 'location', label: 'À louer (classique)' },
  { value: 'location_nuitee', label: 'Location par nuitée' },
  { value: 'location_journaliere', label: 'Location journalière' },
];

const TYPE_LABELS = {
  villa: 'Villa',
  appartement: 'Appartement',
  maison: 'Maison',
  chambre: 'Chambre',
  hotel: 'Hôtel',
  terrain: 'Terrain',
  bureau: 'Bureau',
  commerce: 'Commerce',
  autre: 'Autre',
  realisation_en_cours: 'Réalisation en cours',
  projet_en_cours: 'Projet en cours',
  immeuble: 'Immeuble',
  studio: 'Studio',
  mini_studio: 'Mini-studio',
};

const EMPTY = {
  title: '',
  type: 'villa',
  listingType: 'vente',
  price: '',
  location: '',
  bedrooms: 0,
  bathrooms: 0,
  surface: 0,
  description: '',
  status: 'disponible',
  images: [],
  featured: false,
  active: true,
};

// Affiche un prix uniquement lorsqu'il est réellement renseigné.
function formatPrice(price) {
  if (
    price === null ||
    price === undefined ||
    price === '' ||
    (typeof price === 'string' && price.trim() === '')
  ) {
    return 'Prix sur demande';
  }

  const amount = Number(price);

  if (!Number.isFinite(amount) || amount < 0) {
    return 'Prix sur demande';
  }

  return `${amount.toLocaleString('fr-FR')} FCFA`;
}

function PropertyEditorModal({ property, onClose, onSaved }) {
  // Préserve les champs et les images déjà présents sur un bien.
  const [draft, setDraft] = useState(() => ({
    ...EMPTY,
    ...(property || {}),
    price: property?.price ?? '',
    images: Array.isArray(property?.images) ? property.images : [],
  }));

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  async function handleFiles(e) {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);

    try {
      const results = await uploadMultipleImages(files, 'properties');

      setDraft((d) => ({
        ...d,
        images: [...(Array.isArray(d.images) ? d.images : []), ...results],
      }));
    } catch {
      alert("Échec de l'upload. Vérifiez la configuration Cloudinary.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function removeImage(index) {
    const img = draft.images[index];

    setDraft((d) => ({
      ...d,
      images: d.images.filter((_, i) => i !== index),
    }));

    if (img?.publicId) {
      deleteImage(img.publicId).catch(() => {});
    }
  }

  async function handleSave() {
    if (saving || uploading) return;

    if (!draft.title.trim()) {
      alert('Veuillez renseigner le titre du bien.');
      return;
    }

    if (
      draft.price !== '' &&
      draft.price !== null &&
      draft.price !== undefined &&
      (
        !Number.isFinite(Number(draft.price)) ||
        Number(draft.price) < 0
      )
    ) {
      alert('Veuillez saisir un prix valide ou laisser le champ vide.');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...draft,
        title: draft.title.trim(),
        // Un champ vide reste vide côté formulaire et devient null à l'envoi.
        price:
          draft.price === '' ||
          draft.price === null ||
          draft.price === undefined
            ? null
            : Number(draft.price),
        images: Array.isArray(draft.images) ? draft.images : [],
      };

      if (draft._id) {
        const updated = await updateProperty(draft._id, payload);
        onSaved(updated);
      } else {
        const created = await createProperty(payload);
        onSaved(created, true);
      }

      onClose();
    } catch (err) {
      alert(err?.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[26px] w-full max-w-2xl max-h-[88vh] overflow-y-auto p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-sans font-extrabold text-xl text-ink">
            {draft._id ? 'Modifier le bien' : 'Nouveau bien'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-ink/40 hover:text-ink"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <input
            placeholder="Titre (ex : Villa 4 pièces)"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-line text-sm outline-none focus:border-brand-gold"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wide text-ink/40 mb-1.5">
                Type de bien
              </label>
              <select
                value={draft.type}
                onChange={(e) => setDraft({ ...draft, type: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-line text-sm outline-none"
              >
                {TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {TYPE_LABELS[t] || t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wide text-ink/40 mb-1.5">
                Mode
              </label>
              <select
                value={draft.listingType}
                onChange={(e) => setDraft({ ...draft, listingType: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-line text-sm outline-none"
              >
                {LISTING_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wide text-ink/40 mb-1.5">
                Prix en FCFA (facultatif)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="Prix sur demande"
                value={draft.price ?? ''}
                onChange={(e) => setDraft({ ...draft, price: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-line text-sm outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wide text-ink/40 mb-1.5">
                Statut
              </label>
              <select
                value={draft.status}
                onChange={(e) => setDraft({ ...draft, status: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-line text-sm outline-none"
              >
                {['disponible', 'nouveau', 'sous_offre', 'loue', 'vendu'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <input
            placeholder="Localisation (ex : Sicap Keur Massar, Dakar)"
            value={draft.location ?? ''}
            onChange={(e) => setDraft({ ...draft, location: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-line text-sm outline-none focus:border-brand-gold"
          />

          <div className="grid grid-cols-3 gap-4">
            <input
              type="number"
              placeholder="Chambres"
              value={draft.bedrooms ?? 0}
              onChange={(e) => setDraft({ ...draft, bedrooms: e.target.value })}
              className="px-4 py-3 rounded-xl border border-line text-sm outline-none"
            />
            <input
              type="number"
              placeholder="Sdb"
              value={draft.bathrooms ?? 0}
              onChange={(e) => setDraft({ ...draft, bathrooms: e.target.value })}
              className="px-4 py-3 rounded-xl border border-line text-sm outline-none"
            />
            <input
              type="number"
              placeholder="Surface m²"
              value={draft.surface ?? 0}
              onChange={(e) => setDraft({ ...draft, surface: e.target.value })}
              className="px-4 py-3 rounded-xl border border-line text-sm outline-none"
            />
          </div>

          <textarea
            placeholder="Description"
            rows={3}
            value={draft.description ?? ''}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-line text-sm outline-none focus:border-brand-gold"
          />

          <div>
            <p className="text-xs font-mono uppercase tracking-wide text-ink/40 mb-2">
              Photos (Cloudinary)
            </p>
            <div className="flex flex-wrap gap-3">
              {draft.images.map((img, i) => (
                <div
                  key={img.publicId || img.url || i}
                  className="relative w-20 h-20 rounded-xl overflow-hidden group"
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    aria-label="Supprimer cette photo"
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  >
                    <Trash2 size={16} className="text-white" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                aria-label="Ajouter des photos"
                className="w-20 h-20 rounded-xl border-2 border-dashed border-line flex items-center justify-center text-ink/40 hover:border-brand-gold hover:text-brand-gold transition-colors"
              >
                {uploading
                  ? <Loader2 size={18} className="animate-spin" />
                  : <ImagePlus size={18} />}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleFiles}
              />
            </div>
            <p className="text-[11px] text-ink/40 mt-2">
              Sélectionnez une ou plusieurs images depuis la galerie du téléphone ou de l'ordinateur.
            </p>
          </div>

          <label className="flex items-center gap-2 text-sm text-ink/60">
            <input
              type="checkbox"
              checked={Boolean(draft.featured)}
              onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
            />
            Mettre en avant sur la page d'accueil
          </label>
        </div>

        <motion.button
          type="button"
          onClick={handleSave}
          disabled={saving || uploading}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-brand-red text-white font-semibold py-3.5 rounded-full disabled:opacity-70"
        >
          {saving
            ? <Loader2 size={16} className="animate-spin" />
            : <Save size={16} />}
          Enregistrer le bien
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default function PropertiesManager() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  function load() {
    setLoading(true);

    getAllPropertiesAdmin()
      .then(setProperties)
      .catch((err) => {
        console.error('Erreur de chargement des biens :', err);
        alert('Impossible de charger les biens immobiliers.');
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  function handleSaved(updated, isNew) {
    if (!updated?._id) {
      load();
      return;
    }

    setProperties((list) =>
      isNew
        ? [updated, ...list]
        : list.map((p) => (p._id === updated._id ? updated : p))
    );
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer ce bien et ses photos définitivement ?')) return;

    try {
      await deleteProperty(id);
      setProperties((list) => list.filter((p) => p._id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || 'Impossible de supprimer ce bien.');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-ink">
            Biens immobiliers
          </h1>
          <p className="text-ink/55 font-light mt-2">
            {properties.length} bien(s) — ajoutez des photos directement depuis votre galerie.
          </p>
        </div>

        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setEditing({ ...EMPTY, images: [] })}
          className="flex items-center gap-2 bg-ink text-white text-sm font-semibold px-5 py-3 rounded-full"
        >
          <Plus size={16} /> Ajouter un bien
        </motion.button>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <Loader2 className="animate-spin text-brand-gold" size={26} />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
          {properties.map((p) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[20px] overflow-hidden shadow-soft"
            >
              <div className="h-36 bg-gradient-to-br from-ink-soft to-ink relative">
                {p.images?.[0]?.url && (
                  <img src={p.images[0].url} alt="" className="w-full h-full object-cover" />
                )}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 text-[10px] font-mono uppercase">
                  {p.status}
                </span>
              </div>

              <div className="p-5">
                <p className="font-bold text-ink text-sm">{p.title}</p>
                <p className="text-ink/50 text-xs font-mono mt-1">{p.location}</p>
                <p className="text-brand-gold font-bold text-sm mt-2">
                  {formatPrice(p.price)}
                </p>

                <div className="flex items-center gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setEditing(p)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full border border-line text-xs font-semibold text-ink hover:border-brand-gold transition-colors"
                  >
                    <Pencil size={13} /> Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(p._id)}
                    aria-label="Supprimer le bien"
                    className="p-2 rounded-full border border-line text-ink/40 hover:text-brand-red hover:border-brand-red transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {editing && (
          <PropertyEditorModal
            key={editing._id || 'new-property'}
            property={editing._id ? editing : null}
            onClose={() => setEditing(null)}
            onSaved={handleSaved}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
