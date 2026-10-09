import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, SearchX } from 'lucide-react';
import { getProperties } from '../api/client';
import { useCachedData } from '../hooks/useCachedData';
import { PropertiesGridSkeleton } from '../components/ui/Skeleton';
import PropertyCard from '../components/properties/PropertyCard';
import SEO from '../components/ui/SEO';

const TYPES = [
  { value: '', label: 'Tous types' },
  { value: 'villa', label: 'Villa' },
  { value: 'appartement', label: 'Appartement' },
  { value: 'maison', label: 'Maison' },
  { value: 'chambre', label: 'Chambre' },
  { value: 'hotel', label: 'Hôtel' },
  { value: 'terrain', label: 'Terrain' },
  { value: 'bureau', label: 'Bureau' },
  { value: 'commerce', label: 'Commerce' },
];

// Les 4 modes de location demandés, en plus de "tous"
const LISTING = [
  { value: '', label: 'Tous les biens' },
  { value: 'vente', label: 'À vendre' },
  { value: 'location', label: 'À louer' },
  { value: 'location_nuitee', label: 'Par nuitée' },
  { value: 'location_journaliere', label: 'À la journée' },
];

export default function Properties() {
  const [filters, setFilters] = useState({ listingType: '', type: '', q: '' });

  // Mise en cache par combinaison de filtres : revenir sur la page avec les
  // mêmes filtres affiche instantanément les derniers résultats connus,
  // pendant que la liste se rafraîchit discrètement en arrière-plan.
  const cacheKey = `properties_${JSON.stringify(filters)}`;
  const { data: properties, loading } = useCachedData(
    cacheKey,
    () => {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
      return getProperties(params);
    },
    [cacheKey]
  );

  const list = properties || [];

  return (
    <div>
      <SEO
        title="Nos biens immobiliers à Dakar"
        description="Villas, appartements, maisons, chambres, terrains, bureaux et commerces à vendre, à louer, par nuitée ou à la journée avec BF IMMO SARL à Dakar."
        path="/biens"
      />

      <section className="relative bg-ink pt-32 pb-20 overflow-hidden">
        <motion.div
          aria-hidden
          className="absolute -top-20 -left-16 w-[380px] h-[380px] rounded-[50%_50%_65%_35%/40%_45%_55%_60%] bg-brand-red/10 blur-3xl"
          animate={{ rotate: [0, -18, 0] }}
          transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="container-bf relative z-10">
          <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-brand-goldSoft">Nos biens</span>
          <h1 className="font-sans font-extrabold text-white text-4xl sm:text-5xl mt-4 max-w-xl">Trouvez le bien qui vous correspond</h1>
        </div>
        <svg className="absolute bottom-0 left-0 w-full text-offwhite" style={{ transform: 'translateY(1px)' }} viewBox="0 0 1440 90" preserveAspectRatio="none">
          <path d="M0,45 C 300,90 600,0 900,35 C 1200,70 1320,20 1440,40 L1440,90 L0,90 Z" fill="currentColor" />
        </svg>
      </section>

      <section className="bg-offwhite pb-28">
        <div className="container-bf">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[24px] shadow-soft p-5 sm:p-6 -mt-10 relative z-10 flex flex-col sm:flex-row gap-4 mb-14"
          >
            <div className="flex items-center gap-2 text-ink/40 shrink-0">
              <SlidersHorizontal size={16} />
              <span className="text-[12px] font-mono uppercase tracking-wide">Filtrer</span>
            </div>

            <select value={filters.listingType} onChange={(e) => setFilters((f) => ({ ...f, listingType: e.target.value }))} className="flex-1 px-4 py-2.5 rounded-xl border border-line bg-offwhite text-sm focus:border-brand-gold outline-none">
              {LISTING.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            <select value={filters.type} onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))} className="flex-1 px-4 py-2.5 rounded-xl border border-line bg-offwhite text-sm focus:border-brand-gold outline-none">
              {TYPES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            <input
              type="text"
              placeholder="Rechercher un quartier…"
              value={filters.q}
              onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
              className="flex-1 px-4 py-2.5 rounded-xl border border-line bg-offwhite text-sm focus:border-brand-gold outline-none placeholder:text-ink/35"
            />
          </motion.div>

          {loading && list.length === 0 ? (
            <PropertiesGridSkeleton />
          ) : list.length === 0 ? (
            <div className="py-20 flex flex-col items-center text-center text-ink/50">
              <SearchX size={30} className="mb-3" />
              <p className="font-medium">Aucun bien ne correspond à ces critères.</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={cacheKey} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {list.map((p, i) => <PropertyCard key={p._id} property={p} index={i} />)}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>
    </div>
  );
}
