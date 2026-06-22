import { Component, Suspense, lazy } from 'react'

const Journey3D = lazy(() => import('./Journey3D'))

/**
 * Hero estático de respaldo: SOLO se usa si la escena 3D no pudo cargar de
 * verdad (sin soporte de WebGL, o un error real al iniciar Three.js).
 * Nunca se usa solo por la preferencia de "reducir movimiento" del sistema:
 * incluso así, esta página debe verse viva. Por eso conserva una animación
 * 100% CSS (sin dependencias de JS) que jamás puede fallar.
 */
function StaticHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-mora via-mora-deep to-ink pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="relative mx-auto max-w-6xl px-5 grid md:grid-cols-2 gap-12 items-center">
        <div className="static-hero-fade" style={{ animationDelay: '0ms' }}>
          <span className="inline-block rounded-full bg-lucuma text-ink text-xs font-bold uppercase tracking-wider px-4 py-1.5 mb-5">
            100% fruta peruana
          </span>
          <h1 className="font-display font-extrabold text-4xl md:text-6xl text-cream leading-[1.05] text-balance mb-5">
            La mejor fruta exótica peruana, hecha helado
          </h1>
          <p className="text-cream/80 text-lg max-w-md mb-8">
            Helados y postres artesanales con mora, lúcuma y frutas amazónicas,
            directo de productores del Perú a tu cuchara.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#variedades"
              className="focus-ring px-6 py-3 rounded-full bg-lucuma text-ink font-semibold hover:bg-cream transition-colors"
            >
              Ver variedades
            </a>
            <a
              href="/tiendas"
              className="focus-ring px-6 py-3 rounded-full border border-cream/40 text-cream font-semibold hover:bg-cream/10 transition-colors"
            >
              Encuentra tu sede
            </a>
          </div>
        </div>

        <svg
          viewBox="0 0 280 320"
          className="static-hero-spin w-64 md:w-80 mx-auto drop-shadow-2xl"
          aria-hidden="true"
        >
          <ellipse cx="140" cy="120" rx="95" ry="90" fill="#F2B632" />
          <ellipse cx="100" cy="95" rx="70" ry="66" fill="#8A3A78" />
          <ellipse cx="170" cy="80" rx="50" ry="46" fill="#CF6A32" />
          <path d="M95 175 L140 300 L185 175 Z" fill="#E8C792" />
          <path d="M95 175 L185 175 L178 200 L102 200 Z" fill="#D9B274" />
          <path d="M102 200 L178 200 L171 222 L109 222 Z" fill="#CBA362" />
        </svg>
      </div>
    </section>
  )
}

class WebglErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    // eslint-disable-next-line no-console
    console.warn('No se pudo iniciar el viaje 3D, usando el hero estático de respaldo.', error)
  }

  render() {
    return this.state.hasError ? <StaticHero /> : this.props.children
  }
}

export default function JourneyWrapper() {
  return (
    <WebglErrorBoundary>
      <Suspense fallback={<StaticHero />}>
        <Journey3D />
      </Suspense>
    </WebglErrorBoundary>
  )
}
