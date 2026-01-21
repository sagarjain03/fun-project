import mongoose, { Schema, Document } from 'mongoose'

export interface ITraveler extends Document {
    guestId: string
    xp: number
    level: number
    inventory: mongoose.Types.ObjectId[] // References to books
    createdAt: Date
}

const TravelerSchema = new Schema<ITraveler>({
    guestId: { type: String, required: true, unique: true, index: true },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    inventory: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
    createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.Traveler || mongoose.model<ITraveler>('Traveler', TravelerSchema)
