import { Schema, model } from 'mongoose';

const NoteSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
        max: 100,
        min: 1,
    },
    content: {
        type: String,
        required: true,
        trim: true,
        max: 1000,
        min: 1,
    },
    user_id: {
        type: String,
        required: true,
        trim: true,
        ref: 'User',
    },
    date: {
        type: Date,
        default: Date.now,
    },
})

export const Note = model('Note', NoteSchema)