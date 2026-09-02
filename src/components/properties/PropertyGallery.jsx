import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';

const swipeConfidenceThreshold = 8000;
const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

/**
 * Galerie photo réutilisable pour un bien : grande image avec transition
 * animée, navigation au clavier/glissement, miniatures cliquables, et
 * une vue plein écran (lightbox) au tap sur l'icône d'agrandissement.
 */
export default function PropertyGallery({ images = [], title = '' }) {
  const items = images.length ? images : [{ url: null }];
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const go = useCallback(
    (newDirection) => {
      setDirection(newDirection);
      setIndex((i) => (i + newDirection + items.length) % items.length);
    },
    [items.length]
  );

  const goTo = (i) => {
    setDirection(i > index ? 1 : -1);
    setIndex(i);
  };

  useEffect(() => {
    if (!lightbox) return;
    function onKey(e) {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'Escape') setLightbox(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, go]);

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <div>
      {/* Image principale */}
      <div className="relative h-80 sm:h-[420px] rounded-[28px] rounded-tr-lg overflow-hidden bg-gradient-to-br from-ink-soft to-ink">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            drag={items.length > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) go(1);
              else if (swipe > swipeConfidenceThreshold) go(-1);
            }}
            className="absolute inset-0"
          >
            {items[index]?.url ? (
              <img
                src={items[index].url}
                alt={`${title} — photo ${index + 1}`}
                className="w-full h-full object-cover pointer-events-none"
                draggable={false}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/20 text-sm font-mono">
                Aucune photo
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {items[index]?.url && (
          <button
            onClick={() => setLightbox(true)}
            aria-label="Agrandir la photo"
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-ink hover:bg-white transition-colors"
          >
            <Expand size={15} />
          </button>
        )}

        {items.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Photo précédente"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-ink hover:bg-white transition-colors"
            >
              <ChevronLeft size={17} />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Photo suivante"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-ink hover:bg-white transition-colors"
            >
              <ChevronRight size={17} />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Aller à la photo ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Miniatures */}
      {items.length > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
          {items.map((img, i) => (
            <motion.button
              key={i}
              onClick={() => goTo(i)}
              whileHover={{ y: -2 }}
              className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                index === i ? 'border-brand-gold' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              {img.url && <img src={img.url} alt="" className="w-full h-full object-cover" />}
            </motion.button>
          ))}
        </div>
      )}

      {/* Lightbox plein écran */}
      <AnimatePresence>
        {lightbox && items[index]?.url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-ink/95 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setLightbox(false)}
          >
            <button
              onClick={() => setLightbox(false)}
              aria-label="Fermer"
              className="absolute top-6 right-6 text-white/70 hover:text-white"
            >
              <X size={26} />
            </button>

            {items.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    go(-1);
                  }}
                  className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2"
                >
                  <ChevronLeft size={30} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    go(1);
                  }}
                  className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2"
                >
                  <ChevronRight size={30} />
                </button>
              </>
            )}

            <motion.img
              key={index}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              src={items[index].url}
              alt={`${title} — photo ${index + 1} agrandie`}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-full rounded-2xl object-contain"
            />

            <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-xs font-mono">
              {index + 1} / {items.length}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
