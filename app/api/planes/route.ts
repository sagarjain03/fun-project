import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Plane from '@/models/Plane'

export async function GET() {
    try {
        await dbConnect()
        const planes = await Plane.find({}).sort({ createdAt: -1 })
        return NextResponse.json(planes)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch planes' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect()
        const body = await request.json()

        // Randomize start position if not provided or just to ensure variance
        const startPosition = {
            x: (Math.random() - 0.5) * 40,
            y: 5 + Math.random() * 10, // Higher up
            z: (Math.random() - 0.5) * 40
        }

        const plane = await Plane.create({
            ...body,
            startPosition
        })

        return NextResponse.json(plane, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create plane' }, { status: 500 })
    }
}
