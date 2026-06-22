import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll, ContactShadows, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { COLORS } from './iceCreamParts'
import { FlavorMedallion, CenterPhoto } from './FlavorMedallion'

// Fotografías reales con licencia libre (Unsplash License — uso comercial
// gratuito, sin atribución requerida). Recortadas a 1:1 vía parámetros de
// la propia URL para que el círculo no las muestre distorsionadas.
const FLAVOR_PHOTOS = {
  // Foto protagonista del centro: varios sabores reales juntos.
  surtido: 'https://images.unsplash.com/photo-1724805053604-4f189fb90dff?w=700&h=700&fit=crop&q=80',
  // Las 4 que orbitan alrededor.
  fresa: 'https://images.unsplash.com/photo-1560536914-b1dc488c1552?w=480&h=480&fit=crop&q=80',
  mango: 'https://images.unsplash.com/photo-1625667893125-ca3b9492946c?w=480&h=480&fit=crop&q=80',
  chocolate: 'https://images.unsplash.com/photo-1562790879-dfde82829db0?w=480&h=480&fit=crop&q=80',
  mora: 'https://images.unsplash.com/photo-1684135347630-82c37ed5c7b8?w=480&h=480&fit=crop&q=80',
}

/** Interpolación lineal por tramos entre N keyframes ordenados por `at` (0..1). */
function lerpFrames(t, frames) {
  if (t <= frames[0].at) return frames[0].v
  for (let i = 0; i < frames.length - 1; i++) {
    const a = frames[i]
    const b = frames[i + 1]
    if (t <= b.at) {
      const localT = (t - a.at) / (b.at - a.at)
      return a.v.map((av, idx) => av + (b.v[idx] - av) * localT)
    }
  }
  return frames[frames.length - 1].v
}

const CAMERA_FRAMES = [
  { at: 0, v: [0, 0.3, 5.4] },
  { at: 0.5, v: [0.9, 0.5, 4.8] },
  { at: 1, v: [0.4, 0.2, 4.2] },
]

const ICECREAM_POS_FRAMES = [
  { at: 0, v: [1.1, -0.35, 0] },
  { at: 0.4, v: [0.75, -0.15, -0.7] },
  { at: 1, v: [0.55, -0.3, -1.3] },
]
const ICECREAM_SCALE_FRAMES = [
  { at: 0, v: [1] },
  { at: 0.4, v: [0.68] },
  { at: 1, v: [0.55] },
]

const ISLAND_DEFS = [
  { color: COLORS.mora, target: [1.3, 0.75, -0.95], label: 'Mora andina' },
  { color: COLORS.lucuma, target: [1.5, -0.05, -1.15], label: 'Lúcuma' },
  { color: COLORS.adobe, target: [1.2, -0.85, -0.95], label: 'Maracuyá' },
]

function smoothstep(edge0, edge1, x) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

