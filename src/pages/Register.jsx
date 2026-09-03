import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Loader2, UserPlus } from 'lucide-react';
import { useUserAuth } from '../context/UserAuthContext';

export default function Register() {
  const { register, isAuthenticated } = useUserAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/mon-compte" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/mon-compte');
    } catch (err) {
      setError(err?.response?.data?.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6 pt-24 pb-16 relative overflow-hidden">
      <motion.div
        aria-hidden
        className="absolute -top-24 -left-16 w-[420px] h-[420px] rounded-[45%_55%_65%_35%/40%_45%_55%_60%] bg-brand-gold/15 blur-3xl"
        animate={{ rotate: [0, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-sm bg-white rounded-[28px] p-9 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]"
      >
        <div className="mb-7">
          <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-brand-gold">
            Créer un compte
          </span>
          <h1 className="font-sans font-extrabold text-2xl text-ink mt-2">Rejoignez BF IMMO</h1>
          <p className="text-ink/50 text-sm font-light mt-1">
            Sauvegardez vos biens favoris et suivez vos demandes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" />
            <input
              required
              placeholder="Nom complet"
              value={form.fullName}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-line focus:border-brand-gold outline-none text-sm"
            />
          </div>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" />
            <input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-line focus:border-brand-gold outline-none text-sm"
            />
          </div>
          <div className="relative">
            <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" />
            <input
              placeholder="Téléphone (optionnel)"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-line focus:border-brand-gold outline-none text-sm"
            />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" />
            <input
              required
              type="password"
              placeholder="Mot de passe (8 caractères min.)"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-line focus:border-brand-gold outline-none text-sm"
            />
          </div>

          {error && <p className="text-brand-red text-sm font-medium">{error}</p>}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2 bg-brand-red text-white font-semibold py-3.5 rounded-full disabled:opacity-70 mt-2"
          >
            {loading ? <Loader2 size={17} className="animate-spin" /> : <UserPlus size={16} />}
            Créer mon compte
          </motion.button>
        </form>

        <p className="text-center text-sm text-ink/50 font-light mt-6">
          Déjà inscrit ?{' '}
          <Link to="/connexion" className="text-brand-red font-semibold hover:underline">
            Se connecter
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
