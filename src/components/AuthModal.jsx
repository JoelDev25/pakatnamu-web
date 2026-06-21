import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Mail, Lock, User, Phone, AtSign } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

export default function AuthModal({ mode, onClose, onSwitch }) {
  const [form, setForm] = useState({ nombre: '', correo: '', usuario: '', telefono: '', contrasena: '' })
  const [status, setStatus] = useState({ loading: false, error: '', success: '' })

  useEffect(() => {
    setStatus({ loading: false, error: '', success: '' })
  }, [mode])

  if (!mode) return null

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ loading: true, error: '', success: '' })

    if (!isSupabaseConfigured) {
      setStatus({
        loading: false,
        error: '',
        success: 'Demo: conecta Supabase (.env) para habilitar el ingreso real. Revisa el README.',
      })
      return
    }

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.correo,
          password: form.contrasena,
        })
        if (error) throw error
        setStatus({ loading: false, error: '', success: '¡Bienvenido de nuevo!' })
      } else {
        const { error } = await supabase.auth.signUp({
          email: form.correo,
          password: form.contrasena,
          options: {
            data: { nombre_completo: form.nombre, usuario: form.usuario, telefono: form.telefono },
          },
        })
        if (error) throw error
        setStatus({ loading: false, error: '', success: 'Cuenta creada. Revisa tu correo para confirmar.' })
      }
    } catch (err) {
      setStatus({ loading: false, error: err.message ?? 'Ocurrió un error, intenta de nuevo.', success: '' })
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] bg-ink/70 backdrop-blur-sm flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="relative w-full max-w-sm bg-cream rounded-3xl shadow-2xl p-7"
        >
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="focus-ring absolute top-4 right-4 text-ink/50 hover:text-ink"
          >
            <X size={22} />
          </button>

          <h2 className="font-display font-extrabold text-2xl text-ink mb-1">
            {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </h2>
          <p className="text-sm text-ink/60 mb-5">
            {mode === 'login'
              ? 'Ingresa para guardar tus sedes y promociones favoritas.'
              : 'Regístrate y entérate primero de nuestras promociones.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'register' && (
              <Field icon={User} type="text" placeholder="Nombre completo" value={form.nombre} onChange={update('nombre')} required />
            )}
            <Field icon={Mail} type="email" placeholder="Correo electrónico" value={form.correo} onChange={update('correo')} required />
            {mode === 'register' && (
              <Field icon={AtSign} type="text" placeholder="Usuario" value={form.usuario} onChange={update('usuario')} required />
            )}
            {mode === 'register' && (
              <Field icon={Phone} type="tel" placeholder="Teléfono" value={form.telefono} onChange={update('telefono')} required />
            )}
            <Field icon={Lock} type="password" placeholder="Contraseña" value={form.contrasena} onChange={update('contrasena')} required minLength={6} />

            {status.error && <p className="text-sm text-red-600">{status.error}</p>}
            {status.success && <p className="text-sm text-selva">{status.success}</p>}

            <button
              type="submit"
              disabled={status.loading}
              className="focus-ring w-full mt-2 rounded-full bg-ink text-cream font-semibold py-3 hover:bg-mora-deep transition-colors disabled:opacity-60"
            >
              {status.loading ? 'Procesando…' : mode === 'login' ? 'Ingresar' : 'Registrar'}
            </button>
          </form>

          {mode === 'login' && (
            <button className="focus-ring mt-3 text-sm text-mora hover:underline">¿Olvidaste tu contraseña?</button>
          )}

          <p className="mt-5 text-center text-sm text-ink/70">
            {mode === 'login' ? '¿Aún no tienes cuenta? ' : '¿Ya tienes cuenta? '}
            <button
              onClick={() => onSwitch(mode === 'login' ? 'register' : 'login')}
              className="focus-ring font-semibold text-mora hover:underline"
            >
              {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
            </button>
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function Field({ icon: Icon, ...props }) {
  return (
    <label className="flex items-center gap-3 bg-white rounded-full px-4 py-3 border border-black/10 focus-within:border-mora transition-colors">
      <Icon size={18} className="text-ink/40 shrink-0" />
      <input {...props} className="w-full outline-none bg-transparent text-sm placeholder:text-ink/40" />
    </label>
  )
}
