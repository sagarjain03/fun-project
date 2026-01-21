'use client'

import { useEffect } from 'react'
import { useStore } from '@/store/useStore'

export default function useTraveler() {
    const { setTraveler, traveler } = useStore()

    useEffect(() => {
        // Generate or retrieve Guest ID
        let guestId = localStorage.getItem('guest_id')
        if (!guestId) {
            guestId = crypto.randomUUID()
            localStorage.setItem('guest_id', guestId)
        }

        // Update local store immediately with ID
        setTraveler({ guestId })

        // Sync from Backend
        fetch('/api/traveler', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ guestId })
        })
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) {
                    setTraveler({
                        xp: data.xp,
                        level: data.level,
                        inventory: data.inventory || []
                    })
                }
            })
            .catch(err => console.error("Sync failed:", err))

    }, []) // Run once on mount

    return traveler
}
