import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Heart, User } from 'lucide-react';
import { useUserAuth } from '../context/UserAuthContext';
import PropertyCard from '../components/properties/PropertyCard';

export default function Account() {
  const { user, favorites, logout } = useUserAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="pt-32 pb-24 bg-offwhite min-h-screen">
      <div className="container-bf">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-6 mb-12"
        >
          <div className="flex items-center gap-4">
            <span className="w-14 h-14 rounded-full bg-ink flex items-center justify-center">
              <User size={22} className="text-brand-goldSoft" />
            </span>
            <div>
              <h1 className="font-sans font-extrabold text-2xl text-ink">{user?.fullName}</h1>
              <p className="text-ink/50 font-light text-sm">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-ink/50 hover:text-brand-red text-sm font-medium transition-colors"
          >
            <LogOut size={16} /> Déconnexion
          </button>
        </motion.div>

        <div className="flex items-center gap-2 mb-6">
          <Heart size={18} className="text-brand-red" />
          <h2 className="font-sans font-bold text-lg text-ink">
            Mes biens favoris ({favorites.length})
          </h2>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-white rounded-[24px] p-12 text-center shadow-soft">
            <p className="text-ink/50 font-light">
              Vous n'avez pas encore de bien favori. Parcourez{' '}
              <a href="/biens" className="text-brand-red font-semibold hover:underline">
                nos biens
              </a>{' '}
              et cliquez sur le cœur pour les sauvegarder ici.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((p, i) => (
              <PropertyCard key={p._id} property={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
