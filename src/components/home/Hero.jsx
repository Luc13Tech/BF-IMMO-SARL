import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import Button from '../ui/Button';
import AdsCarousel from './AdsCarousel';

export default function Hero({ title, subtitle, featuredProperties = [] }) {
  const firstLine = title?.split(',')[0] || 'Votre bien';

  return (
    <section className="relative bg-ink overflow-hidden pt-36 pb-40 md:pt-44 md:pb-56">
      <motion.div
        aria-hidden
        className="absolute -top-32 -right-20 w-[560px] h-[560px] rounded-[45%_55%_65%_35%/40%_45%_55%_60%] bg-gradient-to-br from-brand-gold/25 via-brand-red/10 to-transparent blur-3xl"
        animate={{ rotate: [0, 25, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        aria-hidden
        className="absolute bottom-0 -left-24 w-[420px] h-[420px] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-brand-red/10 blur-3xl"
        animate={{ rotate: [0, -20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="container-bf relative z-10 grid lg:grid-cols-[1.05fr_0.95fr] gap-16 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] uppercase text-brand-goldSoft mb-7"
          >
            <MapPin size={13} />
            BF Immo SARL · Dakar, Sénégal
          </motion.div>

          <h1 className="font-sans font-extrabold text-white text-[2.6rem] leading-[1.08] sm:text-6xl lg:text-[3.6rem]">
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="block"
            >
              {firstLine},
            </motion.span>

            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative inline-block mt-1"
            >
              <span className="text-white">BF</span>{' '}
              <span className="text-brand-red">IMMO</span>{' '}
              <span className="text-brand-gold">- Sénégal</span>

              <svg
                className="absolute left-0 -bottom-2 w-full h-3"
                viewBox="0 0 300 12"
                preserveAspectRatio="none"
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
                    delay: 1,
                    duration: 0.9,
                    ease: 'easeInOut',
                  }}
                />
              </svg>
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-7 text-white/65 font-light text-[15.5px] leading-relaxed max-w-md"
          >
            {subtitle ||
              "Achat, location, gérance, vente, conseils, construction BTP et suivi de chantier — un seul interlocuteur, du plan au bien livré."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Button as="a" href="#services" variant="primary">
              Explorer nos services <ArrowRight size={16} />
            </Button>

            <Button
              as="a"
              href="/biens"
              variant="ghost"
              className="!text-white !border !border-white/25 !bg-white/5 backdrop-blur-sm"
            >
              Voir les biens
            </Button>
          </motion.div>
        </div>

        <div className="relative min-w-0 py-4 lg:py-8">
          <motion.div
            aria-hidden
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mb-5 flex items-center justify-between gap-4"
          >
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-brand-goldSoft">
                Sélection BF IMMO
              </p>
              <h2 className="mt-1 text-xl sm:text-2xl font-bold text-white">
                Nos biens à découvrir
              </h2>
            </div>
            <span className="hidden sm:inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-white/65">
              À la une
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="relative"
          >
            <AdsCarousel properties={featuredProperties} autoPlayInterval={2000} />
          </motion.div>
        </div>
      </div>

      <svg
        className="absolute bottom-0 left-0 w-full text-offwhite"
        style={{ transform: 'translateY(1px)' }}
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,40 C 200,100 400,0 720,30 C 1040,60 1240,10 1440,50 L1440,120 L0,120 Z"
          fill="currentColor"
        />
      </svg>
    </section>
  );
}
