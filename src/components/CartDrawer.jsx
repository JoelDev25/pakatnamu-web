import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Minus, Plus, Trash2, ShoppingBag, MessageCircle } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

const WHATSAPP_NUMBER = '51987654321'

const DOT_COLORS = {
  mora: 'bg-mora',
  lucuma: 'bg-lucuma',
  adobe: 'bg-adobe',
}

export default function CartDrawer({ open, onClose, onRequireLogin }) {
  const { items, setQty, removeItem, clear, totalItems } = useCart()
  const { user } = useAuth()
  const [status, setStatus] = useState({ loading: false, error: '', success: false })

  const buildMessage = () => {
    const lines = items.map((i) => `• ${i.qty}x ${i.nombre}`).join('\n')
    return `¡Hola Pakatnamú! Quiero coordinar este pedido:\n\n${lines}\n\nQuedo atento para confirmar precio y entrega. ¡Gracias!`
  }

  const handleWhatsapp = () => {
    const text = encodeURIComponent(buildMessage())
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank')
  }

  const handleSendOrder = async () => {
    if (!user) {
      onRequireLogin()
      return
    }
    setStatus({ loading: true, error: '', success: false })

    if (!isSupabaseConfigured) {
      setTimeout(() => {
        setStatus({ loading: false, error: '', success: true })
      }, 600)
      return
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{ user_id: user.id, status: 'pendiente' }])
      .select()
      .single()

    if (orderError) {
      setStatus({ loading: false, error: orderError.message, success: false })
      return
    }

    const orderItems = items.map((i) => ({
      order_id: order.id,
      product_id: i.id,
      nombre: i.nombre,
      qty: i.qty,
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)

    if (itemsError) {
      setStatus({ loading: false, error: itemsError.message, success: false })
      return
    }

    setStatus({ loading: false, error: '', success: true })
    
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[110] bg-ink/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className="fixed top-0 right-0 z-[120] h-full w-full sm:max-w-md bg-cream shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/10">
              <h2 className="font-display font-extrabold text-xl text-ink flex items-center gap-2">
                <ShoppingBag size={20} className="text-mora" /> Tu pedido
              </h2>
              <button onClick={onClose} aria-label="Cerrar" className="focus-ring text-ink/50 hover:text-ink">
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-3 text-ink/60">
                  <ShoppingBag size={40} className="text-ink/20" />
                  <p>Tu pedido está vacío.</p>
                  <p className="text-sm">Agrega variedades desde "Nuestras variedades" en Inicio.</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-black/5"
                    >
                      <span className={`w-3 h-3 rounded-full shrink-0 ${DOT_COLORS[item.color] || 'bg-ink/30'}`} aria-hidden="true" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-ink truncate">{item.nombre}</p>
                        <p className="text-xs text-ink/50">{item.categoria}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setQty(item.id, item.qty - 1)}
                          aria-label="Restar"
                          className="focus-ring w-7 h-7 rounded-full border border-ink/15 flex items-center justify-center text-ink hover:bg-cream-deep"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center font-semibold text-ink">{item.qty}</span>
                        <button
                          onClick={() => setQty(item.id, item.qty + 1)}
                          aria-label="Sumar"
                          className="focus-ring w-7 h-7 rounded-full border border-ink/15 flex items-center justify-center text-ink hover:bg-cream-deep"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        aria-label="Quitar"
                        className="focus-ring text-ink/40 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-black/10 space-y-3">
                <p className="text-sm text-ink/60">
                  {totalItems} {totalItems === 1 ? 'producto' : 'productos'} · el precio y la entrega se
                  confirman al coordinar tu pedido.
                </p>

                {status.error && <p className="text-sm text-red-600">{status.error}</p>}
                {status.success && (
                  <p className="text-sm font-medium text-selva">
                    ¡Pedido enviado! Te contactaremos para confirmar precio y entrega.
                  </p>
                )}

                <button
                  onClick={handleSendOrder}
                  disabled={status.loading}
                  className="focus-ring w-full rounded-full bg-ink text-cream font-semibold py-3 hover:bg-mora-deep transition-colors disabled:opacity-60"
                >
                  {status.loading ? 'Enviando…' : user ? 'Confirmar pedido' : 'Inicia sesión para confirmar'}
                </button>
                <button
                  onClick={handleWhatsapp}
                  className="focus-ring w-full flex items-center justify-center gap-2 rounded-full border border-ink/15 text-ink font-semibold py-3 hover:bg-white transition-colors"
                >
                  <MessageCircle size={18} /> Coordinar por WhatsApp
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
