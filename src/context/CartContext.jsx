import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

function storageKey(userId) {
  return `pakatnamu-cart-${userId || 'invitado'}`
}

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])

  // Carga el carrito guardado para este usuario (o el de "invitado") al iniciar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(user?.id))
      setItems(raw ? JSON.parse(raw) : [])
    } catch {
      setItems([])
    }
  }, [user?.id])

  // Guarda cualquier cambio del carrito
  useEffect(() => {
    try {
      localStorage.setItem(storageKey(user?.id), JSON.stringify(items))
    } catch {
      // almacenamiento no disponible: el carrito sigue funcionando solo en memoria
    }
  }, [items, user?.id])

  const addItem = (product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i))
      }
      return [...prev, { id: product.id, nombre: product.nombre, categoria: product.categoria, color: product.color, qty: 1 }]
    })
  }

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id))

  const setQty = (id, qty) => {
    if (qty <= 0) return removeItem(id)
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)))
  }

  const clear = () => setItems([])

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, setQty, clear, totalItems }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>')
  return ctx
}
