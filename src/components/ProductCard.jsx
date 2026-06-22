import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Plus } from 'lucide-react'
import { useCart } from '../context/CartContext'

const colorClasses = {
  mora: 'bg-mora text-cream',
  lucuma: 'bg-lucuma text-ink',
  adobe: 'bg-adobe text-cream',
}

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-white rounded-3xl overflow-hidden shadow-sm border border-black/5 flex flex-col"
    >
      <div className={`h-32 flex items-end p-5 ${colorClasses[product.color]}`}>
        <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
          {product.categoria}
        </span>
      </div>
      <div className="p-5 flex flex-col gap-2 flex-1">
        <h3 className="font-display font-bold text-lg text-ink">{product.nombre}</h3>
        <p className="text-sm text-ink/70 flex-1">{product.descripcion}</p>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleAdd}
          className={`focus-ring mt-3 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            added ? 'bg-selva text-cream' : 'border border-ink/15 text-ink hover:bg-ink hover:text-cream'
          }`}
        >
          {added ? <Check size={16} /> : <Plus size={16} />}
          {added ? 'Agregado' : 'Agregar al pedido'}
        </motion.button>
      </div>
    </motion.article>
  )
}
