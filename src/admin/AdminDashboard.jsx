import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Inbox, Building2, Layers, ArrowUpRight } from 'lucide-react';
import { getAllLeads, getAllPropertiesAdmin, getAllServicesAdmin } from '../api/client';

function StatCard({ icon: Icon, label, value, to, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Link
        to={to}
        className="group block bg-white rounded-[24px] p-7 shadow-soft hover:shadow-[0_24px_50px_-20px_rgba(30,32,39,0.45)] transition-shadow"
      >
        <div className="flex items-center justify-between">
          <span className="w-12 h-12 rounded-full bg-ink flex items-center justify-center">
            <Icon size={19} className="text-brand-goldSoft" />
          </span>
          <ArrowUpRight
            size={16}
            className="text-ink/30 group-hover:text-brand-red group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"
          />
        </div>
        <p className="font-sans font-extrabold text-3xl text-ink mt-6">{value}</p>
        <p className="text-ink/55 text-sm font-light mt-1">{label}</p>
      </Link>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ leads: 0, newLeads: 0, properties: 0, services: 0 });

  useEffect(() => {
    Promise.all([getAllLeads(), getAllPropertiesAdmin(), getAllServicesAdmin()]).then(
      ([leads, properties, services]) => {
        setStats({
          leads: leads.length,
          newLeads: leads.filter((l) => l.status === 'nouveau').length,
          properties: properties.length,
          services: services.filter((s) => s.active).length,
        });
      }
    );
  }, []);

  return (
    <div>
      <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-ink">Tableau de bord</h1>
      <p className="text-ink/55 font-light mt-2">Vue d'ensemble de la plateforme BF IMMO.</p>

      <div className="grid sm:grid-cols-3 gap-6 mt-8">
        <StatCard
          icon={Inbox}
          label={`${stats.newLeads} nouvelle(s) demande(s)`}
          value={stats.leads}
          to="/admin/demandes"
          delay={0}
        />
        <StatCard
          icon={Building2}
          label="Biens publiés"
          value={stats.properties}
          to="/admin/biens"
          delay={0.1}
        />
        <StatCard
          icon={Layers}
          label="Métiers actifs sur 7"
          value={stats.services}
          to="/admin/services"
          delay={0.2}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="mt-10 bg-ink rounded-[24px] p-8 relative overflow-hidden"
      >
        <svg className="absolute -right-8 -top-8 w-40 opacity-[0.07]" viewBox="0 0 200 110" fill="none">
          <path d="M20 95 L100 25 L180 95 Z" fill="white" />
        </svg>
        <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-brand-goldSoft">
          Rappel
        </p>
        <p className="text-white font-light mt-2 max-w-lg text-sm leading-relaxed">
          Tout ce que vous modifiez ici (métiers, biens, textes, base de connaissance de
          l'Assistant IA) s'affiche immédiatement sur la plateforme publique — aucune mise à
          jour de code n'est nécessaire.
        </p>
      </motion.div>
    </div>
  );
}
