# Pakatnamú · Plataforma web

Sitio web informativo para la heladería y venta de postres **Pakatnamú**,
desarrollado con **React + Vite + Tailwind CSS v4 + Framer Motion + anime.js
+ Three.js (React Three Fiber)**, listo para conectarse a **Supabase
(PostgreSQL)** como backend.

El hero de Inicio incluye una **escena 3D real** (no una imagen ni un video):
un helado armado con geometrías de Three.js que gira, flota y tiene frutas
orbitando alrededor, con iluminación de tres puntos estilo fotografía de
producto. Si el navegador no soporta WebGL, se muestra automáticamente una
ilustración plana de respaldo (ver `src/components/HeroScene.jsx`).

## 1. Requisitos

- Node.js 18 o superior
- Una cuenta gratuita en [supabase.com](https://supabase.com)

## 2. Instalación local

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

## 3. Conectar Supabase (PostgreSQL)

1. Crea un proyecto nuevo en [supabase.com](https://supabase.com).
2. Ve a **SQL Editor** → pega y ejecuta el archivo [`supabase/schema.sql`](./supabase/schema.sql).
   Esto crea las tablas `stores`, `products`, `promo_codes`, `contact_messages`
   y `profiles`, con seguridad a nivel de fila (RLS) ya configurada.
3. Ve a **Project Settings → API** y copia:
   - `Project URL`
   - `anon public` key
4. Copia `.env.example` como `.env` en la raíz del proyecto y completa esos
   dos valores:
   ```
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key-publica
   ```
5. Reinicia `npm run dev`. Mientras `.env` no exista, la web sigue
   funcionando con datos de muestra (`src/data/mockData.js`) y el login,
   registro y formulario de contacto quedan en modo demo (no se guarda nada).

### ¿Qué falta conectar a Supabase en el código?

Ya está conectado y listo para usar en cuanto configures `.env`:

- **`src/components/AuthModal.jsx`** → `supabase.auth.signInWithPassword` /
  `supabase.auth.signUp` (Ingresar / Registrarse).
- **`src/components/ContactForm.jsx`** → inserta en la tabla
  `contact_messages`.

Pendiente de migrar cuando quieras (hoy usan `src/data/mockData.js`):

- Listado de **sedes** (`src/pages/Tiendas.jsx`) → tabla `stores`.
- Listado de **variedades** (`src/pages/Home.jsx`) → tabla `products`.
- **Código promocional** (`src/pages/Home.jsx`) → tabla `promo_codes`.

## 4. Estructura del proyecto

```
src/
  components/
    HeroAnime.jsx     Texto del hero animado con anime.js (insignia, título, párrafo, botones)
    HeroScene.jsx      Carga diferida + manejo de errores de la escena 3D
    IceCream3D.jsx     Escena 3D (Three.js / React Three Fiber): helado, sprinkles,
                       aguaymanto dorado, frutas orbitando, luces y sombra de contacto
    Navbar, Footer, AuthModal, ContactForm, ProductCard, StoreCard, Reveal...
  pages/        Home, Nosotros, Tiendas, Contacto
  data/         Datos de muestra (mockData.js)
  lib/          Cliente de Supabase
supabase/
  schema.sql    Esquema completo de base de datos (tablas + RLS + datos demo)
```

## 5. Fotografías reales en la escena 3D (FlavorMedallion.jsx)

El centro de la escena ahora es una **fotografía real** (no un helado
ilustrado): un disco circular con la foto, que flota suavemente y gira
despacio sobre su propio eje como una moneda, siempre de frente a la
cámara. Alrededor orbitan **4 fotos más** de otros sabores, también reales,
también siempre de frente a la cámara (billboard) para que ninguna se vea
estirada al girar — a diferencia de "envolver" una foto sobre una esfera.

- Las 5 fotos son de **Unsplash**, bajo la
  [Unsplash License](https://unsplash.com/license) (uso comercial gratuito,
  sin atribución requerida):
  - Centro — varios sabores juntos: foto de carlos lugo.
  - Fresa: foto de Kim Daniels.
  - Mango: foto de Chumil Photo.
  - Chocolate: foto de Irene Kredenets.
  - Mora/arándano: foto de Elena Leya.
- La carga es manual y a prueba de fallos: si una imagen no carga (sin
  internet, CDN caído, bloqueador de anuncios), ese elemento simplemente
  muestra su aro de color de marca en vez de la foto — nunca rompe ni
  congela el resto de la escena 3D.

### Cómo usar tus propias fotos reales del producto

Lo ideal es reemplazar estas fotos de stock por fotografías reales de tus
helados Pakatnamú:

1. Sube tus fotos a `public/flavors/` (ej. `surtido.jpg`, `mora.jpg`).
2. En `src/components/JourneyScene3D.jsx`, cambia las URLs en
   `FLAVOR_PHOTOS` por las rutas locales, por ejemplo:
   ```js
   const FLAVOR_PHOTOS = {
     surtido: '/flavors/surtido.jpg',
     fresa: '/flavors/mora.jpg',
     mango: '/flavors/lucuma.jpg',
     chocolate: '/flavors/chocolate.jpg',
     mora: '/flavors/maracuya.jpg',
   }
   ```
3. Para mejores resultados, usa fotos ya recortadas en cuadrado (1:1) y de
   buena resolución (la del centro al menos 700×700px, las demás 480×480px)
   — esto evita que el círculo recorte mal la imagen.

Puedes agregar más medallones orbitando copiando el bloque
`<FlavorMedallion ... />` en `JourneyScene3D.jsx` con nuevas coordenadas de
`radius`, `height`, `phase` para distribuirlos alrededor de la foto central.

## 6. Sobre el "viaje espacial" 3D (Journey3D.jsx)

El hero de Inicio es una experiencia de scroll cinematográfica inspirada en
los sitios "spatial scrolly-telling" (cámara 3D que recorre una escena
mientras el usuario hace scroll, con texto que se desliza y se desvanece
en sincronía). Construida con `@react-three/drei`'s `ScrollControls`:

- **3 actos**, cada uno ocupa 100vh de scroll *interno* (el componente mide
  100vh en pantalla; al agotar su scroll interno, el scroll normal de la
  página continúa con total naturalidad — "scroll chaining"):
  1. **Hero** — el helado centrado, título y CTAs.
  2. **Variedades** — la cámara avanza, el helado se aleja y 3 "islas" de
     fruta (mora, lúcuma, maracuyá) aparecen flotando.
  3. **Promoción** — aparece una medalla/disco dorado giratorio con el
     código `PAKAT10`.
- La cámara, el helado, las islas y el disco se mueven de forma continua
  según el progreso del scroll (`useScroll().offset`, 0 a 1) — no son
  3 escenas fijas sino una interpolación suave entre keyframes
  (`JourneyScene3D.jsx`).
- El texto de cada acto vive en una capa HTML (`<Scroll html>`) con un
  panel "glass" (fondo semitransparente + blur) para que siempre sea
  legible sobre la escena 3D, con fundido de entrada/salida sincronizado
  al scroll.
- **Accesibilidad y robustez**: si el usuario tiene activado "reducir
  movimiento" en su sistema, se muestra un hero estático normal (sin
  Three.js ni scroll-jacking). Si WebGL falla por cualquier razón, un
  `ErrorBoundary` también recurre al mismo hero estático — el sitio nunca
  se rompe (`JourneyWrapper.jsx`).
- Las piezas del helado 3D (capas, sprinkles, aguaymanto, fruta orbitando)
  están en `iceCreamParts.jsx`, reutilizables.

Para ajustar el recorrido (posiciones de cámara, tamaños, velocidad),
edita las constantes `CAMERA_FRAMES`, `ICECREAM_POS_FRAMES` e
`ISLAND_DEFS` al inicio de `JourneyScene3D.jsx`.

## 7. Build de producción

```bash
npm run build
```

Genera la carpeta `dist/` lista para subir a cualquier hosting estático.

## 8. Desplegar en un dominio propio

### Opción recomendada: Vercel

1. Sube este proyecto a un repositorio de GitHub.
2. En [vercel.com](https://vercel.com) → **New Project** → importa el repo.
3. Framework preset: **Vite** (se detecta solo).
4. En **Environment Variables** agrega `VITE_SUPABASE_URL` y
   `VITE_SUPABASE_ANON_KEY`.
5. Deploy.
6. **Project → Settings → Domains** → agrega tu dominio y configura los
   registros DNS que Vercel indique en el panel de tu proveedor de dominio.

### Alternativa: Netlify

Mismo flujo: importar repo → build command `npm run build` → publish
directory `dist` → variables de entorno → dominio personalizado en
**Domain settings**.

### Seguridad en producción

- La `anon public key` de Supabase es segura para el frontend: el acceso
  real está controlado por las políticas RLS definidas en `schema.sql`.
- Nunca expongas la `service_role key` en el frontend.

## 9. Alcance del proyecto (según el informe EFSRT V)

Dentro del alcance: página principal, secciones institucionales, productos
y promociones informativos, ubicación de sedes con mapa, formulario de
contacto e ingreso/registro de usuarios.

Fuera del alcance (no implementado, por diseño): pasarela de pagos en
línea, gestión de inventario, ventas en tiempo real y apps móviles nativas.
Los códigos promocionales se muestran en la web y se canjean por WhatsApp,
llamada o el formulario de contacto — la heladería valida y confirma el
descuento manualmente.
