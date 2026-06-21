// Datos de muestra que reflejan la información del informe del proyecto.
// En producción estas listas se reemplazan por consultas a Supabase
// (tablas `stores`, `products`, `promo_codes`) — ver supabase/schema.sql

export const stores = [
  {
    id: 'san-borja',
    nombre: 'San Borja (Sede principal)',
    direccion: 'Av. Primavera #909, local SS01, San Borja',
    horario: 'Lunes a domingo, 8:00 a.m. – 11:00 p.m.',
    telefono: '700 1042 / 791 3550',
    principal: true,
    mapQuery: 'Av.+Primavera+909+San+Borja+Lima',
  },
  {
    id: 'san-isidro',
    nombre: 'San Isidro',
    direccion: 'Av. Las Camelias 9966, urb. Las Golondrinas',
    horario: 'Lun – Vie 8:00 a.m. – 11:00 p.m. · Sáb, Dom y feriados 8:00 a.m. – 9:00 p.m.',
    telefono: '+51 987 654 321',
    principal: false,
    mapQuery: 'Av.+Las+Camelias+9966+San+Isidro+Lima',
  },
  {
    id: 'miraflores',
    nombre: 'Miraflores',
    direccion: 'Ca. Los Eruditos de la Astronomía 2124, urb. Los Astronautas',
    horario: 'Lun – Vie 8:00 a.m. – 11:00 p.m. · Sáb, Dom y feriados 8:00 a.m. – 9:00 p.m.',
    telefono: '+51 987 654 321',
    principal: false,
    mapQuery: 'Miraflores+Lima+Peru',
  },
  {
    id: 'centro-historico',
    nombre: 'Centro Histórico',
    direccion: 'Av. Los Pensamientos Racionales 1660, urb. Alameda Púrpura',
    horario: 'Lun – Vie 8:00 a.m. – 11:00 p.m. · Sáb, Dom y feriados 8:00 a.m. – 9:00 p.m.',
    telefono: '+51 987 654 321',
    principal: false,
    mapQuery: 'Centro+Historico+Lima+Peru',
  },
]

export const products = [
  {
    id: 'mora-andina',
    nombre: 'Mora andina',
    categoria: 'Helado',
    descripcion: 'Moras silvestres del norte peruano en una base cremosa y poco dulce.',
    color: 'mora',
  },
  {
    id: 'lucuma',
    nombre: 'Lúcuma',
    categoria: 'Helado',
    descripcion: 'El sabor más peruano: lúcuma orgánica de productores locales.',
    color: 'lucuma',
  },
  {
    id: 'maracuya-amazonico',
    nombre: 'Maracuyá amazónico',
    categoria: 'Helado',
    descripcion: 'Fruta de la pasión de la selva, ácida y refrescante.',
    color: 'adobe',
  },
  {
    id: 'tres-leches',
    nombre: 'Tres leches de chirimoya',
    categoria: 'Postre',
    descripcion: 'Bizcocho húmedo bañado en tres leches con pulpa de chirimoya.',
    color: 'lucuma',
  },
  {
    id: 'suspiro-norteno',
    nombre: 'Suspiro norteño',
    categoria: 'Postre',
    descripcion: 'Nuestra versión del suspiro a la limeña con un toque de algarrobina.',
    color: 'mora',
  },
  {
    id: 'aguaymanto',
    nombre: 'Aguaymanto',
    categoria: 'Helado',
    descripcion: 'Dulce y ligeramente ácido, hecho con aguaymanto andino.',
    color: 'adobe',
  },
]

export const promoCode = {
  codigo: 'PAKAT10',
  descripcion: '10% de descuento en tu próxima visita a cualquiera de nuestras sedes.',
  vigencia: 'Válido todos los días, no acumulable con otras promociones.',
}

export const socials = [
  { nombre: 'Instagram', url: 'https://instagram.com', icon: 'instagram' },
  { nombre: 'TikTok', url: 'https://tiktok.com', icon: 'music-2' },
  { nombre: 'WhatsApp', url: 'https://wa.me/51987654321', icon: 'message-circle' },
]
