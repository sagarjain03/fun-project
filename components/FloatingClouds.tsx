'use client'

import { Cloud } from '@react-three/drei'
import { useEffect, useState } from 'react'
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

export default function FloatingClouds() {
    const setActiveBook = useStore((state) => state.setActiveBook)
    const [books, setBooks] = useState<BookData[]>([])
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

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
                <Cloud
                    key={i}
                    position={[book.coordinates.x, book.coordinates.y, book.coordinates.z]}
                    opacity={0.6}
                    speed={0.2} // Gentle movement
                    segments={6} // Optimized segments
                    bounds={[5, 2, 5]}
                    volume={6}
                    color={hoveredIndex === i ? "#ffeaa7" : "white"}
                    onClick={(e) => {
                        e.stopPropagation()
                        setActiveBook({
                            title: book.title,
                            author: book.author,
                            content: book.content,
                            language: book.language
                        })
                    }}
                    onPointerOver={(e) => {
                        e.stopPropagation()
                        document.body.style.cursor = 'pointer'
                        setHoveredIndex(i)
                    }}
                    onPointerOut={() => {
                        document.body.style.cursor = 'auto'
                        setHoveredIndex(null)
                    }}
                />
            ))}
        </>
    )
}
