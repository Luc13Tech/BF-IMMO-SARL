import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, Send } from 'lucide-react';
import { submitLead } from '../../api/client';

const inputBase =
  'w-full px-4 py-3.5 rounded-2xl border border-line bg-white text-[15px] text-ink placeholder:text-ink/35 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition-all duration-200';

function Field({ field, value, onChange }) {
  const [focused, setFocused] = useState(false);

  const commonProps = {
    id: field.name,
    name: field.name,
    required: field.required !== false,
    value: value || '',
    onChange: (e) => onChange(field.name, e.target.value),
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    className: inputBase,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <label
        htmlFor={field.name}
        className={`block text-[12.5px] font-medium mb-2 transition-colors ${
          focused ? 'text-brand-gold' : 'text-ink/60'
        }`}
      >
        {field.label}
        {field.required === false && <span className="text-ink/30 font-normal"> (optionnel)</span>}
      </label>

      {field.type === 'select' ? (
        <select {...commonProps}>
          <option value="">Sélectionner…</option>
          {(field.options || []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : field.type === 'textarea' ? (
        <textarea {...commonProps} rows={4} />
      ) : (
        <input type={field.type || 'text'} {...commonProps} />
      )}
    </motion.div>
  );
}

export default function ServiceForm({ service }) {
  const [values, setValues] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [error, setError] = useState('');

  const handleChange = (name, value) => setValues((v) => ({ ...v, [name]: value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    setError('');

    const { fullName, email, phone, message, ...rest } = values;

    try {
      await submitLead(service.slug, { fullName, email, phone, message, ...rest });
      setStatus('success');
      setValues({});
    } catch (err) {
      setStatus('error');
      setError(
        err?.response?.data?.message ||
          "Une erreur est survenue. Vérifiez votre connexion et réessayez."
      );
    }
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        className="bg-white rounded-[28px] p-10 text-center shadow-soft"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 15 }}
          className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5"
        >
          <CheckCircle2 size={30} className="text-emerald-600" />
        </motion.div>
        <h3 className="font-sans font-bold text-xl text-ink">Demande envoyée</h3>
        <p className="text-ink/60 font-light text-sm mt-2 max-w-sm mx-auto">
          Merci, votre demande de {service.name.toLowerCase()} a bien été transmise à BF IMMO.
          Notre équipe vous recontacte rapidement.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-6 text-brand-red text-sm font-semibold hover:underline"
        >
          Envoyer une autre demande
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-[28px] p-8 sm:p-10 shadow-soft space-y-5"
    >
      <div className="grid sm:grid-cols-2 gap-5">
        <Field
          field={{ name: 'fullName', label: 'Nom complet', required: true }}
          value={values.fullName}
          onChange={handleChange}
        />
        <Field
          field={{ name: 'phone', label: 'Téléphone', type: 'tel', required: true }}
          value={values.phone}
          onChange={handleChange}
        />
      </div>

      <Field
        field={{ name: 'email', label: 'Email', type: 'email', required: false }}
        value={values.email}
        onChange={handleChange}
      />

      {(service.formFields || []).map((field) => (
        <Field key={field.name} field={field} value={values[field.name]} onChange={handleChange} />
      ))}

      <Field
        field={{ name: 'message', label: 'Message (optionnel)', type: 'textarea', required: false }}
        value={values.message}
        onChange={handleChange}
      />

      <AnimatePresence>
        {status === 'error' && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-brand-red text-sm font-medium"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.button
        type="submit"
        disabled={status === 'sending'}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        className="w-full flex items-center justify-center gap-2 bg-brand-red text-white font-semibold py-4 rounded-full shadow-[0_14px_30px_-12px_rgba(226,35,26,0.55)] disabled:opacity-70 transition-opacity"
      >
        {status === 'sending' ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Envoi en cours…
          </>
        ) : (
          <>
            <Send size={16} /> Envoyer la demande
          </>
        )}
      </motion.button>
    </form>
  );
}
