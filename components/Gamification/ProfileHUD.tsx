'use client'

import { useStore } from '@/store/useStore'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProfileHUD() {
    const { traveler } = useStore()
    const [isOpen, setIsOpen] = useState(false)

    // Calc progress to next level (assuming 50 XP per level for simplicity)
    const xpForNextLevel = 50
    const progress = (traveler.xp % xpForNextLevel) / xpForNextLevel * 100

    return (
        <>
            <div className="fixed top-8 right-24 z-50 flex items-center gap-4 bg-black/30 backdrop-blur-md p-2 rounded-full border border-white/10 text-white font-cormorant">

                {/* Level Badge */}
                <div className="flex flex-col items-center px-2">
                    <span className="text-xs text-blue-200 uppercase tracking-widest">Level</span>
                    <span className="text-2xl font-bold font-rozha text-amber-400">{traveler.level}</span>
                </div>

                {/* XP Bar */}
                <div className="w-32">
                    <div className="flex justify-between text-xs mb-1 opacity-80">
                        <span>XP</span>
                        <span>{traveler.xp}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all duration-500 rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Satchel Button */}
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors relative"
                    title="Open Satchel"
                >
                    🛍️
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                        {traveler.inventory.length}
                    </span>
                </button>
            </div>

            {/* Inventory Modal */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-slate-900 border border-slate-700 w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl p-8 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-rozha text-amber-100">Traveler's Satchel</h2>
                                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {traveler.inventory.length === 0 ? (
                                    <p className="text-slate-500 col-span-2 text-center py-10">Your satchel is empty. Explore the sky to find poems.</p>
                                ) : (
                                    traveler.inventory.map((book: any, i) => (
                                        <div key={i} className="bg-white/5 p-4 rounded-lg border border-white/5 hover:border-amber-500/50 transition-colors">
                                            <h3 className="font-cormorant text-xl text-amber-200 mb-1">{book.title}</h3>
                                            <p className="text-sm text-slate-400">{book.author}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
