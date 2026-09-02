import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Trash2, Phone, Mail } from 'lucide-react';
import { getAllLeads, updateLeadStatus, deleteLead } from '../api/client';

const SERVICES = [
  { value: '', label: 'Tous les services' },
  { value: 'achat', label: 'Achat' },
  { value: 'location', label: 'Location' },
  { value: 'gerance', label: 'Gérance' },
  { value: 'vente', label: 'Vente' },
  { value: 'conseils', label: 'Conseils' },
  { value: 'btp', label: 'Construction BTP' },
  { value: 'suivi-chantier', label: 'Suivi de chantier' },
  { value: 'contact', label: 'Contact général' },
];

const STATUS = [
  { value: 'nouveau', label: 'Nouveau', color: 'bg-brand-red/10 text-brand-red' },
  { value: 'en_cours', label: 'En cours', color: 'bg-amber-50 text-amber-700' },
  { value: 'traite', label: 'Traité', color: 'bg-emerald-50 text-emerald-700' },
  { value: 'archive', label: 'Archivé', color: 'bg-ink/10 text-ink/50' },
];

export default function LeadsManager() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  function load() {
    setLoading(true);
    getAllLeads(filter ? { service: filter } : {})
      .then(setLeads)
      .finally(() => setLoading(false));
  }

  useEffect(load, [filter]);

  async function handleStatusChange(id, status) {
    setLeads((list) => list.map((l) => (l._id === id ? { ...l, status } : l)));
    await updateLeadStatus(id, status);
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer cette demande ?')) return;
    await deleteLead(id);
    setLeads((list) => list.filter((l) => l._id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-ink">
            Demandes reçues
          </h1>
          <p className="text-ink/55 font-light mt-2">{leads.length} demande(s)</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-line text-sm outline-none focus:border-brand-gold"
        >
          {SERVICES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <Loader2 className="animate-spin text-brand-gold" size={26} />
        </div>
      ) : leads.length === 0 ? (
        <p className="text-ink/50 font-light mt-10">Aucune demande pour ce filtre.</p>
      ) : (
        <div className="space-y-4 mt-8">
          {leads.map((lead, i) => (
            <motion.div
              key={lead._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i, 8) * 0.04 }}
              className="bg-white rounded-[20px] p-6 shadow-soft"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[10.5px] uppercase tracking-wide text-brand-gold">
                      {SERVICES.find((s) => s.value === lead.service)?.label || lead.service}
                    </span>
                    <span className="text-ink/30 text-xs">
                      {new Date(lead.createdAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="font-bold text-ink mt-1.5">{lead.fullName}</p>
                  <div className="flex items-center gap-4 mt-1 text-ink/55 text-sm">
                    <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 hover:text-ink">
                      <Phone size={13} /> {lead.phone}
                    </a>
                    {lead.email && (
                      <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 hover:text-ink">
                        <Mail size={13} /> {lead.email}
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border-0 outline-none ${
                      STATUS.find((s) => s.value === lead.status)?.color
                    }`}
                  >
                    {STATUS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleDelete(lead._id)}
                    className="p-2 text-ink/30 hover:text-brand-red transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {(lead.data && Object.keys(lead.data).length > 0) && (
                <div className="mt-4 pt-4 border-t border-line flex flex-wrap gap-x-6 gap-y-1.5">
                  {Object.entries(lead.data).map(([key, value]) => (
                    <span key={key} className="text-xs text-ink/55">
                      <span className="font-mono text-ink/35">{key} :</span> {String(value)}
                    </span>
                  ))}
                </div>
              )}

              {lead.message && (
                <p className="mt-3 text-sm text-ink/65 font-light italic">« {lead.message} »</p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
