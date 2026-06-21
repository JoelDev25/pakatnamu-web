import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/** Carga manual y segura de una textura: si falla, devuelve null sin romper nada. */
function useSafeTexture(imageUrl) {
  const [texture, setTexture] = useState(null)

  useEffect(() => {
    let cancelled = false
    const loader = new THREE.TextureLoader()
    loader.load(
      imageUrl,
      (tex) => {
        if (cancelled) return
        tex.colorSpace = THREE.SRGBColorSpace
        setTexture(tex)
      },
      undefined,
      () => {
        if (!cancelled) setTexture(null)
      },
    )
    return () => {
      cancelled = true
    }
  }, [imageUrl])

  return texture
}

/**
 * Medallón circular con una fotografía real de helado (con licencia libre,
 * Unsplash License — uso comercial gratuito, sin atribución requerida).
 * Orbita alrededor de un centro y siempre se mantiene de frente a la
 * cámara ("billboard"), por eso la foto nunca se ve estirada ni
 * deformada al girar — a diferencia de envolver una foto sobre una esfera.
 *
 * La carga de la textura es manual (no usa Suspense) a propósito: si la
 * imagen no carga por cualquier motivo (sin internet, CDN caído, bloqueador
 * de anuncios), el medallón simplemente muestra su aro de color de marca
 * en vez de la foto — nunca interrumpe ni rompe el resto de la escena 3D.
 */
export function FlavorMedallion({
  imageUrl,
  radius = 1.9,
  height = 0.4,
  speed = 0.4,
  phase = 0,
  size = 0.34,
  ringColor = '#F2B632',
}) {
  const groupRef = useRef(null)
  const texture = useSafeTexture(imageUrl)

  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime * speed + phase
    if (groupRef.current) {
      groupRef.current.position.set(
        Math.cos(t) * radius,
        height + Math.sin(t * 1.4) * 0.16,
        Math.sin(t) * radius,
      )
      groupRef.current.quaternion.copy(camera.quaternion)
    }
  })

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, texture ? -0.004 : 0]}>
        <circleGeometry args={[texture ? size * 1.12 : size, 48]} />
        <meshBasicMaterial color={ringColor} side={THREE.DoubleSide} />
      </mesh>
      {texture && (
        <mesh>
          <circleGeometry args={[size * 0.96, 48]} />
          <meshBasicMaterial map={texture} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
      )}
    </group>
  )
}

/**
 * Foto circular central (protagonista de la escena): no orbita, se queda
 * en el centro, flotando suavemente y girando despacio sobre su propio
 * eje como una moneda — siempre de frente a la cámara. Reemplaza al
 * helado ilustrado que estaba antes en el centro.
 */
export function CenterPhoto({ imageUrl, size = 1.05, ringColor = '#F2B632' }) {
  const groupRef = useRef(null)
  const spinRef = useRef(0)
  const texture = useSafeTexture(imageUrl)

  useFrame(({ clock, camera }, delta) => {
    spinRef.current += delta * 0.22
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.6) * 0.12
      groupRef.current.quaternion.copy(camera.quaternion)
      groupRef.current.rotateZ(spinRef.current)
    }
  })

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, texture ? -0.006 : 0]}>
        <circleGeometry args={[texture ? size * 1.06 : size, 64]} />
        <meshBasicMaterial color={ringColor} side={THREE.DoubleSide} />
      </mesh>
      {texture && (
        <mesh>
          <circleGeometry args={[size * 0.98, 64]} />
          <meshBasicMaterial map={texture} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
      )}
    </group>
  )
}
