'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sky, Environment } from '@react-three/drei'
import FloatingClouds from './FloatingClouds'
import FloatingBooks from './FloatingBooks'
import PaperPlanes from './PaperPlanes'
import WeatherEffects from './WeatherEffects'
import AtmosphereController from './AtmosphereController'
import ConstellationSystem from './ConstellationSystem'
import LibrarianOrb from './LibrarianOrb'
import AudioReactiveSky from './AudioReactiveSky'
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing'
import { useStore } from '@/store/useStore'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function CameraController() {
  const { targetCameraPosition, clearTargetCameraPosition, targetBook, setActiveBook } = useStore()
  const { camera } = useThree()
  // controlsRef usage removed as it is not in store
  // Actually, simple lerp works even with orbit controls if we force position.

  useFrame((state, delta) => {
    if (!targetCameraPosition) return

    const target = new THREE.Vector3(...targetCameraPosition)
    const currentPos = camera.position.clone()

    // Offset simple logic: We want to stop 2 units away from the book
    // Direction vector from camera to book
    // But simpler: Move camera to (BookPos + offset), e.g. Z+2
    // Let's just lerp to target for now, assume target IS the viewing position? 
    // No, target is the Book coordinate. So we want to stop at book coordinate + offset?

    // Let's dynamically calculate "Viewing Position"
    // Move towards the target, but stop DISTANCE away.
    const direction = new THREE.Vector3().subVectors(target, currentPos).normalize()
    const distance = currentPos.distanceTo(target)

    // If far away, move closer
    if (distance > 3) {
      // Lerp position
      const step = 5 * delta // Speed
      const newPos = currentPos.add(direction.multiplyScalar(step))
      camera.position.lerp(newPos, 0.1)

      // Look at book
      // camera.lookAt(target) // This fights with OrbitControls
      state.camera.lookAt(target)
    } else {
      // Arrived
      setActiveBook(targetBook!)
      clearTargetCameraPosition()
    }
  })

  return null
}

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 75 }}
      dpr={[1, 2]} // Clamp pixel ratio for performance
      gl={{ powerPreference: "high-performance", antialias: true }}
    >
      <AtmosphereController />
      <CameraController />
      {/* Controls: Float and Rotate */}
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.5}
        enableZoom={true}
        enablePan={false}
      />

      {/* Atmospheric Environment - Managed by WeatherEffects/Controller */}

      {/* Lighting */}
      {/* (Lights managed by AtmosphereController) */}

      <WeatherEffects />
      <pointLight position={[10, 10, 10]} intensity={1} />

      {/* Volumetric Clouds */}
      <FloatingClouds />

      {/* Interactive Library */}
      <FloatingBooks />

      {/* Flying Thoughts */}
      <PaperPlanes />

      {/* Constellation Puzzle (Starry Midnight Only inside component) */}
      <ConstellationSystem />

      {/* Intelligent Guide */}
      <LibrarianOrb />

      {/* Audio Reactive Visuals */}
      <AudioReactiveSky />

      <EffectComposer>
        <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} intensity={2.0} />
        <Noise opacity={0.02} />
      </EffectComposer>
    </Canvas>
  )
}
