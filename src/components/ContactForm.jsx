import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

export default function ContactForm() {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', mensaje: '' })
  const [status, setStatus] = useState({ loading: false, error: '', success: false })

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ loading: true, error: '', success: false })

    if (!isSupabaseConfigured) {
      setTimeout(() => {
        setStatus({ loading: false, error: '', success: true })
        setForm({ nombre: '', email: '', telefono: '', mensaje: '' })
      }, 500)
      return
    }

    const { error } = await supabase.from('contact_messages').insert([
      { nombre: form.nombre, email: form.email, telefono: form.telefono, mensaje: form.mensaje },
    ])

    if (error) {
      setStatus({ loading: false, error: error.message, success: false })
    } else {
      setStatus({ loading: false, error: '', success: true })
      setForm({ nombre: '', email: '', telefono: '', mensaje: '' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Nombre" value={form.nombre} onChange={update('nombre')} placeholder="Tu nombre" required />
      <FormField label="E-mail" type="email" value={form.email} onChange={update('email')} placeholder="tu@email.com" required />
      <FormField label="Teléfono" type="tel" value={form.telefono} onChange={update('telefono')} placeholder="+51 9XX XXX XXX" />
      <div>
        <label className="block text-sm font-semibold text-ink mb-1.5">Mensaje</label>
        <textarea
          value={form.mensaje}
          onChange={update('mensaje')}
          placeholder="Tu mensaje"
          rows={5}
          required
          className="focus-ring w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-mora resize-none"
        />
      </div>

      {status.error && <p className="text-sm text-red-600">{status.error}</p>}
      {status.success && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-medium text-selva"
        >
          ¡Gracias! Tu mensaje fue enviado, te contactaremos pronto.
        </motion.p>
      )}

      <motion.button
        whileTap={{ scale: 0.97 }}
        disabled={status.loading}
        className="focus-ring w-full sm:w-auto px-8 py-3 rounded-full bg-ink text-cream font-semibold tracking-wide hover:bg-mora-deep transition-colors disabled:opacity-60"
      >
        {status.loading ? 'Enviando…' : 'Enviar'}
      </motion.button>
    </form>
  )
}

function FormField({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-ink mb-1.5">{label}</label>
      <input
        {...props}
        className="focus-ring w-full rounded-full border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-mora"
      />
    </div>
  )
}