/** Cámara y elementos de la escena, todos coreografiados por el progreso del scroll. */
function JourneyRig() {
  const scroll = useScroll()
  const { camera } = useThree()
  const iceCreamRef = useRef(null)
  const islandsRef = useRef([])
  const promoRef = useRef(null)
  const promoLabelOpacity = useRef(0)

  useFrame((_, delta) => {
    const t = scroll.offset

    // Cámara: viaja entre los 3 actos como un dolly continuo
    const camPos = lerpFrames(t, CAMERA_FRAMES)
    camera.position.lerp(new THREE.Vector3(...camPos), Math.min(1, delta * 4))
    camera.lookAt(0.4, 0.1, 0)

    // La foto central se aleja suavemente hacia el fondo, sin desaparecer
    if (iceCreamRef.current) {
      const pos = lerpFrames(t, ICECREAM_POS_FRAMES)
      const scale = lerpFrames(t, ICECREAM_SCALE_FRAMES)[0]
      iceCreamRef.current.position.lerp(new THREE.Vector3(...pos), Math.min(1, delta * 4))
      iceCreamRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), Math.min(1, delta * 4))
    }

    // Las "islas" de fruta aparecen durante el Acto 2 (Variedades)
    const islandsIn = smoothstep(0.22, 0.42, t) * (1 - smoothstep(0.62, 0.82, t))
    const islandsScale = 0.04 + islandsIn * 0.5
    islandsRef.current.forEach((ref, i) => {
      if (!ref) return
      const def = ISLAND_DEFS[i]
      ref.scale.setScalar(THREE.MathUtils.damp(ref.scale.x, islandsScale, 4, delta))
      ref.position.lerp(new THREE.Vector3(...def.target), Math.min(1, delta * 4))
    })

    // El disco promocional aparece durante el Acto 3
    const promoIn = smoothstep(0.68, 0.88, t)
    if (promoRef.current) {
      promoRef.current.scale.setScalar(THREE.MathUtils.damp(promoRef.current.scale.x, 0.04 + promoIn * 0.42, 4, delta))
      promoRef.current.rotation.y += delta * 0.5
    }
    promoLabelOpacity.current = promoIn
  })

  return (
    <>
      <ambientLight intensity={0.6} color="#fbe9ff" />
      <directionalLight position={[3, 5, 4]} intensity={1.7} color="#fff3e0" />
      <pointLight position={[-4, 1.2, -2]} intensity={7} color={COLORS.adobe} distance={12} />
      <pointLight position={[3, -1.5, 2.5]} intensity={5} color={COLORS.mora} distance={10} />

      {/* Foto real protagonista (reemplaza al helado ilustrado) */}
      <group ref={iceCreamRef} scale={0.01}>
        <CenterPhoto imageUrl={FLAVOR_PHOTOS.surtido} size={0.85} ringColor={COLORS.lucuma} />
      </group>

      {/* 4 fotos reales de otros sabores, orbitando alrededor */}
      <FlavorMedallion
        imageUrl={FLAVOR_PHOTOS.fresa}
        radius={2.15}
        height={0.85}
        speed={0.28}
        phase={0.6}
        size={0.4}
        ringColor={COLORS.mora}
      />
      <FlavorMedallion
        imageUrl={FLAVOR_PHOTOS.mango}
        radius={2.05}
        height={-0.55}
        speed={0.32}
        phase={3.4}
        size={0.36}
        ringColor={COLORS.lucuma}
      />
      <FlavorMedallion
        imageUrl={FLAVOR_PHOTOS.chocolate}
        radius={1.95}
        height={0.15}
        speed={0.36}
        phase={1.8}
        size={0.34}
        ringColor={COLORS.adobe}
      />
      <FlavorMedallion
        imageUrl={FLAVOR_PHOTOS.mora}
        radius={2.25}
        height={-0.05}
        speed={0.24}
        phase={5.0}
        size={0.38}
        ringColor={COLORS.mora}
      />

      {ISLAND_DEFS.map((def, i) => (
        <mesh
          key={def.label}
          ref={(el) => (islandsRef.current[i] = el)}
          position={[0, -3, 0]}
          scale={0.01}
        >
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshPhysicalMaterial color={def.color} roughness={0.2} clearcoat={1} sheenColor={COLORS.cream} sheen={1} />
        </mesh>
      ))}

      <group ref={promoRef} position={[1.35, 0.3, -0.6]} scale={0.01}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.62, 0.62, 0.1, 48]} />
          <meshPhysicalMaterial color={COLORS.lucuma} roughness={0.2} clearcoat={1} metalness={0.15} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <torusGeometry args={[0.62, 0.045, 16, 48]} />
          <meshStandardMaterial color={COLORS.adobe} roughness={0.4} />
        </mesh>
      </group>

      <Sparkles count={28} scale={4.6} size={2.4} speed={0.3} color={COLORS.lucuma} />

      <ContactShadows position={[0, -1.95, 0]} opacity={0.4} scale={7} blur={2.6} far={3} color="#1c1714" />
    </>
  )
}

export default function JourneyScene3D() {
  return <JourneyRig />
}
