'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function WriteMessage() {
    const [isOpen, setIsOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [sending, setSending] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!message.trim() || sending) return

        setSending(true)
        try {
            await fetch('/api/planes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
            })
            setMessage('')
            setIsOpen(false)
            // Ideally trigger a refresh of planes, but for now we rely on polling or swr if we had it.
            // We'll dispatch a custom event or rely on re-fetch interval.
            window.dispatchEvent(new Event('plane-thrown'))
        } catch (err) {
            console.error(err)
        } finally {
            setSending(false)
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 z-50 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-lg font-cormorant text-xl transition-all border border-white/20"
            >
                Write a Thought ️
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md m-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-2xl font-rozha mb-4 text-slate-800">Cast a Thought to the Sky</h2>
                            <form onSubmit={handleSubmit}>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    maxLength={280}
                                    className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300 font-cormorant text-lg text-slate-800"
                                    placeholder="What's on your mind? (Anonymous)"
                                />
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="px-4 py-2 text-slate-500 hover:text-slate-700 font-sans"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={sending || !message.trim()}
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-sans disabled:opacity-50"
                                    >
                                        {sending ? 'Throwing...' : 'Throw Plane ️'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
