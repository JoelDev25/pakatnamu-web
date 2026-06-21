import { Phone, Mail, BookOpen, Instagram, MessageCircle, Music2 } from 'lucide-react'
import Reveal from '../components/Reveal'
import ContactForm from '../components/ContactForm'
import { stores, socials } from '../data/mockData'

const iconMap = { instagram: Instagram, 'message-circle': MessageCircle, 'music-2': Music2 }

export default function Contacto() {
  const main = stores.find((s) => s.principal)

  return (
    <div className="pt-16 md:pt-20">
      <section className="bg-ink py-16">
        <Reveal className="mx-auto max-w-3xl px-5 text-center">
          <span className="text-lucuma font-semibold text-sm uppercase tracking-wider">Contacto</span>
          <h1 className="font-display font-extrabold text-3xl md:text-5xl text-cream mt-2 text-balance">
            Escríbenos, te leemos
          </h1>
        </Reveal>
      </section>

      <section className="bg-cream py-16">
        <div className="mx-auto max-w-5xl px-5 grid md:grid-cols-[1.2fr_1fr] gap-10">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="bg-white rounded-3xl p-7 shadow-sm border border-black/5 space-y-6">
              <div>
                <h3 className="font-display font-bold text-lg text-ink mb-3">Sede principal</h3>
                <p className="text-sm text-ink/70 mb-1">{main.direccion}</p>
                <p className="text-sm text-ink/70">{main.horario}</p>
              </div>

              <div>
                <p className="flex items-center gap-2 text-sm text-ink/70 mb-2">
                  <Phone size={16} className="text-mora" /> {main.telefono}
                </p>
                <p className="flex items-center gap-2 text-sm text-ink/70">
                  <Mail size={16} className="text-mora" /> contacto@pakatnamu.pe
                </p>
              </div>

              <a href="#" className="flex items-center gap-2 text-sm font-semibold text-adobe hover:underline">
                <BookOpen size={16} /> Libro de reclamaciones
              </a>

              <div>
                <p className="text-sm font-semibold text-ink mb-2">Síguenos</p>
                <div className="flex gap-3">
                  {socials.map((s) => {
                    const Icon = iconMap[s.icon]
                    return (
                      <a
                        key={s.nombre}
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={s.nombre}
                        className="focus-ring w-10 h-10 rounded-full bg-cream-deep flex items-center justify-center text-ink hover:bg-mora hover:text-cream transition-colors"
                      >
                        <Icon size={18} />
                      </a>
                    )
                  })}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
