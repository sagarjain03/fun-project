'use client'

import dynamic from 'next/dynamic'
import ReadingOverlay from '@/components/ReadingOverlay'
import WriteMessage from '@/components/WriteMessage'
import AmbientSound from '@/components/AmbientSound'

const Scene = dynamic(() => import('@/components/Scene'), { ssr: false })

export default function Home() {
    return (
        <main className="w-full h-full bg-gradient-to-b from-[#2C3E50] to-[#FD746C]">
            <AmbientSound />
            <ReadingOverlay />
            <WriteMessage />
            <Scene />
        </main>
    )
}
