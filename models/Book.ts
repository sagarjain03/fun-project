import mongoose, { Schema, Document } from 'mongoose'

export interface IBook extends Document {
    title: string
    author: string
    content: string
    language: 'en' | 'hi'
    mood?: string
    coordinates: {
        x: number
        y: number
        z: number
    }
}

const BookSchema = new Schema<IBook>({
    title: { type: String, required: true },
    author: { type: String, required: true },
    content: { type: String, required: true },
    language: { type: String, enum: ['en', 'hi'], required: true },
    mood: { type: String },
    coordinates: {
        x: { type: Number, required: true },
        y: { type: Number, required: true },
        z: { type: Number, required: true },
    }
})

export default mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema)
