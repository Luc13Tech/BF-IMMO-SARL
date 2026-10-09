import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BedDouble, Bath, Ruler, MapPin, Heart, Link2, Check } from 'lucide-react';
import { useUserAuth } from '../../context/UserAuthContext';
import { SITE_URL } from '../ui/SEO';

const STATUS_STYLES = {
  disponible: 'bg-emerald-50 text-emerald-700',
  nouveau: 'bg-amber-50 text-amber-700',
  sous_offre: 'bg-red-50 text-brand-redDark',
  loue: 'bg-ink/10 text-ink/60',
  vendu: 'bg-ink/10 text-ink/60',
};

const STATUS_LABELS = {
  disponible: 'Disponible', nouveau: 'Nouveau', sous_offre: 'Sous offre', loue: 'Loué', vendu: 'Vendu',
};

// Les 4 modes de location demandés : chacun son libellé et son suffixe de prix.
const LISTING_LABELS = {
  vente: 'À vendre',
  location: 'À louer',
  location_nuitee: 'Par nuitée',
  location_journaliere: 'À la journée',
};

const PRICE_SUFFIX = {
  vente: '',
  location: '/mois',
  location_nuitee: '/nuit',
  location_journaliere: '/jour',
};

export default function PropertyCard({ property, index = 0 }) {
  const cover = property.images?.[0]?.url;
  const offset = index % 3 === 1 ? 'lg:-translate-y-3' : '';
  const { isAuthenticated, isFavorite, toggleFavorite } = useUserAuth();
  const favorited = isFavorite(property._id);
  const [copied, setCopied] = useState(false);

  // Lien lisible et partageable (slug) ; repli sur l'ID si jamais absent.
  const propertyPath = `/biens/${property.slug || property._id}`;

  async function handleFavoriteClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      window.location.href = '/connexion';
      return;
    }
    try {
      await toggleFavorite(property);
    } catch {
      // l'échec silencieux suffit : loadFavorites() a déjà resynchronisé l'état
    }
  }

  async function handleCopyLink(e) {
    e.preventDefault();
    e.stopPropagation();
    const fullUrl = `${SITE_URL}${propertyPath}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // navigateur sans accès au presse-papiers (rare) : pas d'action bloquante
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: (index % 6) * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={offset}
    >
      <Link
        to={propertyPath}
        className="group block bg-white overflow-hidden rounded-[26px] rounded-tr-lg shadow-[0_18px_40px_-24px_rgba(30,32,39,0.35)] hover:shadow-[0_24px_50px_-20px_rgba(30,32,39,0.45)] transition-shadow duration-300"
      >
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-ink-soft to-ink">
          {cover && (
            <motion.img src={cover} alt={property.title} className="w-full h-full object-cover" whileHover={{ scale: 1.08 }} transition={{ duration: 0.6, ease: 'easeOut' }} />
          )}
          <span className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10.5px] font-mono uppercase tracking-wide ${STATUS_STYLES[property.status] || STATUS_STYLES.disponible}`}>
            {STATUS_LABELS[property.status] || 'Disponible'}
          </span>

          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full bg-ink/70 backdrop-blur text-white text-[10.5px] font-mono uppercase tracking-wide">
              {LISTING_LABELS[property.listingType] || property.listingType}
            </span>
            <motion.button
              onClick={handleFavoriteClick}
              whileTap={{ scale: 0.8 }}
              aria-label={favorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              className="w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shrink-0"
            >
              <Heart size={14} className={favorited ? 'fill-brand-red text-brand-red' : 'text-ink/50'} />
            </motion.button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-sans font-bold text-[17px] text-ink group-hover:text-brand-red transition-colors">{property.title}</h3>
            <motion.button
              onClick={handleCopyLink}
              whileTap={{ scale: 0.85 }}
              aria-label="Copier le lien de ce bien"
              title="Copier le lien"
              className="shrink-0 w-7 h-7 rounded-full border border-line flex items-center justify-center text-ink/40 hover:text-brand-gold hover:border-brand-gold transition-colors"
            >
              {copied ? <Check size={13} className="text-emerald-600" /> : <Link2 size={13} />}
            </motion.button>
          </div>
          <p className="flex items-center gap-1.5 font-mono text-[11px] text-ink/50 mt-2">
            <MapPin size={12} /> {property.location}
          </p>

          <p className="font-sans font-extrabold text-brand-gold text-lg mt-4">
            {Number(property.price).toLocaleString('fr-FR')} {property.priceUnit || 'FCFA'}
            <span className="text-xs font-normal text-ink/40"> {PRICE_SUFFIX[property.listingType]}</span>
          </p>

          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-line text-ink/55 text-[12.5px]">
            {property.bedrooms > 0 && <span className="flex items-center gap-1.5"><BedDouble size={15} /> {property.bedrooms}</span>}
            {property.bathrooms > 0 && <span className="flex items-center gap-1.5"><Bath size={15} /> {property.bathrooms}</span>}
            {property.surface > 0 && <span className="flex items-center gap-1.5"><Ruler size={15} /> {property.surface} m²</span>}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
