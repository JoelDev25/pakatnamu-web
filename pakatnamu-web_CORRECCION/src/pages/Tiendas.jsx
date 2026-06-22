import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Reveal from '../components/Reveal'
import StoreCard from '../components/StoreCard'
import { stores } from '../data/mockData'

export default function Tiendas() {
  const [activeId, setActiveId] = useState(stores[0].id)
  const active = stores.find((s) => s.id === activeId)

  return (
    <div className="pt-16 md:pt-20">
      <section className="bg-ink py-16">
        <Reveal className="mx-auto max-w-3xl px-5 text-center">
          <span className="text-lucuma font-semibold text-sm uppercase tracking-wider">Tiendas</span>
          <h1 className="font-display font-extrabold text-3xl md:text-5xl text-cream mt-2 text-balance">
            Encuentra tu sede más cercana
          </h1>
        </Reveal>
      </section>

      <section className="bg-cream py-16">
        <div className="mx-auto max-w-6xl px-5 grid lg:grid-cols-[1fr_1.2fr] gap-10">
          <div className="space-y-4">
            {stores.map((s) => (
              <StoreCard key={s.id} store={s} active={s.id === activeId} onSelect={setActiveId} />
            ))}
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-lg min-h-[420px] bg-white">
            <AnimatePresence mode="wait">
              <motion.iframe
                key={active.id}
                title={`Mapa de ${active.nombre}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0 w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=-77.05%2C-12.13%2C-77.00%2C-12.08&layer=mapnik`}
              />
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  )
}
