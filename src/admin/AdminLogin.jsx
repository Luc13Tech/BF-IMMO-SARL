import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/images/logo.png';

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err?.response?.data?.message || 'Identifiants incorrects.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6 relative overflow-hidden">
      <motion.div
        aria-hidden
        className="absolute -top-24 -right-16 w-[420px] h-[420px] rounded-[45%_55%_65%_35%/40%_45%_55%_60%] bg-brand-gold/15 blur-3xl"
        animate={{ rotate: [0, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-sm bg-white rounded-[28px] p-9 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]"
      >
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="BF IMMO SARL" className="h-14 w-14 rounded-2xl object-cover mb-4" />
          <h1
            className="text-2xl text-ink"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            BF <em className="not-italic text-brand-red">Immo</em>
          </h1>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/40 mt-1">
            Espace administrateur
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" />
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-line focus:border-brand-gold outline-none text-sm"
            />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" />
            <input
              type="password"
              required
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-line focus:border-brand-gold outline-none text-sm"
            />
          </div>

          {error && <p className="text-brand-red text-sm font-medium">{error}</p>}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2 bg-ink text-white font-semibold py-3.5 rounded-full disabled:opacity-70 mt-2"
          >
            {loading ? <Loader2 size={17} className="animate-spin" /> : <LogIn size={16} />}
            Se connecter
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
