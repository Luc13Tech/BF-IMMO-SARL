import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, BedDouble, Bath, Ruler, MapPin, Loader2, Send, CheckCircle2 } from 'lucide-react';
import { getProperty, submitLead } from '../api/client';
import PropertyGallery from '../components/properties/PropertyGallery';

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [status, setStatus] = useState('loading');
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', message: '' });
  const [sendStatus, setSendStatus] = useState('idle');

  useEffect(() => {
    getProperty(id)
      .then((data) => {
        setProperty(data);
        setStatus('ready');
      })
      .catch(() => setStatus('not-found'));
    window.scrollTo({ top: 0 });
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSendStatus('sending');
    const service = property.listingType === 'location' ? 'location' : 'achat';
    try {
      await submitLead(service, {
        ...form,
        propertyId: property._id,
        propertyTitle: property.title,
      });
      setSendStatus('success');
    } catch {
      setSendStatus('error');
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-gold" size={28} />
      </div>
    );
  }

  if (status === 'not-found') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-sans font-extrabold text-2xl text-ink">Bien introuvable</h1>
        <Link to="/biens" className="mt-6 text-brand-red font-semibold hover:underline">
          Retour aux biens
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 bg-offwhite">
      <div className="container-bf">
        <Link
          to="/biens"
          className="inline-flex items-center gap-1.5 text-ink/50 hover:text-ink text-sm font-medium mb-6 transition-colors"
        >
          <ChevronLeft size={16} /> Retour aux biens
        </Link>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10">
          {/* Galerie */}
          <div>
            <PropertyGallery images={property.images} title={property.title} />

            <div className="flex items-start justify-between gap-4 mt-8">
              <div>
                <h1 className="font-sans font-extrabold text-3xl text-ink">{property.title}</h1>
                <p className="flex items-center gap-1.5 text-ink/50 font-mono text-[12px] mt-2">
                  <MapPin size={13} /> {property.location}
                </p>
              </div>
              <p className="font-sans font-extrabold text-brand-gold text-xl sm:text-2xl whitespace-nowrap">
                {Number(property.price).toLocaleString('fr-FR')}
                <span className="block text-[11px] font-normal text-ink/40 text-right">
                  {property.priceUnit || 'FCFA'}
                  {property.listingType === 'location' && ' /mois'}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-line text-ink/60 text-sm">
              {property.bedrooms > 0 && (
                <span className="flex items-center gap-2">
                  <BedDouble size={17} /> {property.bedrooms} chambres
                </span>
              )}
              {property.bathrooms > 0 && (
                <span className="flex items-center gap-2">
                  <Bath size={17} /> {property.bathrooms} sdb
                </span>
              )}
              {property.surface > 0 && (
                <span className="flex items-center gap-2">
                  <Ruler size={17} /> {property.surface} m²
                </span>
              )}
            </div>

            {property.description && (
              <p className="mt-6 text-ink/70 font-light leading-relaxed">{property.description}</p>
            )}
          </div>

          {/* Formulaire d'intérêt */}
          <div>
            <div className="bg-white rounded-[26px] shadow-soft p-7 sticky top-28">
              {sendStatus === 'success' ? (
                <div className="text-center py-6">
                  <CheckCircle2 size={32} className="text-emerald-600 mx-auto mb-3" />
                  <p className="font-bold text-ink">Demande envoyée</p>
                  <p className="text-ink/55 text-sm mt-1 font-light">
                    BF IMMO vous recontacte rapidement au sujet de ce bien.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-sans font-bold text-lg text-ink">Intéressé par ce bien ?</h3>
                  <input
                    required
                    placeholder="Nom complet"
                    value={form.fullName}
                    onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-line focus:border-brand-gold outline-none text-sm"
                  />
                  <input
                    required
                    type="tel"
                    placeholder="Téléphone"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-line focus:border-brand-gold outline-none text-sm"
                  />
                  <input
                    type="email"
                    placeholder="Email (optionnel)"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-line focus:border-brand-gold outline-none text-sm"
                  />
                  <textarea
                    placeholder="Message (optionnel)"
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-line focus:border-brand-gold outline-none text-sm"
                  />
                  <motion.button
                    type="submit"
                    disabled={sendStatus === 'sending'}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full flex items-center justify-center gap-2 bg-brand-red text-white font-semibold py-3.5 rounded-full disabled:opacity-70"
                  >
                    {sendStatus === 'sending' ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Send size={15} />
                    )}
                    Contacter BF IMMO
                  </motion.button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
