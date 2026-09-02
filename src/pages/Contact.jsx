import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Loader2, Send, CheckCircle2 } from 'lucide-react';
import { getContent, submitLead } from '../api/client';
import MapEmbed from '../components/ui/MapEmbed';

export default function Contact() {
  const [content, setContent] = useState({});
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    getContent().then(setContent).catch(() => {});
    window.scrollTo({ top: 0 });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    try {
      await submitLead('contact', form);
      setStatus('success');
      setForm({ fullName: '', phone: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  }

  const phone = content['contact.phone'] || '+221 33 813 42 65';
  const whatsapp = content['contact.whatsapp'] || '+221 77 829 41 42';
  const email = content['contact.email'] || 'bfimmo@gmail.com';
  const address = content['contact.address'] || 'Cité Belle Ville, Villa N°102KMV, Sicap Keur Massar, Dakar';

  return (
    <div className="pt-32 pb-24 bg-offwhite">
      <div className="container-bf grid lg:grid-cols-[0.9fr_1.1fr] gap-14">
        <div>
          <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-brand-gold">
            Contact
          </span>
          <h1 className="font-sans font-extrabold text-4xl text-ink mt-4">
            Parlons de votre projet
          </h1>
          <p className="text-ink/60 font-light mt-4 leading-relaxed max-w-sm">
            Une question, un bien à visiter, un projet de construction ? Notre équipe vous répond rapidement.
          </p>

          <div className="mt-10 space-y-5">
            {[
              { icon: MapPin, label: address },
              { icon: Phone, label: phone, href: `tel:${phone.replace(/\s/g, '')}` },
              { icon: Mail, label: email, href: `mailto:${email}` },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4"
              >
                <span className="w-11 h-11 rounded-full bg-ink flex items-center justify-center shrink-0">
                  <item.icon size={17} className="text-brand-goldSoft" />
                </span>
                {item.href ? (
                  <a href={item.href} className="text-ink/75 hover:text-ink text-sm font-light transition-colors">
                    {item.label}
                  </a>
                ) : (
                  <span className="text-ink/75 text-sm font-light">{item.label}</span>
                )}
              </motion.div>
            ))}
          </div>

          <motion.a
            href={`https://wa.me/${whatsapp.replace(/[^\d]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            whileHover={{ y: -2 }}
            className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full bg-[#25D366] text-white font-semibold text-sm"
          >
            Discuter sur WhatsApp
          </motion.a>

          <div className="mt-10">
            <MapEmbed />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {status === 'success' ? (
            <div className="bg-white rounded-[28px] shadow-soft p-10 text-center">
              <CheckCircle2 size={32} className="text-emerald-600 mx-auto mb-4" />
              <h3 className="font-bold text-xl text-ink">Message envoyé</h3>
              <p className="text-ink/55 font-light text-sm mt-2">Nous vous répondons très vite.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-[28px] shadow-soft p-8 sm:p-10 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <input
                  required
                  placeholder="Nom complet"
                  value={form.fullName}
                  onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                  className="px-4 py-3.5 rounded-2xl border border-line focus:border-brand-gold outline-none text-sm"
                />
                <input
                  required
                  type="tel"
                  placeholder="Téléphone"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="px-4 py-3.5 rounded-2xl border border-line focus:border-brand-gold outline-none text-sm"
                />
              </div>
              <input
                type="email"
                placeholder="Email (optionnel)"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full px-4 py-3.5 rounded-2xl border border-line focus:border-brand-gold outline-none text-sm"
              />
              <textarea
                required
                rows={5}
                placeholder="Votre message"
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                className="w-full px-4 py-3.5 rounded-2xl border border-line focus:border-brand-gold outline-none text-sm"
              />
              <motion.button
                type="submit"
                disabled={status === 'sending'}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-2 bg-brand-red text-white font-semibold py-4 rounded-full disabled:opacity-70"
              >
                {status === 'sending' ? <Loader2 size={17} className="animate-spin" /> : <Send size={16} />}
                Envoyer le message
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
