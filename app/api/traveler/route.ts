import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Traveler from '@/models/Traveler'

export async function POST(request: Request) {
    try {
        await dbConnect()
        const { guestId } = await request.json()

        if (!guestId) {
            return NextResponse.json({ error: 'Guest ID required' }, { status: 400 })
        }

        let traveler = await Traveler.findOne({ guestId }).populate('inventory')

        if (!traveler) {
            traveler = await Traveler.create({ guestId })
        }

        return NextResponse.json(traveler)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to sync traveler' }, { status: 500 })
    }
}
