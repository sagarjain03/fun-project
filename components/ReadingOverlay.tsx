'use client'

import { useStore } from '@/store/useStore'
import { motion, AnimatePresence } from 'framer-motion'

export default function ReadingOverlay() {
    const { activeBook, closeBook } = useStore()

    return (
        <AnimatePresence>
            {activeBook && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                    onClick={closeBook} // Close on background click
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="w-full max-w-2xl p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl text-white"
                        onClick={(e: React.MouseEvent) => e.stopPropagation()} // Prevent closing when clicking card
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className={`text-4xl mb-2 ${activeBook.language === 'hi' ? 'font-rozha' : 'font-cormorant font-bold'}`}>
                                    {activeBook.title}
                                </h1>
                                <p className="text-xl opacity-80 font-cormorant italic">
                                    by {activeBook.author}
                                </p>
                            </div>
                            <button
                                onClick={closeBook}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                ×
                            </button>
                        </div>

                        <div className={`prose prose-invert prose-lg max-w-none ${activeBook.language === 'hi' ? 'font-rozha' : 'font-cormorant'}`}>
                            <p className="whitespace-pre-line leading-relaxed text-lg opacity-90">
                                {activeBook.content}
                            </p>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                            <span className="text-sm opacity-50 font-sans">Click background to close</span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
