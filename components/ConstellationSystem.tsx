'use client'

import { useStore } from '@/store/useStore'
import { HIDDEN_CONSTELLATIONS } from '@/data/constellations'
import { Line, Float } from '@react-three/drei' // Import Float for hovering
import { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'

export default function ConstellationSystem() {
    const {
        atmosphere,
        drawnLines,
        addPuzzlePoint,
        resetPuzzle,
        puzzleStatus,
        solvePuzzle,
        setActiveBook
    } = useStore()

    const [hoveredNode, setHoveredNode] = useState<string | null>(null)

    // Only active in Starry Midnight
    if (atmosphere !== 'starry-midnight') return null

    // Current Puzzle (Triad)
    const constellation = HIDDEN_CONSTELLATIONS[0]

    const handleNodeClick = (node: number[], index: number) => {
        if (puzzleStatus === 'solved') return

        // Prevent duplicate points line-by-line if needed, or allow for complex shapes
        const lastPoint = drawnLines[drawnLines.length - 1]
        if (lastPoint && lastPoint[0] === node[0] && lastPoint[1] === node[1]) return

        addPuzzlePoint([node[0], node[1], node[2]])

        // Validation Logic
        const currentPath = [...drawnLines, node]

        // Check if path length matches
        if (currentPath.length === constellation.nodes.length) {
            // Validate
            const isMatch = constellation.nodes.every((target, i) => {
                const p = currentPath[i]
                return p[0] === target[0] && p[1] === target[1] && p[2] === target[2]
            })

            if (isMatch) {
                solvePuzzle()
                setActiveBook({
                    ...constellation.rewardBook,
                    language: 'en'
                })
            } else {
                // Wrong path
                setTimeout(resetPuzzle, 500)
            }
        } else if (currentPath.length > constellation.nodes.length) {
            resetPuzzle()
        }
    }

    return (
        <group>
            {/* Render Puzzle Nodes */}
            {constellation.nodes.map((pos, i) => (
                <Float
                    key={i}
                    speed={2}
                    rotationIntensity={1}
                    floatIntensity={0.2}
                >
                    <mesh
                        position={[pos[0], pos[1], pos[2]]}
                        onClick={(e) => { e.stopPropagation(); handleNodeClick(pos, i) }}
                        onPointerOver={() => { document.body.style.cursor = 'crosshair'; setHoveredNode(i.toString()) }}
                        onPointerOut={() => { document.body.style.cursor = 'auto'; setHoveredNode(null) }}
                    >
                        {/* Use Octahedron for a diamond/star shape */}
                        <octahedronGeometry args={[0.2, 0]} />
                        <meshStandardMaterial
                            color={puzzleStatus === 'solved' ? "#ffd700" : "#40e0d0"} // Gold vs Turquoise
                            emissive={puzzleStatus === 'solved' ? "#ffd700" : "#40e0d0"}
                            emissiveIntensity={hoveredNode === i.toString() ? 4 : 2} // High intensity for bloom
                            toneMapped={false} // Ensure color is not clamped, allowing full bloom
                        />
                    </mesh>
                    {/* Halo Glow Mesh (slightly larger transparent sphere) */}
                    <mesh position={[pos[0], pos[1], pos[2]]}>
                        <sphereGeometry args={[0.4, 16, 16]} />
                        <meshBasicMaterial
                            color={puzzleStatus === 'solved' ? "#ffd700" : "#40e0d0"}
                            transparent
                            opacity={0.2}
                            depthWrite={false}
                        />
                    </mesh>
                </Float>
            ))}

            {/* Render Drawn Lines */}
            {drawnLines.length > 0 && (
                <Line
                    points={drawnLines} // Array of [x, y, z] arrays
                    color={puzzleStatus === 'solved' ? "#ffd700" : "#40e0d0"}
                    lineWidth={2}
                    opacity={0.8}
                    transparent
                    dashed={false}
                />
            )}

            {/* Solved Connections (Close the loop if solved?) */}
            {puzzleStatus === 'solved' && (
                <Line
                    points={[...constellation.nodes, constellation.nodes[0]]} // Close loop to verify shape
                    color="#ffd700"
                    lineWidth={4}
                    opacity={1}
                    transparent
                />
            )}
        </group>
    )
}
