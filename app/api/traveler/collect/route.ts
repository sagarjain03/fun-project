import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Traveler, { ITraveler } from '@/models/Traveler'
import Book from '@/models/Book' // Ensure Book model is loaded

export async function POST(request: Request) {
    try {
        await dbConnect()
        const { guestId, bookId } = await request.json()

        const traveler = await Traveler.findOne({ guestId }) as ITraveler | null
        if (!traveler) {
            return NextResponse.json({ error: 'Traveler not found' }, { status: 404 })
        }

        // Check if already collected
        // Assuming bookId passed is a string, compare with ObjectIds in inventory
        const alreadyCollected = traveler.inventory.some(id => id.toString() === bookId)

        if (alreadyCollected) {
            return NextResponse.json({ message: 'Already collected', traveler })
        }

        // Add to inventory
        // @ts-ignore - ObjectId casting usually auto-handled by Mongoose pushing string, but being explicit looks safer
        traveler.inventory.push(bookId)

        // Add XP and Calc Level
        traveler.xp += 10
        traveler.level = Math.floor(traveler.xp / 50) + 1

        await traveler.save()

        // Return populated inventory for UI
        await traveler.populate('inventory')

        return NextResponse.json({ message: 'Collected!', traveler })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to collect book' }, { status: 500 })
    }
}
