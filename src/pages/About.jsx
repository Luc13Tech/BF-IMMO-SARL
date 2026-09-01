import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, HeartHandshake } from 'lucide-react';
import { getContent } from '../api/client';

const VALUES = [
  { icon: Target, title: 'Rigueur', text: "Chaque dossier est suivi avec précision, du premier contact à la signature." },
  { icon: Eye, title: 'Transparence', text: "Des informations claires, sans surprise, à chaque étape du processus." },
  { icon: HeartHandshake, title: 'Engagement', text: "Un accompagnement humain, pensé pour durer au-delà d'une transaction." },
];

export default function About() {
  const [content, setContent] = useState({});

  useEffect(() => {
    getContent().then(setContent).catch(() => {});
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div>
      <section className="relative bg-ink pt-32 pb-28 overflow-hidden">
        <motion.div
          aria-hidden
          className="absolute top-0 right-0 w-[400px] h-[400px] rounded-[50%_50%_40%_60%/45%_55%_45%_55%] bg-brand-gold/15 blur-3xl"
          animate={{ rotate: [0, 22, 0] }}
          transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="container-bf relative z-10 max-w-2xl">
          <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-brand-goldSoft">
            À propos
          </span>
          <h1 className="font-sans font-extrabold text-white text-4xl sm:text-5xl mt-4">
            L'immobilier,{' '}
            <span
              className="text-brand-red"
              style={{ fontFamily: '"Times New Roman", Times, serif', fontStyle: 'italic' }}
            >
              pensé de bout en bout
            </span>
          </h1>
          <p className="text-white/65 font-light text-[15.5px] mt-6 leading-relaxed">
            {content['about.text'] ||
              "BF IMMO SARL accompagne particuliers, investisseurs et entreprises à Dakar sur l'ensemble du cycle immobilier : achat, location, gérance, vente, conseils, construction BTP et suivi de chantier."}
          </p>
        </div>
        <svg
          className="absolute bottom-0 left-0 w-full text-offwhite"
          style={{ transform: 'translateY(1px)' }}
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
        >
          <path d="M0,40 C 300,90 600,10 900,45 C 1200,80 1320,20 1440,50 L1440,90 L0,90 Z" fill="currentColor" />
        </svg>
      </section>

      <section className="bg-offwhite py-4 pb-28">
        <div className="container-bf grid sm:grid-cols-3 gap-7">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className={`bg-white rounded-[26px] p-8 ${i === 1 ? 'sm:-translate-y-4' : ''} shadow-soft`}
            >
              <div className="w-12 h-12 rounded-full bg-ink flex items-center justify-center mb-5">
                <v.icon size={20} className="text-brand-goldSoft" />
              </div>
              <h3 className="font-sans font-bold text-lg text-ink">{v.title}</h3>
              <p className="text-ink/60 font-light text-[14px] mt-2 leading-relaxed">{v.text}</p>
            </motion.div>
          ))}
        </div>

        <div className="container-bf mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-ink rounded-[28px] p-10 sm:p-12 text-center relative overflow-hidden"
          >
            <svg className="absolute -left-10 -top-10 w-48 opacity-[0.06]" viewBox="0 0 200 110" fill="none">
              <path d="M20 95 L100 25 L180 95 Z" fill="white" />
            </svg>
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-brand-goldSoft mb-3">
              RC. {content['legal.rc'] || 'SN-DKR-2024-B-27236'} · NINEA {content['legal.ninea'] || '011357317 2D2'}
            </p>
            <p className="text-white font-light text-sm">
              {content['contact.address'] || 'Cité Belle Ville, Villa N°102KMV, Sicap Keur Massar, Dakar'}
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
