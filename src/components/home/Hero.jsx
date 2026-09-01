import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import Button from '../ui/Button';

const roofDraw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i = 1) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { delay: i * 0.3, duration: 1.4, ease: [0.65, 0, 0.35, 1] }, opacity: { delay: i * 0.3, duration: 0.3 } },
  }),
};

export default function Hero({ title, subtitle }) {
  return (
    <section className="relative bg-ink overflow-hidden pt-36 pb-40 md:pt-44 md:pb-56">
      {/* blob organique animé, jamais un simple dégradé plaqué */}
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
        {/* Colonne texte */}
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
              {title?.split(',')[0] || 'Votre bien'},
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative inline-block text-brand-red mt-1"
            >
              {title?.split(',')[1]?.trim() || 'notre engagement'}
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
                  transition={{ delay: 1, duration: 0.9, ease: 'easeInOut' }}
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
            <Button as="a" href="/biens" variant="ghost" className="!text-white !border !border-white/25 !bg-white/5 backdrop-blur-sm">
              Voir les biens
            </Button>
          </motion.div>
        </div>

        {/* Colonne visuelle : motif Double Toit qui se dessine + fiche flottante */}
        <div className="relative h-[360px] sm:h-[420px]">
          <motion.svg
            viewBox="0 0 300 170"
            className="absolute inset-0 w-full h-full"
            fill="none"
          >
            <motion.path
              d="M20 150 L150 40 L280 150"
              stroke="#D8BD7E"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              custom={0}
              variants={roofDraw}
              initial="hidden"
              animate="visible"
            />
            <motion.path
              d="M60 150 L150 70 L240 150"
              stroke="#E2231A"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              custom={1}
              variants={roofDraw}
              initial="hidden"
              animate="visible"
            />
          </motion.svg>

          <motion.div
            initial={{ opacity: 0, y: 40, rotate: -3 }}
            animate={{ opacity: 1, y: 0, rotate: -2 }}
            transition={{ delay: 1.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-2 bottom-4 sm:bottom-10 w-64 sm:w-72"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="bg-white/95 backdrop-blur rounded-[1.75rem] rounded-tr-md shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] overflow-hidden"
            >
              <div className="h-32 bg-gradient-to-br from-ink-soft to-ink relative">
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white text-[10px] font-mono uppercase tracking-wide text-emerald-700">
                  Disponible
                </span>
              </div>
              <div className="p-5">
                <p className="font-sans font-bold text-ink text-[15px]">Villa 4 pièces</p>
                <p className="font-mono text-[10.5px] text-ink/50 mt-1">Sicap Keur Massar, Dakar</p>
                <p className="font-sans font-bold text-brand-gold mt-2.5">85 000 000 FCFA</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* transition organique vers la section suivante — jamais une ligne droite */}
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
