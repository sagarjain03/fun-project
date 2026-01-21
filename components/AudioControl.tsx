'use client'

import { useStore } from '@/store/useStore'
import { motion } from 'framer-motion'

export default function AudioControl() {
    const { isAudioEnabled, setIsAudioEnabled } = useStore()

    const toggleAudio = () => {
        setIsAudioEnabled(!isAudioEnabled)
    }

    return (
        <div className="fixed top-8 left-24 z-50">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleAudio}
                className={`p-3 rounded-full border transition-all flex items-center justify-center ${isAudioEnabled
                    ? 'bg-rose-500 text-white border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.5)]'
                    : 'bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20'
                    }`}
                title="Microphone (Audio Reactive)"
            >
                {isAudioEnabled ? (
                    <div className="flex gap-1 items-center px-1">
                        <span className="w-1 h-3 bg-white rounded-full animate-pulse" />
                        <span className="w-1 h-5 bg-white rounded-full animate-[pulse_1s_ease-in-out_infinite]" />
                        <span className="w-1 h-3 bg-white rounded-full animate-pulse" />
                    </div>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                    </svg>
                )}
            </motion.button>
        </div>
    )
}
