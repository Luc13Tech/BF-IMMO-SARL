import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, Heart } from 'lucide-react';
import logo from '../../assets/images/logo.png';
import { useUserAuth } from '../../context/UserAuthContext';

const NAV = [
  { label: 'Achat', to: '/services/achat' },
  { label: 'Location', to: '/services/location' },
  { label: 'Gérance', to: '/services/gerance' },
  { label: 'Vente', to: '/services/vente' },
  { label: 'Conseils', to: '/services/conseils' },
  { label: 'BTP', to: '/services/btp' },
  { label: 'Nos biens', to: '/biens' },
  { label: 'Contact', to: '/contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, favorites } = useUserAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
          scrolled ? 'bg-ink/95 backdrop-blur-md shadow-[0_10px_30px_-15px_rgba(0,0,0,0.5)]' : 'bg-ink'
        }`}
      >
        <div className="container-bf flex items-center justify-between h-20">
          {/* Logo + wordmark */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.img
              src={logo}
              alt="BF IMMO SARL"
              initial={{ opacity: 0, rotate: -8, scale: 0.85 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="h-11 w-11 rounded-xl object-cover shadow-[0_8px_20px_-8px_rgba(0,0,0,0.6)]"
            />
            <span className="flex flex-col leading-none">
              <span
                className="font-brand text-2xl text-white tracking-wide relative"
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
              >
                BF <em className="not-italic text-brand-red">Immo</em>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
                  className="absolute left-0 -bottom-0.5 h-[1.5px] w-full bg-brand-gold origin-left"
                />
              </span>
              <span className="font-mono text-[9px] tracking-[0.25em] text-brand-goldSoft mt-1 uppercase">
                Sénégal · SARL
              </span>
            </span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-7">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `relative py-2 text-[13px] font-medium tracking-wide uppercase text-white/75 hover:text-white transition-colors group ${
                    isActive ? 'text-white' : ''
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    <span
                      className={`absolute left-1/2 -translate-x-1/2 -bottom-0.5 h-[1.5px] bg-brand-gold transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}

            <Link
              to={isAuthenticated ? '/mon-compte' : '/connexion'}
              className="relative flex items-center gap-2 pl-5 ml-2 border-l border-white/15 text-white/75 hover:text-white transition-colors"
              aria-label={isAuthenticated ? 'Mon compte' : 'Se connecter'}
            >
              <span className="relative">
                <User size={18} />
                {isAuthenticated && favorites.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-brand-red text-[8px] font-bold flex items-center justify-center text-white">
                    {favorites.length}
                  </span>
                )}
              </span>
              <span className="text-[13px] font-medium uppercase tracking-wide">
                {isAuthenticated ? user?.fullName?.split(' ')[0] : 'Connexion'}
              </span>
            </Link>
          </nav>

          <div className="flex items-center gap-4 lg:hidden">
            <Link to={isAuthenticated ? '/mon-compte' : '/connexion'} className="text-white p-1 relative">
              <User size={22} />
              {isAuthenticated && favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-brand-red text-[8px] font-bold flex items-center justify-center text-white">
                  {favorites.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setOpen(true)}
              aria-label="Ouvrir le menu"
              className="text-white p-2"
            >
              <Menu size={26} />
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile plein écran, courbe organique */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: 'circle(0% at 100% 0%)' }}
            animate={{ clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ clipPath: 'circle(0% at 100% 0%)' }}
            transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
            className="fixed inset-0 z-50 bg-ink flex flex-col"
          >
            <div className="flex justify-end p-6">
              <button onClick={() => setOpen(false)} aria-label="Fermer le menu" className="text-white p-2">
                <X size={28} />
              </button>
            </div>
            <nav className="flex flex-col gap-1 px-8 mt-6">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.06 }}
                >
                  <NavLink
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="block py-3.5 text-2xl font-semibold text-white border-b border-white/10"
                    style={{ fontFamily: '"Times New Roman", Times, serif' }}
                  >
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + NAV.length * 0.06 }}
              >
                <NavLink
                  to={isAuthenticated ? '/mon-compte' : '/connexion'}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 py-3.5 text-2xl font-semibold text-brand-gold"
                  style={{ fontFamily: '"Times New Roman", Times, serif' }}
                >
                  <User size={20} />
                  {isAuthenticated ? 'Mon compte' : 'Connexion'}
                </NavLink>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
