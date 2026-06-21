import { MapPin, Clock, Phone, Star } from 'lucide-react'

export default function StoreCard({ store, active, onSelect }) {
  return (
    <button
      onClick={() => onSelect(store.id)}
      className={`focus-ring w-full text-left rounded-2xl p-5 border transition-colors ${
        active ? 'bg-mora text-cream border-mora' : 'bg-white text-ink border-black/10 hover:border-mora/40'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display font-bold text-lg">{store.nombre}</h3>
        {store.principal && (
          <span className={`flex items-center gap-1 text-xs font-semibold ${active ? 'text-lucuma' : 'text-adobe'}`}>
            <Star size={14} fill="currentColor" /> Principal
          </span>
        )}
      </div>
      <p className={`flex items-start gap-2 text-sm mb-1.5 ${active ? 'text-cream/85' : 'text-ink/70'}`}>
        <MapPin size={16} className="shrink-0 mt-0.5" /> {store.direccion}
      </p>
      <p className={`flex items-start gap-2 text-sm mb-1.5 ${active ? 'text-cream/85' : 'text-ink/70'}`}>
        <Clock size={16} className="shrink-0 mt-0.5" /> {store.horario}
      </p>
      <p className={`flex items-start gap-2 text-sm ${active ? 'text-cream/85' : 'text-ink/70'}`}>
        <Phone size={16} className="shrink-0 mt-0.5" /> {store.telefono}
      </p>
    </button>
  )
}
