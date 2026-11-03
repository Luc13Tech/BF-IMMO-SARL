
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import Button from '../ui/Button';
import AdsCarousel from './AdsCarousel';

export default function Hero({
  title,
  subtitle,
  featuredProperties = [],
}) {
  const firstLine =
    title?.split(',')[0] || 'L’immobilier en toute confiance';

  return (
    <section className="relative overflow-hidden bg-ink pb-16 pt-32 sm:pb-20 sm:pt-40">

      {/* Décorations lumineuses */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-32 h-[520px] w-[520px] rounded-[45%_55%_65%_35%/40%_45%_55%_60%] bg-gradient-to-br from-brand-gold/20 via-brand-red/10 to-transparent blur-3xl"
        animate={{
          rotate: [0, 18, 0],
          scale: [1, 1.06, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-brand-red/10 blur-3xl"
        animate={{ rotate: [0, -16, 0] }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="container-bf relative z-10">

        {/* Présentation de BF IMMO */}
        <div className="max-w-4xl">

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-7 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-brand-goldSoft sm:text-[11px]"
          >
            <MapPin size={13} />
            BF Immo SARL · Dakar, Sénégal
          </motion.div>

          <h1 className="font-sans text-[2.55rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">

            <motion.span
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75 }}
              className="block"
            >
              {firstLine}
            </motion.span>

            <motion.span
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.18 }}
              className="relative mt-1 inline-block"
            >
              <span className="text-white">BF </span>
              <span className="text-brand-red">IMMO</span>{' '}
              <span className="text-brand-gold">- Sénégal</span>

              <svg
                className="absolute -bottom-2 left-0 h-3 w-full"
                viewBox="0 0 300 12"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <motion.path
                  d="M2 8 Q 80 -2 150 6 T 298 4"
                  stroke="#B8923A"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    delay: 0.8,
                    duration: 0.9,
                  }}
                />
              </svg>
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-7 max-w-2xl text-sm font-light leading-relaxed text-white/65 sm:text-lg"
          >
            {subtitle ||
              'Votre partenaire immobilier au Sénégal : achat, location, gérance, vente, conseils et BTP.'}
          </motion.p>

          {/* Boutons de navigation */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-9 flex flex-wrap gap-4"
          >
            <Button
              as="a"
              href="#services"
              variant="primary"
            >
              Explorer nos services
              <ArrowRight size={16} />
            </Button>

            <Button
              as="a"
              href="/biens"
              variant="ghost"
              className="!border !border-white/25 !bg-white/5 !text-white backdrop-blur-sm"
            >
              Voir les biens
            </Button>
          </motion.div>

        </div>
      </div>

      {/* Carrousel horizontal des biens en vedette */}
      <div className="relative z-10 mt-10 w-full sm:mt-14">
        <AdsCarousel
          properties={featuredProperties}
          autoPlayInterval={2000}
        />
      </div>

    </section>
  );
}
