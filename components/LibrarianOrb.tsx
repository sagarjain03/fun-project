'use client'

import { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MeshDistortMaterial, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '@/store/useStore'
import { AnimatePresence, motion } from 'framer-motion'

export default function LibrarianOrb() {
    const orbRef = useRef<THREE.Mesh>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [isThinking, setIsThinking] = useState(false)
    const setTargetCameraPosition = useStore(state => state.setTargetCameraPosition)
    const { camera } = useThree()

    // Floating logic: Follow camera with a delay and float
    useFrame((state) => {
        if (orbRef.current) {
            // Calculate a target position relative to the camera
            // Position it slightly to the right and forward
            const idealPos = new THREE.Vector3(1.5, -0.5, -3) // Local offset
            idealPos.applyMatrix4(camera.matrixWorld)

            // Smoothly interpolate current position to target
            orbRef.current.position.lerp(idealPos, 0.05)

            // Add gentle floating bobbing
            const time = state.clock.getElapsedTime()
            orbRef.current.position.y += Math.sin(time) * 0.002
        }
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return

        setIsThinking(true)

        try {
            const res = await fetch('/api/librarian', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            })

            const data = await res.json()

            if (data.book) {
                const { x, y, z } = data.book.coordinates
                // Calculate a position slightly in front of the book so we don't crash into it
                // We'll target the book coord directly and stop slightly early in the Camera logic
                setTargetCameraPosition([x, y, z])
                useStore.getState().setTargetBook(data.book)
                setIsOpen(false)
                setQuery('')
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsThinking(false)
        }
    }

    return (
        <>
            <mesh
                ref={orbRef}
                onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen) }}
                onPointerOver={() => document.body.style.cursor = 'pointer'}
                onPointerOut={() => document.body.style.cursor = 'auto'}
            >
                <sphereGeometry args={[0.3, 32, 32]} />
                <MeshDistortMaterial
                    color={isThinking ? "#ff00ff" : "#00ffff"}
                    emissive={isThinking ? "#ff00ff" : "#00ffff"}
                    emissiveIntensity={2}
                    distort={0.4}
                    speed={2}
                    transparent // Improve rendering with clouds
                    opacity={0.9}
                />

                {/* Interaction UI */}
                <Html position={[0, 0.5, 0]} center distanceFactor={6}>
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/20 w-64 shadow-2xl text-white font-serif"
                            >
                                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                                    <label className="text-sm italic text-cyan-200">How does your heart feel?</label>
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="e.g. lonely, inspired..."
                                        className="bg-white/10 p-2 rounded border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400"
                                        autoFocus
                                    />
                                    <button
                                        type="submit"
                                        disabled={isThinking}
                                        className="bg-cyan-500/80 hover:bg-cyan-500 text-black font-semibold py-1 rounded transition-colors disabled:opacity-50"
                                    >
                                        {isThinking ? 'Searching...' : 'Guide Me'}
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Html>
            </mesh>

            {/* Light for the orb */}
            {orbRef.current && <pointLight position={orbRef.current.position} intensity={2} distance={3} color="cyan" />}
        </>
    )
}
