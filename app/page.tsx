'use client'

import dynamic from 'next/dynamic'
import ReadingOverlay from '@/components/ReadingOverlay'
import WriteMessage from '@/components/WriteMessage'
import AmbientSound from '@/components/AmbientSound'
import AudioControl from '@/components/AudioControl'
import VibeDial from '@/components/VibeDial'

import ProfileHUD from '@/components/Gamification/ProfileHUD'
import useTraveler from '@/hooks/useTraveler'

const Scene = dynamic(() => import('@/components/Scene'), { ssr: false })

export default function Home() {
    useTraveler() // Init and sync user

    return (
        <main className="w-full h-full bg-gradient-to-b from-[#2C3E50] to-[#FD746C]">
            <AmbientSound />
            <AudioControl />
            <VibeDial />
            <ProfileHUD />
            <ReadingOverlay />
            <WriteMessage />
            <Scene />
        </main>
    )
}
