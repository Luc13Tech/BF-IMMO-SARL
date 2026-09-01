import React from 'react';
import { motion } from 'framer-motion';
import {
  Home as HomeIcon,
  Key,
  ShieldCheck,
  Tag,
  MessageSquareText,
  HardHat,
  ClipboardCheck,
  ArrowUpRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ICONS = {
  achat: HomeIcon,
  location: Key,
  gerance: ShieldCheck,
  vente: Tag,
  conseils: MessageSquareText,
  btp: HardHat,
  'suivi-chantier': ClipboardCheck,
};

const cardVariants = {
  hidden: { opacity: 0, y: 36, scale: 0.96 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

function ServiceCard({ service, index }) {
  const Icon = ICONS[service.slug] || HomeIcon;
  // léger décalage vertical alterné : casse la grille trop parfaite
  const offset = index % 3 === 1 ? 'lg:-translate-y-4' : index % 3 === 2 ? 'lg:translate-y-3' : '';

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className={offset}
    >
      <Link
        to={`/services/${service.slug}`}
        className="group relative block bg-white p-8 h-full overflow-hidden"
        style={{
          borderRadius: '28px',
          clipPath:
            'polygon(0 0, calc(100% - 26px) 0, 100% 26px, 100% 100%, 0 100%)',
        }}
      >
        {/* notch coin — écho du logo (toit) */}
        <span className="absolute top-0 right-0 w-[26px] h-[26px] bg-offwhite" />
        <motion.span
          className="absolute top-0 right-0 w-[26px] h-[26px] bg-brand-gold origin-top-right"
          initial={{ scale: 0 }}
          whileInView={{ scale: 0 }}
          whileHover={{ scale: 1 }}
          transition={{ duration: 0.35 }}
        />

        {/* numéral géant en filigrane */}
        <span className="absolute -bottom-6 -right-2 font-sans font-extrabold text-[6.5rem] leading-none text-ink/[0.035] select-none">
          {String(index + 1).padStart(2, '0')}
        </span>

        <motion.div
          whileHover={{ rotate: -8, scale: 1.08 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className="relative w-14 h-14 rounded-full bg-gradient-to-br from-ink to-ink-soft flex items-center justify-center mb-6 shadow-[0_10px_24px_-10px_rgba(30,32,39,0.5)]"
        >
          <Icon size={22} className="text-brand-goldSoft" strokeWidth={1.8} />
        </motion.div>

        <h3 className="font-sans font-bold text-lg text-ink relative z-10">{service.name}</h3>
        <p className="font-light text-[13.5px] text-ink/60 mt-2.5 leading-relaxed relative z-10 pr-4">
          {service.shortDescription}
        </p>

        <span className="inline-flex items-center gap-1.5 mt-5 text-[12.5px] font-semibold text-brand-red relative z-10">
          En savoir plus
          <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </span>
      </Link>
    </motion.div>
  );
}

export default function ServicesGrid({ services = [] }) {
  const main = services.slice(0, 6);
  const last = services[6];

  return (
    <section id="services" className="relative bg-offwhite pt-4 pb-28">
      <div className="container-bf">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-xl mb-14"
        >
          <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-brand-gold">
            Nos 7 métiers
          </span>
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-ink mt-3">
            Un accompagnement complet,{' '}
            <span className="text-brand-red">à chaque étape</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {main.map((service, i) => (
            <ServiceCard key={service.slug} service={service} index={i} />
          ))}
        </div>

        {last && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-7"
          >
            <Link
              to={`/services/${last.slug}`}
              className="group relative flex flex-col sm:flex-row items-center justify-between gap-6 bg-ink text-white p-10 sm:p-12 overflow-hidden rounded-[28px]"
            >
              <svg
                className="absolute -left-10 -bottom-10 w-52 opacity-[0.06] pointer-events-none"
                viewBox="0 0 200 110"
                fill="none"
              >
                <path d="M20 95 L100 25 L180 95 Z" fill="white" />
              </svg>
              <div className="relative z-10">
                <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-brand-goldSoft">
                  07 — Le dernier maillon
                </span>
                <h3 className="font-sans font-extrabold text-2xl sm:text-3xl mt-2">
                  {last.name}
                </h3>
                <p className="font-light text-white/60 text-[14px] mt-2 max-w-md">
                  {last.shortDescription}
                </p>
              </div>
              <span className="relative z-10 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-brand-red font-semibold text-[15px] whitespace-nowrap group-hover:bg-brand-redDark transition-colors">
                Demander un suivi <ArrowUpRight size={16} />
              </span>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
