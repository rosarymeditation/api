const mongoose = require("mongoose");

const SaintSchema = new mongoose.Schema({

    // ===== Identity =====
    name: {
        type: String,
        required: true,
        index: true
    },

    subtitle: {
        type: String, // e.g. "Bishop · Martyr · Companion of St. Paul"
    },

    // ===== Feast Info =====
    feastDate: {
        type: Date,
        required: true
    },

    dateString: {
        type: String, // e.g. "January 26"
        required: true
    },

    // ===== Quick Facts =====
    place: {
        type: String // e.g. "Lystra, Turkey"
    },

    patronage: [{
        type: String // e.g. "Youth", "Deacons", "Stomach Ailments"
    }],

    // ===== Main Content =====
    biography: {
        type: String, // long-form historical biography (HTML)
        required: true
    },

    reflection: {
        type: String // spiritual reflection (HTML)
    },

    prayer: {
        type: String // devotional prayer (HTML)
    },

    // ===== Scripture Highlight =====
    quote: {
        type: String // e.g. "Let no one despise your youth..."
    },

    bibleVerses: [{
        type: String // e.g. "1 Timothy 4:12"
    }],

    // ===== Freemium =====
    teaser: {
        type: String, // short preview text (HTML)
        required: true
    },

    // ===== Media =====
    imageUrl: {
        type: String // hero image
    },

    // ===== Localization =====
    language: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Language",
        required: true,
        index: true
    },

    // ===== Metadata =====
    createdAt: {
        type: Date,
        default: Date.now
    }

});

// Index for daily saint lookup
SaintSchema.index({ feastDate: 1, language: 1 });

const Saint = mongoose.model("Saint", SaintSchema);
module.exports = Saint;
