import { useEffect, useState } from 'react'
import { Copy, Check, MapPin, Leaf, Users, Store } from 'lucide-react'
import Reveal from '../components/Reveal'
import ScoopDivider from '../components/ScoopDivider'
import ProductCard from '../components/ProductCard'
import JourneyWrapper from '../components/JourneyWrapper'
import { products, promoCode } from '../data/mockData'

const stats = [
  { icon: Store, value: 4, label: 'Sedes en Lima' },
  { icon: Leaf, value: 100, suffix: '%', label: 'Fruta peruana' },
  { icon: Users, value: 4500, suffix: '+', label: 'Clientes al mes' },
]

function useCountUp(target, duration = 1400) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let start
    let frame
    const step = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      setValue(Math.floor(progress * target))
      if (progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])
  return value
}

function StatCounter({ stat }) {
  const value = useCountUp(stat.value)
  const Icon = stat.icon
  return (
    <div className="flex flex-col items-center text-center gap-2">
      <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-lucuma">
        <Icon size={26} />
      </div>
      <span className="font-display font-extrabold text-3xl md:text-4xl text-cream">
        {value.toLocaleString('es-PE')}{stat.suffix}
      </span>
      <span className="text-cream/70 text-sm">{stat.label}</span>
    </div>
  )
}

export default function Home() {
  const [copied, setCopied] = useState(false)

  const copyCode = () => {
    navigator.clipboard?.writeText(promoCode.codigo)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <>
      {/* HERO: viaje espacial 3D controlado por scroll */}
      <JourneyWrapper />
      <ScoopDivider />

      {/* VARIEDADES */}
      <section id="variedades" className="bg-cream py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <span className="text-adobe font-semibold text-sm uppercase tracking-wider">Nuestras variedades</span>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ink mt-2 mb-10 text-balance">
              Sabores con identidad peruana
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CÓDIGO PROMOCIONAL */}
      <section className="bg-cream-deep py-20">
        <div className="mx-auto max-w-5xl px-5 grid md:grid-cols-2 gap-10 items-center">
          <Reveal>
            <span className="text-adobe font-semibold text-sm uppercase tracking-wider">Promoción activa</span>
            <h2 className="font-display font-extrabold text-3xl text-ink mt-2 mb-4 text-balance">
              Canjea tu código en cualquier sede
            </h2>
            <ol className="space-y-3 text-ink/75 text-sm">
              <li><strong className="text-ink">1. Copia el código</strong> y muéstralo en tienda o compártelo al pedir.</li>
              <li><strong className="text-ink">2. Pide por WhatsApp, llamada o el formulario de contacto.</strong></li>
              <li><strong className="text-ink">3. Validamos el código</strong> y aplicamos el descuento al confirmar tu pedido.</li>
            </ol>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="bg-ink rounded-3xl p-8 text-center">
              <p className="text-cream/60 text-xs uppercase tracking-widest mb-3">Tu código</p>
              <p className="font-display font-extrabold text-4xl text-lucuma mb-5 tracking-wider">
                {promoCode.codigo}
              </p>
              <button
                onClick={copyCode}
                className="focus-ring inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-lucuma text-ink font-semibold text-sm hover:bg-cream transition-colors"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copiado' : 'Copiar código'}
              </button>
              <p className="text-cream/60 text-xs mt-4">{promoCode.descripcion}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-ink py-16">
        <div className="mx-auto max-w-5xl px-5 grid grid-cols-1 sm:grid-cols-3 gap-10">
          {stats.map((s) => (
            <StatCounter key={s.label} stat={s} />
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-mora py-16">
        <Reveal className="mx-auto max-w-3xl px-5 text-center">
          <MapPin className="mx-auto text-lucuma mb-3" size={32} />
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-cream mb-3 text-balance">
            ¿Listo para visitarnos?
          </h2>
          <p className="text-cream/80 mb-6">Encuentra la sede más cercana y descubre el sabor del Perú.</p>
          <a
            href="/tiendas"
            className="focus-ring inline-block px-7 py-3 rounded-full bg-lucuma text-ink font-semibold hover:bg-cream transition-colors"
          >
            Ver nuestras sedes
          </a>
        </Reveal>
      </section>
    </>
  )
}
