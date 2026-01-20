'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sky, Environment } from '@react-three/drei'
import FloatingClouds from './FloatingClouds'
import FloatingBooks from './FloatingBooks'
import PaperPlanes from './PaperPlanes'
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing'

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 75 }}
      dpr={[1, 2]} // Clamp pixel ratio for performance
      gl={{ powerPreference: "high-performance", antialias: true }}
    >
      <fog attach="fog" args={['#2C3E50', 10, 50]} />
      {/* Controls: Float and Rotate */}
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.5}
        enableZoom={true}
        enablePan={false}
      />

      {/* Atmospheric Environment */}
      <Sky sunPosition={[100, 20, 100]} turbidity={0.5} rayleigh={0.5} mieCoefficient={0.005} mieDirectionalG={0.8} />
      <Environment preset="sunset" />

      {/* Lighting */}
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      {/* Volumetric Clouds */}
      <FloatingClouds />

      {/* Interactive Library */}
      <FloatingBooks />

      {/* Flying Thoughts */}
      <PaperPlanes />

      <EffectComposer>
        <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} intensity={2.0} />
        <Noise opacity={0.02} />
      </EffectComposer>
    </Canvas>
  )
}
