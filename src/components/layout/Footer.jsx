import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../../assets/images/logo.png';

export default function Footer({ content = {} }) {
  const phone = content['contact.phone'] || '+221 33 813 42 65';
  const whatsapp = content['contact.whatsapp'] || '+221 77 829 41 42';
  const email = content['contact.email'] || 'bfimmo@gmail.com';
  const address =
    content['contact.address'] || 'Cité Belle Ville, Villa N°102KMV, Sicap Keur Massar, Dakar';
  const rc = content['legal.rc'] || 'SN-DKR-2024-B-27236';
  const ninea = content['legal.ninea'] || '011357317 2D2';

  return (
    <footer className="relative bg-ink text-white pt-24 pb-10 overflow-hidden">
      {/* bord supérieur incurvé — pas de ligne droite entre les sections */}
      <svg
        className="absolute top-0 left-0 w-full text-offwhite"
        style={{ transform: 'translateY(-99%)' }}
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
      >
        <path
          d="M0,60 C 240,110 480,0 720,20 C 960,40 1200,100 1440,50 L1440,100 L0,100 Z"
          fill="currentColor"
        />
      </svg>

      {/* motif "Double Toit" en filigrane */}
      <svg
        className="absolute -right-10 top-10 w-64 opacity-[0.05] pointer-events-none"
        viewBox="0 0 200 110"
        fill="none"
      >
        <path d="M20 95 L100 25 L180 95 Z" fill="white" />
      </svg>

      <div className="container-bf grid gap-12 md:grid-cols-4 relative z-10">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-3 mb-5">
            <img src={logo} alt="BF IMMO SARL" className="h-11 w-11 rounded-xl object-cover" />
            <span
              className="text-2xl text-white"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              BF <em className="not-italic text-brand-red">Immo</em>
            </span>
          </Link>
          <p className="text-white/60 text-sm leading-relaxed max-w-sm font-light">
            Achat, location, gérance, vente, conseils, construction BTP et suivi de
            chantier — un seul interlocuteur, du plan au bien livré, à Dakar.
          </p>
        </div>

        <div>
          <h4 className="font-mono text-[11px] tracking-[0.2em] uppercase text-brand-goldSoft mb-4">
            Contact
          </h4>
          <ul className="space-y-2.5 text-sm text-white/75 font-light">
            <li>{address}</li>
            <li>
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-white transition-colors">
                {phone}
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${whatsapp.replace(/[^\d]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                WhatsApp {whatsapp}
              </a>
            </li>
            <li>
              <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                {email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-[11px] tracking-[0.2em] uppercase text-brand-goldSoft mb-4">
            Nos métiers
          </h4>
          <ul className="space-y-2.5 text-sm text-white/75 font-light">
            {['Achat', 'Location', 'Gérance', 'Vente', 'Conseils', 'Construction BTP', 'Suivi de chantier'].map(
              (s) => (
                <li key={s}>
                  <Link to="/" className="hover:text-white transition-colors">
                    {s}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
      </div>

      <div className="container-bf mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-3 relative z-10">
        <p className="font-mono text-[10.5px] text-white/40">
          RC. {rc} · NINEA {ninea}
        </p>
        <p className="font-mono text-[10.5px] text-white/40">
          © {new Date().getFullYear()} BF IMMO SARL — Tous droits réservés
        </p>
      </div>
    </footer>
  );
}
