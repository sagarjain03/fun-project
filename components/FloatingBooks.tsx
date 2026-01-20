'use client'

import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber' // Correct import for useFrame
import { Mesh } from 'three'
import { useStore } from '@/store/useStore'

interface BookData {
    title: string
    author: string
    content: string
    language: 'en' | 'hi'
    coordinates: {
        x: number
        y: number
        z: number
    }
}

function Book({ data }: { data: BookData }) {
    const meshRef = useRef<Mesh>(null)
    const [hovered, setHover] = useState(false)
    const setActiveBook = useStore((state) => state.setActiveBook)

    // Floating animation
    useFrame((state) => {
        if (meshRef.current) {
            // Use coordinates as base, add gentle float
            meshRef.current.position.y = data.coordinates.y + Math.sin(state.clock.elapsedTime + data.coordinates.x) * 0.5
            meshRef.current.rotation.y += 0.005
        }
    })

    return (
        <mesh
            ref={meshRef}
            position={[data.coordinates.x, data.coordinates.y, data.coordinates.z]}
            scale={hovered ? 1.2 : 1}
            onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer' }}
            onPointerOut={() => { setHover(false); document.body.style.cursor = 'auto' }}
            onClick={(e) => {
                e.stopPropagation()
                setActiveBook({
                    title: data.title,
                    author: data.author,
                    content: data.content,
                    language: data.language
                })
            }}
        >
            <boxGeometry args={[0.5, 0.7, 0.15]} />
            <meshStandardMaterial color={hovered ? 'gold' : '#8e44ad'} roughness={0.3} metalness={0.1} />
        </mesh>
    )
}

export default function FloatingBooks() {
    const [books, setBooks] = useState<BookData[]>([])

    useEffect(() => {
        fetch('/api/books')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setBooks(data)
                }
            })
            .catch(err => console.error("Failed to fetch books:", err))
    }, [])

    return (
        <>
            {books.map((book, i) => (
                <Book key={i} data={book} />
            ))}
        </>
    )
}
