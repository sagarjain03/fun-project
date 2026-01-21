'use client'

import { useStore } from '@/store/useStore'
import { Sparkles, Stars, Cloud } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Rain() {
    const rainCount = 2000
    const rainGeo = useRef<THREE.BufferGeometry>(null)

    const positions = useMemo(() => {
        const pos = new Float32Array(rainCount * 3)
        for (let i = 0; i < rainCount; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 50
            pos[i * 3 + 1] = Math.random() * 40 // heightened start
            pos[i * 3 + 2] = (Math.random() - 0.5) * 50
        }
        return pos
    }, [])

    useFrame(() => {
        if (rainGeo.current) {
            const positions = rainGeo.current.attributes.position.array as Float32Array
            for (let i = 0; i < rainCount; i++) {
                positions[i * 3 + 1] -= 0.5 // Fall speed
                if (positions[i * 3 + 1] < -10) {
                    positions[i * 3 + 1] = 40
                }
            }
            rainGeo.current.attributes.position.needsUpdate = true
        }
    })

    return (
        <points>
            <bufferGeometry ref={rainGeo}>
                <bufferAttribute
                    attach="attributes-position"
                    count={rainCount}
                    array={positions}
                    itemSize={3}
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial color="#aabccc" size={0.1} transparent opacity={0.6} />
        </points>
    )
}

export default function WeatherEffects() {
    const atmosphere = useStore((state) => state.atmosphere)

    return (
        <>
            {atmosphere === 'rainy-night' && <Rain />}

            {atmosphere === 'starry-midnight' && (
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            )}

            {atmosphere === 'sunset-glow' && (
                <Sparkles count={50} scale={12} size={4} speed={0.4} opacity={0.5} color="orange" position={[0, 5, 0]} />
            )}

            {/* Clouds are always present but maybe modified or handled by FloatingClouds component independently. 
          If we want specific weather clouds, we could switch them here. For now, FloatingClouds persists. */}
        </>
    )
}
