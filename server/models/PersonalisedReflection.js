const mongoose = require("mongoose");

const personalisedReflectionSchema = new mongoose.Schema({
    dailyReading: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DailyReading",
        required: true,
    },
    mood: {
        type: String,
        enum: [
            "grateful", "anxious", "lonely", "angry", "guilty",
            "grieving", "joyful", "exhausted", "numb",
            "seeking", "struggling", "deciding",
        ],
        required: true,
    },
    content: { type: String, required: true },
    suggestedVerses: [
        {
            reference: { type: String },
            text: { type: String },
            reason: { type: String },
        },
    ],
    language: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Language",
        required: true,
    },
    generatedAt: { type: Date, default: Date.now },
});

personalisedReflectionSchema.index(
    { dailyReading: 1, mood: 1, language: 1 },
    { unique: true }
);

const PersonalisedReflection = mongoose.model(
    "PersonalisedReflection",
    personalisedReflectionSchema
);

module.exports = PersonalisedReflection;