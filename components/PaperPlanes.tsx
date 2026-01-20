'use client'

import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'
import { useStore } from '@/store/useStore'

interface PlaneData {
    _id: string
    message: string
    mood?: string
    startPosition: { x: number, y: number, z: number }
}

function Plane({ data }: { data: PlaneData }) {
    const meshRef = useRef<Mesh>(null)
    const [hovered, setHover] = useState(false)
    const setActiveBook = useStore((state) => state.setActiveBook)

    // Random flight parameters
    const speed = 0.05 + Math.random() * 0.05
    const offset = Math.random() * 100

    useFrame((state) => {
        if (meshRef.current) {
            // Move "forward" (using Z for simplicity, could be complex vector)
            meshRef.current.position.z += speed

            // Gentle banking/wobble
            meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime + offset) * 0.2
            meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.5 + offset) * 0.02

            // Loop binding
            if (meshRef.current.position.z > 20) {
                meshRef.current.position.z = -20
            }
        }
    })

    return (
        <mesh
            ref={meshRef}
            position={[data.startPosition.x, data.startPosition.y, data.startPosition.z]}
            rotation={[0, Math.PI, 0]} // Face forward (initial)
            scale={hovered ? 1.5 : 1}
            onClick={(e) => {
                e.stopPropagation()
                setActiveBook({
                    title: 'Anonymous Thought',
                    author: 'A Passing Cloud',
                    content: data.message,
                    language: 'en' // Defaulting to en for font, could detect
                })
            }}
            onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer' }}
            onPointerOut={() => { setHover(false); document.body.style.cursor = 'auto' }}
        >
            <coneGeometry args={[0.2, 0.8, 4]} /> {/* Paper plane shape */}
            <meshStandardMaterial color="white" emissive="white" emissiveIntensity={hovered ? 0.5 : 0} />
        </mesh>
    )
}

export default function PaperPlanes() {
    const [planes, setPlanes] = useState<PlaneData[]>([])

    const fetchPlanes = () => {
        fetch('/api/planes')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setPlanes(data)
            })
            .catch(err => console.error(err))
    }

    useEffect(() => {
        fetchPlanes()

        // Listen for new throws
        const handleThrow = () => fetchPlanes()
        window.addEventListener('plane-thrown', handleThrow)

        // Poll every 30s to see new global messages
        const interval = setInterval(fetchPlanes, 30000)

        return () => {
            window.removeEventListener('plane-thrown', handleThrow)
            clearInterval(interval)
        }
    }, [])

    return (
        <group>
            {planes.map((plane) => (
                <Plane key={plane._id} data={plane} />
            ))}
        </group>
    )
}
