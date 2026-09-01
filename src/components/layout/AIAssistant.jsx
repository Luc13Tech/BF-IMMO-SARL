import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Loader2 } from 'lucide-react';
import { getAIContext } from '../../api/client';

/**
 * Fenêtre de chat de l'Assistant Virtuel BF IMMO.
 *
 * Note d'intégration : ce composant récupère le contexte (services,
 * coordonnées, base de connaissance) depuis /api/ai-assistant/context,
 * puis l'envoie avec l'historique de conversation à ton propre endpoint
 * IA (ex: une fonction serverless qui appelle l'API Anthropic/OpenAI).
 * Remplace `callAssistant()` ci-dessous par ton appel réel une fois
 * cet endpoint créé — la fonction est isolée exprès pour ça.
 */

async function callAssistant(context, history, question) {
  // TODO : remplacer par l'appel réel à ton backend IA.
  // Exemple attendu : POST /api/ai-assistant/ask { context, history, question }
  await new Promise((r) => setTimeout(r, 900));
  return `Je suis en cours de configuration. Une fois connecté, je pourrai répondre à propos de : ${context.services
    .map((s) => s.name)
    .join(', ')}. Vous pouvez aussi joindre BF IMMO directement au ${context.contact.whatsapp}.`;
}

export default function AIAssistant({ open, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Bonjour ! Je suis l'Assistant Virtuel de BF IMMO. Posez-moi une question sur nos services, nos biens, ou nos coordonnées." },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [context, setContext] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (open && !context) {
      getAIContext().then(setContext).catch(() => {});
    }
  }, [open, context]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sending]);

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const question = input.trim();
    const newHistory = [...messages, { role: 'user', text: question }];
    setMessages(newHistory);
    setInput('');
    setSending(true);

    try {
      const answer = await callAssistant(
        context || { services: [], contact: {} },
        newHistory,
        question
      );
      setMessages((m) => [...m, { role: 'assistant', text: answer }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'assistant', text: "Désolé, je rencontre un souci technique. Contactez-nous directement sur WhatsApp." },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          className="fixed bottom-24 left-5 z-40 w-[calc(100vw-2.5rem)] max-w-sm h-[520px] max-h-[70vh] bg-white rounded-[26px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.35)] flex flex-col overflow-hidden border border-line"
        >
          {/* En-tête */}
          <div className="bg-ink px-5 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-ink-soft border border-brand-red flex items-center justify-center">
                <Bot size={17} className="text-brand-red" />
              </span>
              <div>
                <p className="text-white font-semibold text-sm">Assistant BF IMMO</p>
                <p className="text-white/40 text-[10.5px] font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> En ligne
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/60 hover:text-white p-1">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-offwhite">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-[13.5px] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-brand-red text-white rounded-br-sm'
                      : 'bg-white text-ink border border-line rounded-bl-sm'
                  }`}
                >
                  {m.text}
                </div>
              </motion.div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-white border border-line px-4 py-2.5 rounded-2xl rounded-bl-sm">
                  <Loader2 size={14} className="animate-spin text-brand-gold" />
                </div>
              </div>
            )}
          </div>

          {/* Saisie */}
          <form onSubmit={handleSend} className="p-3 border-t border-line flex items-center gap-2 bg-white shrink-0">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Écrivez votre question…"
              className="flex-1 px-4 py-2.5 rounded-full bg-offwhite text-sm outline-none focus:ring-2 focus:ring-brand-gold/30"
            />
            <motion.button
              type="submit"
              whileTap={{ scale: 0.9 }}
              disabled={sending}
              className="w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center shrink-0 disabled:opacity-50"
            >
              <Send size={15} />
            </motion.button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
