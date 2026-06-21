import { motion } from 'framer-motion'
import Reveal from '../components/Reveal'

const blocks = [
  {
    titulo: '¿Quiénes somos?',
    texto:
      'En Pakatnamú creemos en el poder de los productos naturales y orgánicos peruanos para crear una experiencia de sabor que conecta con nuestras raíces. Somos una cadena de heladerías y venta de postres, con sede en Lima, que fusiona el amor por la tradición peruana con un compromiso firme hacia el desarrollo social y ambiental de nuestras comunidades.',
    extra:
      'Más que una heladería, Pakatnamú es una marca que celebra la diversidad de ingredientes peruanos, trabajando directamente con agricultores y pequeños productores locales. En cada bocado, queremos que sientas el sabor de la autenticidad, la creatividad y el respeto por nuestras comunidades y el medio ambiente.',
    bg: 'bg-cream',
    text: 'text-ink',
  },
  {
    titulo: 'Misión',
    texto:
      'Ofrecer helados y postres peruanos que destaquen por su sabor y calidad, elaborados con ingredientes locales y orgánicos, respetando la cultura y el esfuerzo de nuestros productores.',
    extra:
      'Nuestro compromiso va más allá de lo que servimos: buscamos fomentar el bienestar de las comunidades agrícolas peruanas, brindándoles apoyo para que sus prácticas sostenibles sean reconocidas y valoradas.',
    bg: 'bg-mora',
    text: 'text-cream',
  },
  {
    titulo: 'Visión',
    texto:
      'Ser un referente de calidad y responsabilidad en el mercado de helados y postres en el Perú, conocidos no solo por nuestro compromiso con el sabor auténtico, sino también por la huella positiva que dejamos en cada comunidad agrícola con la que trabajamos.',
    extra:
      'Liderar una industria que valore el desarrollo local y las prácticas sostenibles, resaltando siempre la identidad cultural peruana en cada producto y experiencia que ofrecemos.',
    bg: 'bg-cream',
    text: 'text-ink',
  },
  {
    titulo: 'Nuestro compromiso con la comunidad',
    texto:
      'Asumimos un compromiso profundo con el desarrollo socioeconómico y ambiental del Perú. Una parte significativa de nuestras ganancias regresa a estas comunidades, promoviendo prácticas de cultivo orgánicas y generando oportunidades de crecimiento para pequeños agricultores y sus familias.',
    extra:
      'Cada vez que eliges Pakatnamú, estás apoyando una cadena de impacto positivo que preserva nuestra biodiversidad y fomenta un Perú más justo y sostenible.',
    bg: 'bg-adobe',
    text: 'text-cream',
  },
]

export default function Nosotros() {
  return (
    <div className="pt-16 md:pt-20">
      <section className="bg-ink py-16">
        <Reveal className="mx-auto max-w-3xl px-5 text-center">
          <span className="text-lucuma font-semibold text-sm uppercase tracking-wider">Sobre Pakatnamú</span>
          <h1 className="font-display font-extrabold text-3xl md:text-5xl text-cream mt-2 text-balance">
            Identidad, tradición y sabor peruano
          </h1>
        </Reveal>
      </section>

      {blocks.map((b, i) => (
        <section key={b.titulo} className={`${b.bg} py-16 md:py-20`}>
          <div className="mx-auto max-w-4xl px-5">
            <Reveal y={20}>
              <div className={`flex items-center gap-4 mb-5`}>
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                  className={`w-2.5 h-10 rounded-full ${i % 2 === 0 ? 'bg-mora' : 'bg-lucuma'}`}
                  aria-hidden="true"
                />
                <h2 className={`font-display font-extrabold text-2xl md:text-3xl ${b.text}`}>{b.titulo}</h2>
              </div>
              <p className={`${b.text} ${b.text === 'text-cream' ? 'opacity-90' : 'opacity-80'} leading-relaxed mb-3`}>
                {b.texto}
              </p>
              <p className={`${b.text} ${b.text === 'text-cream' ? 'opacity-80' : 'opacity-70'} leading-relaxed`}>
                {b.extra}
              </p>
            </Reveal>
          </div>
        </section>
      ))}
    </div>
  )
}
