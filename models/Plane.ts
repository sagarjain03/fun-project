import mongoose, { Schema, Document } from 'mongoose'

export interface IPlane extends Document {
    message: string
    mood?: string
    startPosition: {
        x: number
        y: number
        z: number
    }
    createdAt: Date
}

const PlaneSchema = new Schema<IPlane>({
    message: { type: String, required: true, maxlength: 280 },
    mood: { type: String },
    startPosition: {
        x: { type: Number, required: true },
        y: { type: Number, required: true },
        z: { type: Number, required: true },
    },
    createdAt: { type: Date, default: Date.now, expires: 86400 } // 24 hours TTL
})

export default mongoose.models.Plane || mongoose.model<IPlane>('Plane', PlaneSchema)
