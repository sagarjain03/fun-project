'use client'

import { useStore } from '@/store/useStore'
import { useSpring, animated } from '@react-spring/three'
import { useEffect } from 'react'

export default function AtmosphereController() {
    const atmosphere = useStore((state) => state.atmosphere)

    const { fogColor, ambientIntensity, lightColor } = useSpring({
        fogColor: atmosphere === 'sunny-day' ? '#87CEEB'
            : atmosphere === 'sunset-glow' ? '#FD746C'
                : atmosphere === 'rainy-night' ? '#2c3e50'
                    : '#0b1026', // starry-midnight
        ambientIntensity: atmosphere === 'sunny-day' ? 0.8
            : atmosphere === 'sunset-glow' ? 0.5
                : atmosphere === 'rainy-night' ? 0.3
                    : 0.1,
        lightColor: atmosphere === 'sunny-day' ? '#ffffff'
            : atmosphere === 'sunset-glow' ? '#ffaa00'
                : '#aabbcc',
        config: { duration: 2000 } // smooth transition
    })

    // Update background color (hacky but effective for simple setup)
    return (
        <>
            {/* Background Color via a Sphere (Smoother than modifying scene.background directly) or just use CSS */}
            {/* But since transparency is tricky, let's try setting color via prop. 
                R3F <color> component sets scene.background. It takes 'args'. It is not easily animatable via spring without 'r,g,b'.
                Reverting to CSS background for sky color might be safer for Shinkai style, as previously implemented.
                But user said "Static Sky".
                Let's use a large Sphere for skybox. */}

            <mesh scale={[100, 100, 100]}>
                <sphereGeometry />
                <animated.meshBasicMaterial color={fogColor} side={2} /> {/* 2 = DoubleSide/BackSide */}
            </mesh>

            <animated.fog attach="fog" args={['black', 5, 40]} color={fogColor} />
            <animated.ambientLight intensity={ambientIntensity} color={lightColor} />
            <animated.directionalLight position={[5, 10, 5]} intensity={1.5} color={lightColor} castShadow />
        </>
    )
}
