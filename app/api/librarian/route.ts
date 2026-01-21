import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Book, { IBook } from '@/models/Book'

export async function POST(req: Request) {
    try {
        const { query } = await req.json()

        if (!query) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 })
        }

        await dbConnect()
        const books: IBook[] = await Book.find({})

        const tokens = query.toLowerCase().split(/\s+/)

        const scoredBooks = books.map(book => {
            let score = 0

            // Tag matches (Weighted higher)
            if (book.tags) {
                book.tags.forEach(tag => {
                    if (tokens.some((token: string) => tag.toLowerCase().includes(token) || token.includes(tag.toLowerCase()))) {
                        score += 3
                    }
                })
            }

            // Content/Title matches
            tokens.forEach((token: string) => {
                if (book.title.toLowerCase().includes(token)) score += 2
                if (book.content.toLowerCase().includes(token)) score += 1
            })

            return { book, score }
        })

        // Sort by score descending
        scoredBooks.sort((a, b) => b.score - a.score)

        // Get top match
        const bestMatch = scoredBooks[0]

        if (!bestMatch || bestMatch.score === 0) {
            // Fallback to random if no match found (or handle gracefully)
            const randomBook = books[Math.floor(Math.random() * books.length)]
            return NextResponse.json({
                book: randomBook,
                message: "I couldn't find an exact match, but this might speak to you."
            })
        }

        return NextResponse.json({
            book: bestMatch.book,
            message: "I found this for you."
        })

    } catch (error) {
        console.error('Librarian Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
