import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot } from 'lucide-react';

function WhatsAppIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
    </svg>
  );
}

export default function FloatingButtons({ whatsapp = '221778294142', onOpenAssistant }) {
  const [hover, setHover] = useState(null);

  return (
    <>
      {/* Assistant Virtuel — bas gauche */}
      <div className="fixed left-5 bottom-6 z-30 flex items-end gap-3">
        <motion.button
          aria-label="Ouvrir l'Assistant Virtuel BF IMMO"
          onClick={onOpenAssistant}
          onHoverStart={() => setHover('ai')}
          onHoverEnd={() => setHover(null)}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, type: 'spring', stiffness: 260, damping: 18 }}
          whileHover={{ scale: 1.08, rotate: -4 }}
          whileTap={{ scale: 0.92 }}
          className="relative w-14 h-14 rounded-full bg-ink border-2 border-brand-red flex items-center justify-center shadow-[0_14px_30px_-10px_rgba(0,0,0,0.5)]"
        >
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-brand-red"
            animate={{ scale: [1, 1.5, 1.5], opacity: [0.6, 0, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
          />
          <Bot size={24} className="text-brand-red" />
        </motion.button>
        <AnimatePresence>
          {hover === 'ai' && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="mb-2 px-3 py-1.5 rounded-full bg-ink text-white text-xs font-medium whitespace-nowrap shadow-lg"
            >
              Assistant Virtuel
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* WhatsApp — bas droite */}
      <div className="fixed right-5 bottom-6 z-30 flex items-end gap-3 flex-row-reverse">
        <motion.a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Contacter BF IMMO sur WhatsApp"
          onHoverStart={() => setHover('wa')}
          onHoverEnd={() => setHover(null)}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.9, type: 'spring', stiffness: 260, damping: 18 }}
          whileHover={{ scale: 1.08, rotate: 4 }}
          whileTap={{ scale: 0.92 }}
          className="relative w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_14px_30px_-10px_rgba(37,211,102,0.6)]"
        >
          <motion.span
            className="absolute inset-0 rounded-full bg-[#25D366]"
            animate={{ scale: [1, 1.6, 1.6], opacity: [0.5, 0, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
          />
          <WhatsAppIcon className="w-6 h-6 text-white relative z-10" />
        </motion.a>
        <AnimatePresence>
          {hover === 'wa' && (
            <motion.span
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              className="mb-2 px-3 py-1.5 rounded-full bg-ink text-white text-xs font-medium whitespace-nowrap shadow-lg"
            >
              WhatsApp
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
