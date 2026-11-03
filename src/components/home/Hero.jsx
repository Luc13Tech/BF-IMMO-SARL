
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import Button from '../ui/Button';
import AdsCarousel from './AdsCarousel';

const roofDraw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i = 1) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        delay: i * 0.3,
        duration: 1.4,
        ease: [0.65, 0, 0.35, 1],
      },
      opacity: { delay: i * 0.3, duration: 0.3 },
    },
  }),
};

export default function Hero({
  title,
  subtitle,
  featuredProperties = [],
}) {
  const firstLine = title?.split(',')[0] || 'Votre bien';

  return (
    <section className="relative overflow-hidden bg-ink pt-36 pb-40 md:pt-44 md:pb-56">

      {/* Décoration lumineuse originale */}
      <motion.div
        aria-hidden
        className="absolute -top-32 -right-20 h-[560px] w-[560px] rounded-[45%_55%_65%_35%/40%_45%_55%_60%] bg-gradient-to-br from-brand-gold/25 via-brand-red/10 to-transparent blur-3xl"
        animate={{ rotate: [0, 25, 0], scale: [1, 1.08, 1] }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        aria-hidden
        className="absolute bottom-0 -left-24 h-[420px] w-[420px] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-brand-red/10 blur-3xl"
        animate={{ rotate: [0, -20, 0] }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="container-bf relative z-10 grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-8">

        {/* CONTENU ORIGINAL DU SITE */}
        <div className="min-w-0">

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-7 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-brand-goldSoft"
          >
            <MapPin size={13} />
            BF Immo SARL · Dakar, Sénégal
          </motion.div>

          <h1 className="font-sans text-[2.6rem] font-extrabold leading-[1.08] text-white sm:text-6xl lg:text-[3.6rem]">

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
              className="relative mt-1 inline-block"
            >
              <span className="text-white">BF</span>{' '}
              <span className="text-brand-red">IMMO</span>{' '}
              <span className="text-brand-gold">- Sénégal</span>

              <svg
                className="absolute -bottom-2 left-0 h-3 w-full"
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
            className="mt-7 max-w-md text-[15.5px] font-light leading-relaxed text-white/65"
          >
            {subtitle ||
              "Achat, location, gérance, vente, conseils, construction BTP et suivi de chantier — un seul interlocuteur, du plan au bien livré."}
          </motion.p>

          {/* Boutons originaux : conservés */}
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
              className="!border !border-white/25 !bg-white/5 !text-white backdrop-blur-sm"
            >
              Voir les biens
            </Button>
          </motion.div>
        </div>

        {/* NOUVELLE ZONE PUBLICITAIRE */}
        <div className="relative min-w-0">
          <AdsCarousel
            properties={featuredProperties}
            autoPlayInterval={2000}
          />
        </div>

      </div>

      {/* Forme ondulée originale : conservée */}
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
