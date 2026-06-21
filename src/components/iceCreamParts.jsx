import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const COLORS = {
  mora: '#8A3A78',
  moraDeep: '#5C2553',
  lucuma: '#F2B632',
  adobe: '#CF6A32',
  cono: '#E8C792',
  conoLinea: '#C9A06B',
  selva: '#4F7942',
  cream: '#FBF3E6',
}

/** Aro de "barquillo" (waffle) tejido con pequeños cruces, sin texturas externas. */
export function WaffleCone() {
  const lattice = useMemo(() => {
    const lines = []
    const rings = 6
    const segs = 14
    for (let r = 0; r < rings; r++) {
      const t = r / (rings - 1)
      const y = -1.55 + t * 1.55
      const radius = THREE.MathUtils.lerp(0.06, 0.62, t)
      for (let s = 0; s < segs; s++) {
        const a = (s / segs) * Math.PI * 2 + (r % 2 === 0 ? 0 : Math.PI / segs)
        lines.push([Math.cos(a) * radius, y, Math.sin(a) * radius, a])
      }
    }
    return lines
  }, [])

  return (
    <group>
      <mesh position={[0, -0.78, 0]} rotation={[Math.PI, 0, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.62, 1.55, 32, 6, false]} />
        <meshStandardMaterial color={COLORS.cono} roughness={0.95} metalness={0} />
      </mesh>
      {lattice.map(([x, y, z, a], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[0, -a, Math.PI / 4]}>
          <boxGeometry args={[0.07, 0.07, 0.012]} />
          <meshStandardMaterial color={COLORS.conoLinea} roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

export function Scoop({ position, radius, color, squash = 0.82 }) {
  return (
    <mesh position={position} scale={[1, squash, 1]} castShadow receiveShadow>
      <sphereGeometry args={[radius, 48, 48]} />
      <meshPhysicalMaterial
        color={color}
        roughness={0.22}
        clearcoat={1}
        clearcoatRoughness={0.18}
        sheen={1}
        sheenColor={COLORS.cream}
      />
    </mesh>
  )
}

export function IceCreamSprinkles({ count = 26 }) {
  const sprinkles = useMemo(() => {
    const palette = [COLORS.lucuma, COLORS.cream, COLORS.moraDeep, COLORS.adobe]
    const items = []
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(THREE.MathUtils.randFloat(0.15, 0.95))
      const r = 0.54
      items.push({
        position: [
          Math.sin(phi) * Math.cos(theta) * r,
          1.18 + Math.cos(phi) * r * 0.55,
          Math.sin(phi) * Math.sin(theta) * r,
        ],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        color: palette[i % palette.length],
      })
    }
    return items
  }, [count])

  return (
    <group>
      {sprinkles.map((s, i) => (
        <mesh key={i} position={s.position} rotation={s.rotation}>
          <cylinderGeometry args={[0.018, 0.018, 0.11, 6]} />
          <meshStandardMaterial color={s.color} roughness={0.4} />
        </mesh>
      ))}
    </group>
  )
}

/** Aguaymanto (fruta dorada peruana) coronando el helado, con su pequeño cáliz. */
export function GoldenBerry() {
  return (
    <group position={[0.02, 1.62, 0.06]}>
      <mesh castShadow>
        <sphereGeometry args={[0.1, 24, 24]} />
        <meshPhysicalMaterial color={COLORS.lucuma} roughness={0.15} clearcoat={1} />
      </mesh>
      <mesh position={[0, 0.08, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.085, 0.09, 5]} />
        <meshStandardMaterial color={COLORS.selva} roughness={0.6} />
      </mesh>
    </group>
  )
}

/** El helado completo, con giro continuo sobre su propio eje (bien perceptible). */
export function IceCreamModel(props) {
  const spinRef = useRef(null)
  useFrame((_, delta) => {
    if (spinRef.current) spinRef.current.rotation.y += delta * 0.45
  })

  return (
    <group ref={spinRef} {...props}>
      <WaffleCone />
      <Scoop position={[0, 0.02, 0]} radius={0.78} color={COLORS.mora} />
      <Scoop position={[0.06, 0.58, -0.04]} radius={0.66} color={COLORS.lucuma} />
      <Scoop position={[-0.04, 1.1, 0.06]} radius={0.5} color={COLORS.adobe} />
      <IceCreamSprinkles />
      <GoldenBerry />
    </group>
  )
}

/** Pequeña fruta que orbita en círculo alrededor de un centro. */
export function OrbitingFruit({ radius, height, speed, phase, size, color }) {
  const ref = useRef(null)
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed + phase
    if (ref.current) {
      ref.current.position.set(Math.cos(t) * radius, height + Math.sin(t * 1.6) * 0.18, Math.sin(t) * radius)
    }
  })
  return (
    <mesh ref={ref} castShadow>
      <sphereGeometry args={[size, 20, 20]} />
      <meshPhysicalMaterial color={color} roughness={0.25} clearcoat={1} />
    </mesh>
  )
}
