import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { getService } from '../api/client';
import ServiceForm from '../components/services/ServiceForm';

export default function ServicePage() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | not-found

  useEffect(() => {
    setStatus('loading');
    getService(slug)
      .then((data) => {
        setService(data);
        setStatus('ready');
      })
      .catch(() => setStatus('not-found'));
    window.scrollTo({ top: 0 });
  }, [slug]);

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
        <h1 className="font-sans font-extrabold text-2xl text-ink">Service introuvable</h1>
        <p className="text-ink/60 font-light mt-2">Ce métier n'existe pas ou n'est plus actif.</p>
        <Link to="/" className="mt-6 text-brand-red font-semibold hover:underline">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* En-tête service — même langage visuel organique que le hero */}
      <section className="relative bg-ink pt-32 pb-28 overflow-hidden">
        <motion.div
          aria-hidden
          className="absolute -top-24 -right-16 w-[420px] h-[420px] rounded-[45%_55%_65%_35%/40%_45%_55%_60%] bg-gradient-to-br from-brand-gold/20 via-brand-red/10 to-transparent blur-3xl"
          animate={{ rotate: [0, 20, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="container-bf relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm font-medium mb-8 transition-colors"
          >
            <ChevronLeft size={16} /> Retour aux métiers
          </Link>

          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-[11px] tracking-[0.25em] uppercase text-brand-goldSoft"
          >
            BF Immo SARL · {service.name}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-sans font-extrabold text-white text-4xl sm:text-5xl mt-4 max-w-xl"
          >
            {service.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/65 font-light text-[15.5px] mt-5 max-w-lg leading-relaxed"
          >
            {service.shortDescription}
          </motion.p>
        </div>

        <svg
          className="absolute bottom-0 left-0 w-full text-offwhite"
          style={{ transform: 'translateY(1px)' }}
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0,50 C 240,10 480,90 720,50 C 960,10 1200,80 1440,40 L1440,100 L0,100 Z"
            fill="currentColor"
          />
        </svg>
      </section>

      {/* Formulaire */}
      <section className="bg-offwhite py-4 pb-24">
        <div className="container-bf max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <ServiceForm service={service} />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
