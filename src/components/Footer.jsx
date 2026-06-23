import { Instagram, MessageCircle, Music2, MapPin, Clock, Phone, BookOpen } from 'lucide-react'
import { stores, socials } from '../data/mockData'

const iconMap = { instagram: Instagram, 'message-circle': MessageCircle, 'music-2': Music2 }

export default function Footer() {
  const main = stores.find((s) => s.principal)

  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto max-w-6xl px-5 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <h3 className="font-display font-bold text-lg text-lucuma mb-3">Ubícanos</h3>
          <p className="flex items-start gap-2 text-sm text-cream/80 mb-2">
            <MapPin size={18} className="shrink-0 mt-0.5 text-mora" />
            {main.direccion}
          </p>
          <p className="flex items-start gap-2 text-sm text-cream/80 mb-2">
            <Clock size={18} className="shrink-0 mt-0.5 text-mora" />
            {main.horario}
          </p>
          <p className="flex items-start gap-2 text-sm text-cream/80">
            <Phone size={18} className="shrink-0 mt-0.5 text-mora" />
            {main.telefono}
          </p>
        </div>

        <div>
          <h3 className="font-display font-bold text-lg text-lucuma mb-3">Acceso rápido</h3>
          <ul className="space-y-2 text-sm text-cream/80">
            <li><a href="/" className="hover:text-lucuma transition-colors">Inicio</a></li>
            <li><a href="/nosotros" className="hover:text-lucuma transition-colors">Nosotros</a></li>
            <li><a href="/tiendas" className="hover:text-lucuma transition-colors">Tiendas</a></li>
            <li><a href="/contacto" className="hover:text-lucuma transition-colors">Contacto</a></li>
            <li>
              <a href="#" className="flex items-center gap-2 hover:text-lucuma transition-colors">
                <BookOpen size={16} /> Libro de reclamaciones
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display font-bold text-lg text-lucuma mb-3">Mapa interactivo</h3>
          <div className="rounded-xl overflow-hidden h-36 border border-white/10">
            <iframe
              title="Mapa de la sede principal"
              className="w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=-77.0095%2C-12.0980%2C-76.9905%2C-12.0850&layer=mapnik&marker=-12.0915%2C-77.0000`}
            />
          </div>
        </div>

        <div>
          <h3 className="font-display font-bold text-lg text-lucuma mb-3">Nuestras redes</h3>
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
                  className="focus-ring w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-lucuma hover:text-ink transition-colors"
                >
                  <Icon size={18} />
                </a>
              )
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-cream/60">
        © {new Date().getFullYear()} Pakatnamú. Todos los derechos reservados. · Desarrollo web: Grupo N.° 4
      </div>
    </footer>
  )
}
