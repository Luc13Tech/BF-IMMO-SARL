import React from 'react';
import { motion } from 'framer-motion';

const MAPS_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3857.8092953507703!2d-17.2561952263649!3d14.779769185728084!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xec1a19cc600d5bd%3A0x56c7b87063cc2192!2sCOPAK%20Cours%20Priv%C3%A9s%20Amadu%20et%20Kumba!5e0!3m2!1sfr!2ssn!4v1788348353302!5m2!1sfr!2ssn';

/**
 * Carte de localisation BF IMMO, intégrée avec le même langage visuel
 * que le reste du site (coin biseauté, entrée animée).
 */
export default function MapEmbed({ className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`relative rounded-[26px] overflow-hidden shadow-soft ${className}`}
      style={{ clipPath: 'polygon(0 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 0 100%)' }}
    >
      <span className="absolute top-0 right-0 w-[30px] h-[30px] bg-brand-gold z-10" />
      <iframe
        title="Localisation de BF IMMO SARL"
        src={MAPS_SRC}
        width="100%"
        height="360"
        style={{ border: 0, display: 'block' }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </motion.div>
  );
}
