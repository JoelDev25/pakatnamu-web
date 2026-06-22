import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, ShoppingBag, UserRound, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/tiendas', label: 'Tiendas' },
  { to: '/contacto', label: 'Contacto' },
]

export default function Navbar({ onOpenAuth, onOpenCart }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, signOut } = useAuth()
  const { totalItems } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const displayName =
    user?.user_metadata?.nombre_completo?.split(' ')[0] || user?.email?.split('@')[0] || 'Cuenta'

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-ink/95 backdrop-blur shadow-lg shadow-black/20' : 'bg-ink'
      }`}
    >
      <nav className="mx-auto max-w-6xl px-5 flex items-center justify-between h-16 md:h-20">
        <NavLink to="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
          <span aria-hidden className="relative w-9 h-9 md:w-10 md:h-10">
            <span className="absolute inset-0 rounded-full bg-mora" />
            <span className="absolute left-0 top-0 w-6 h-6 rounded-full bg-lucuma" />
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-x-[7px] border-x-transparent border-t-[12px] border-t-adobe" />
          </span>
          <span className="font-display font-extrabold text-xl md:text-2xl text-cream leading-none tracking-tight">
            Pakatnamú
          </span>
        </NavLink>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `font-medium text-sm tracking-wide transition-colors focus-ring rounded ${
                  isActive ? 'text-lucuma' : 'text-cream/80 hover:text-cream'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onOpenCart}
            aria-label="Ver pedido"
            className="focus-ring relative w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-cream hover:bg-white/20 transition-colors"
          >
            <ShoppingBag size={18} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-lucuma text-ink text-[11px] font-bold flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="focus-ring flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold bg-white/10 text-cream hover:bg-white/20 transition-colors"
              >
                <UserRound size={16} />
                {displayName}
                <ChevronDown size={14} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {userMenuOpen && (
                <div
                  onMouseLeave={() => setUserMenuOpen(false)}
                  className="absolute right-0 mt-2 w-44 bg-cream rounded-2xl shadow-xl overflow-hidden border border-black/5"
                >
                  <button
                    onClick={() => {
                      signOut()
                      setUserMenuOpen(false)
                    }}
                    className="focus-ring w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-ink hover:bg-cream-deep transition-colors"
                  >
                    <LogOut size={16} /> Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => onOpenAuth('login')}
                className="focus-ring px-4 py-2 rounded-full text-sm font-semibold bg-lucuma text-ink hover:bg-lucuma-soft transition-colors"
              >
                Ingresar
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="focus-ring px-4 py-2 rounded-full text-sm font-semibold border border-lucuma text-lucuma hover:bg-lucuma hover:text-ink transition-colors"
              >
                Registrarse
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onOpenCart}
            aria-label="Ver pedido"
            className="focus-ring relative w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-cream"
          >
            <ShoppingBag size={18} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-lucuma text-ink text-[11px] font-bold flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          <button
            className="text-cream focus-ring rounded p-1"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="md:hidden bg-ink-soft border-t border-white/10"
        >
          <div className="px-5 py-4 flex flex-col gap-4">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `font-medium text-base ${isActive ? 'text-lucuma' : 'text-cream/85'}`
                }
              >
                {l.label}
              </NavLink>
            ))}

            {user ? (
              <div className="pt-2 border-t border-white/10">
                <p className="text-cream/70 text-sm mb-3">Hola, {displayName}</p>
                <button
                  onClick={() => {
                    signOut()
                    setOpen(false)
                  }}
                  className="flex items-center gap-2 text-cream font-semibold text-sm"
                >
                  <LogOut size={16} /> Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { onOpenAuth('login'); setOpen(false) }}
                  className="flex-1 px-4 py-2 rounded-full text-sm font-semibold bg-lucuma text-ink"
                >
                  Ingresar
                </button>
                <button
                  onClick={() => { onOpenAuth('register'); setOpen(false) }}
                  className="flex-1 px-4 py-2 rounded-full text-sm font-semibold border border-lucuma text-lucuma"
                >
                  Registrarse
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </header>
  )
}
