'use client'

import { useStore, Atmosphere } from '@/store/useStore'
import { motion } from 'framer-motion'

const vibes: { id: Atmosphere; label: string; icon: string; bg: string }[] = [
    { id: 'sunny-day', label: 'Day', icon: '☀️', bg: 'bg-blue-400' },
    { id: 'sunset-glow', label: 'Sunset', icon: '🌅', bg: 'bg-orange-400' },
    { id: 'rainy-night', label: 'Rain', icon: '🌧️', bg: 'bg-slate-600' },
    { id: 'starry-midnight', label: 'Night', icon: '🌌', bg: 'bg-indigo-900' },
]

export default function VibeDial() {
    const { atmosphere, setAtmosphere } = useStore()

    return (
        <div className="fixed top-8 left-8 z-50 flex gap-4">
            {vibes.map((vibe) => (
                <motion.button
                    key={vibe.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setAtmosphere(vibe.id)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg border-2 transition-all ${atmosphere === vibe.id ? 'border-white scale-110 ring-2 ring-white/50' : 'border-white/20 opacity-70 hover:opacity-100'
                        } ${vibe.bg}`}
                    title={vibe.label}
                >
                    {vibe.icon}
                </motion.button>
            ))}
        </div>
    )
}
