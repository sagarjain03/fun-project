'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '@/store/useStore'
import { useAudioAnalyzer } from '@/hooks/useAudioAnalyzer'

export default function AudioReactiveSky() {
    const isAudioEnabled = useStore(state => state.isAudioEnabled)
    const { getFrequencyData, isReady } = useAudioAnalyzer(isAudioEnabled)

    // Visual 1: Pulsing Aura (Invisible giant sphere that scales)
    const auraRef = useRef<THREE.Mesh>(null)

    // Visual 2: Shimmering Stars (Particle System)
    const starsRef = useRef<THREE.Points>(null)

    // Create random particles 
    const particles = useMemo(() => {
        const count = 500
        const positions = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            // Spread them wide in the sky
            positions[i * 3] = (Math.random() - 0.5) * 60
            positions[i * 3 + 1] = (Math.random() - 0.5) * 40 + 10 // Start a bit high
            positions[i * 3 + 2] = (Math.random() - 0.5) * 60
        }
        return positions
    }, [])

    useFrame((state, delta) => {
        if (!isAudioEnabled || !isReady) {
            // Idle animation if not listening
            if (starsRef.current) {
                starsRef.current.rotation.y += delta * 0.05
                const material = starsRef.current.material as THREE.PointsMaterial
                material.size = 0.1
                material.opacity = 0
            }
            if (auraRef.current) {
                auraRef.current.scale.setScalar(1)
                auraRef.current.visible = false
            }
            return
        }

        const data = getFrequencyData()
        if (!data) return

        // 1. Analyze Bass (Lower frequencies: 0-20)
        let bassSum = 0
        for (let i = 0; i < 20; i++) bassSum += data[i]
        const bassAvg = bassSum / 20
        const bassFactor = bassAvg / 255 // 0 to 1

        // 2. Analyze Treble (Higher frequencies: 100-200)
        let trebleSum = 0
        for (let i = 100; i < 200; i++) trebleSum += data[i]
        const trebleAvg = trebleSum / 100
        const trebleFactor = trebleAvg / 255 // 0 to 1

        // Apply Bass -> Pulse (Clouds / Aura)
        if (auraRef.current) {
            auraRef.current.visible = true
            // Smoothly lerp scale
            const targetScale = 1 + bassFactor * 0.5 // Scale up to 1.5x
            auraRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.2)

            // Maybe color/opacity shift?
            const mat = auraRef.current.material as THREE.MeshBasicMaterial
            mat.opacity = THREE.MathUtils.lerp(mat.opacity, bassFactor * 0.3, 0.1)
        }

        // Apply Treble -> Sparkle (Stars)
        if (starsRef.current) {
            starsRef.current.visible = true
            // Rotate faster with music
            starsRef.current.rotation.y += delta * (0.1 + trebleFactor)

            const material = starsRef.current.material as THREE.PointsMaterial
            const targetSize = 0.2 + trebleFactor * 0.5
            material.size = THREE.MathUtils.lerp(material.size, targetSize, 0.2)
            material.opacity = THREE.MathUtils.lerp(material.opacity, 0.3 + trebleFactor, 0.2)
        }
    })

    return (
        <group>
            {/* Bass Aura - A large fuzzy sphere encompassing the viewer */}
            <mesh ref={auraRef} visible={false}>
                <sphereGeometry args={[25, 32, 32]} />
                <meshBasicMaterial
                    color="#a020f0" // Deep purple pulse
                    transparent
                    opacity={0}
                    side={THREE.BackSide} // Render inside
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Treble Stars - Glittering particles */}
            <Points ref={starsRef} positions={particles} stride={3} visible={false}>
                <PointMaterial
                    transparent
                    color="#00ffff"
                    size={0.1}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Points>
        </group>
    )
}
