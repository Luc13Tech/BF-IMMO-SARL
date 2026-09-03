import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary:
    'bg-brand-red text-white shadow-[0_14px_30px_-12px_rgba(226,35,26,0.55)] hover:shadow-[0_18px_38px_-10px_rgba(226,35,26,0.65)]',
  gold: 'bg-brand-gold text-white shadow-[0_14px_30px_-12px_rgba(184,146,58,0.5)]',
  outline: 'bg-transparent text-ink border-2 border-ink',
  ghost: 'bg-white text-ink border border-line',
};

/**
 * Bouton signature BF IMMO : léger magnétisme au survol, compression au tap,
 * et un balayage de lumière discret plutôt qu'un simple changement de fond.
 */
export default function Button({
  children,
  variant = 'primary',
  as = 'button',
  className = '',
  ...props
}) {
  const Comp = motion[as] || motion.button;

  return (
    <Comp
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ scale: 0.96, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`relative overflow-hidden inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-[15px] tracking-tight isolate group ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
    </Comp>
  );
}
