import { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll } from '@react-three/drei'
import { ChevronDown } from 'lucide-react'
import { animate } from 'animejs'
import JourneyScene3D from './JourneyScene3D'

const ACTS = [
  { from: 0, len: 1 / 3 },
  { from: 1 / 3, len: 1 / 3 },
  { from: 2 / 3, len: 1 / 3 },
]

function smoothstep(edge0, edge1, x) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

/** Panel HTML de un acto: se desliza y se desvanece según el progreso del scroll. */
function Act({ index, children }) {
  const ref = useRef(null)
  const headlineRef = useRef(null)
  const scroll = useScroll()
  const { from, len } = ACTS[index]
  const isFirst = index === 0
  const isLast = index === ACTS.length - 1
  const margin = len * 0.22

  // Entrada dramática al cargar la página (solo el primer acto, que es lo
  // primero que ve el usuario sin necesidad de hacer scroll).
  useEffect(() => {
    if (!isFirst || !ref.current) return
    const root = ref.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const card = root.querySelector('.hero-card')
    const badge = root.querySelector('.hero-badge')
    const title = headlineRef.current
    const paragraph = root.querySelector('.hero-text')
    const ctas = root.querySelector('.hero-ctas')

    if (reduced) return

    if (card) card.style.opacity = '0'
    if (badge) badge.style.opacity = '0'
    if (title) title.style.opacity = '0'
    if (paragraph) paragraph.style.opacity = '0'
    if (ctas) ctas.style.opacity = '0'

    if (card) animate(card, { opacity: [0, 1], scale: [0.94, 1], duration: 700, delay: 0 })
    if (badge) animate(badge, { opacity: [0, 1], translateY: [16, 0], duration: 450, delay: 150 })
    if (title) animate(title, { opacity: [0, 1], translateY: [22, 0], duration: 650, delay: 320 })
    if (paragraph) animate(paragraph, { opacity: [0, 1], translateY: [16, 0], duration: 500, delay: 720 })
    if (ctas) animate(ctas, { opacity: [0, 1], translateY: [16, 0], duration: 500, delay: 860 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFirst])

  useEffect(() => {
    if (ref.current) ref.current.style.opacity = isFirst ? '1' : '0'
    let raf
    const tick = () => {
      const t = scroll.offset
      let opacity = 1
      if (!isFirst) opacity *= smoothstep(from - margin, from + margin, t)
      if (!isLast) opacity *= 1 - smoothstep(from + len - margin, from + len + margin, t)
      if (ref.current) {
        ref.current.style.opacity = opacity.toFixed(3)
        ref.current.style.transform = `translateY(${(1 - opacity) * 22}px)`
        ref.current.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none'
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={ref}
      className="absolute left-0 w-full h-screen flex items-center pt-16 md:pt-20"
      style={{ top: `${index * 100}vh` }}
    >
      <div className="mx-auto max-w-6xl w-full px-5">
        {typeof children === 'function' ? children(headlineRef) : children}
      </div>
      {isFirst && <ScrollHint />}
    </div>
  )
}

function ScrollHint() {
  const ref = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    animate(ref.current, {
      translateY: [0, 8, 0],
      loop: true,
      duration: 1400,
      ease: 'inOutSine',
    })
  }, [])

  return (
    <div
      ref={ref}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-cream/70 text-xs uppercase tracking-wider"
    >
      Desliza para explorar
      <ChevronDown size={18} />
    </div>
  )
}

export default function Journey3D() {
  return (
    <div
      className="relative bg-gradient-to-br from-mora via-mora-deep to-ink animate-gradient-shift"
      style={{ height: '100vh' }}
    >
      <Canvas dpr={[1, 2]} gl={{ alpha: true, antialias: true }} camera={{ position: [0, 0.3, 5.4], fov: 32 }}>
        <ScrollControls pages={3} damping={0.25}>
          <JourneyScene3D />
          <Scroll html style={{ width: '100%' }}>
            <Act index={0}>
              {(headlineRef) => (
                <div className="hero-card max-w-md bg-ink/55 backdrop-blur-md rounded-3xl p-7 md:p-8 border border-cream/10 shadow-2xl">
                  <span className="hero-badge inline-block rounded-full bg-lucuma text-ink text-xs font-bold uppercase tracking-wider px-4 py-1.5 mb-5">
                    100% fruta peruana
                  </span>
                  <h1
                    ref={headlineRef}
                    className="font-display font-extrabold text-4xl md:text-6xl text-cream leading-[1.05] text-balance mb-5"
                    style={{ overflow: 'visible' }}
                  >
                    La mejor fruta exótica peruana, hecha helado
                  </h1>
                  <p className="hero-text text-cream/80 text-lg mb-8">
                    Helados y postres artesanales con mora, lúcuma y frutas amazónicas,
                    directo de productores del Perú a tu cuchara.
                  </p>
                  <div className="hero-ctas flex flex-wrap gap-3">
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
              )}
            </Act>

            <Act index={1}>
              <div className="max-w-md bg-ink/55 backdrop-blur-md rounded-3xl p-7 md:p-8 border border-cream/10 shadow-2xl">
                <span className="text-lucuma font-semibold text-sm uppercase tracking-wider">Nuestras variedades</span>
                <h2 className="font-display font-extrabold text-3xl md:text-5xl text-cream mt-2 mb-5 text-balance">
                  Sabores con identidad peruana
                </h2>
                <p className="text-cream/80 text-lg">
                  Mora andina, lúcuma y maracuyá amazónico — tres mundos de sabor que
                  flotan a tu alrededor, todos elaborados con fruta peruana real.
                </p>
              </div>
            </Act>

            <Act index={2}>
              <div className="max-w-md bg-ink/55 backdrop-blur-md rounded-3xl p-7 md:p-8 border border-cream/10 shadow-2xl">
                <span className="text-lucuma font-semibold text-sm uppercase tracking-wider">Promoción activa</span>
                <h2 className="font-display font-extrabold text-3xl md:text-5xl text-cream mt-2 mb-5 text-balance">
                  Canjea tu código en cualquier sede
                </h2>
                <div className="inline-flex items-center gap-3 rounded-2xl bg-ink/60 border border-cream/20 px-5 py-3 mb-5">
                  <span className="font-display font-extrabold text-2xl text-lucuma tracking-wider">PAKAT10</span>
                  <span className="text-cream/70 text-sm">10% de descuento</span>
                </div>
                <p className="text-cream/80">
                  Muéstralo al pedir por WhatsApp, llamada o el formulario de contacto.
                </p>
              </div>
            </Act>
          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  )
}
