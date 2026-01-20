import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Book from '@/models/Book'

export async function GET() {
    try {
        await dbConnect()
        const books = await Book.find({})
        return NextResponse.json(books)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect()
        const body = await request.json()
        const book = await Book.create(body)
        return NextResponse.json(book, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create book' }, { status: 500 })
    }
}
