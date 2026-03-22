const mongoose = require('mongoose');

const DailyItemSchema = new mongoose.Schema(
    {
        dayNumber: {
            type: Number,
            required: true,
            min: 1,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        scripture: {
            type: String,
            default: '',
        },

        reflection: {
            type: String,
            default: '',
        },

        saintReflection: {
            type: String,
            default: '',
        },

        prayers: {
            type: [String],
            default: [],
        },

        actions: {
            type: [String],
            default: [],
        },
    },
    { _id: false }
);

const PlanSchema = new mongoose.Schema(
    {
        // Stable ID used by Flutter to track progress
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        thumbnail: {
            type: String, // image URL or file path
            default: '',
        },
        isFree: {
            type: Boolean,
            default: false,
        },
        language: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Language",
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            enum: [
                // English
                "Marian", "Scripture", "Saint", "Virtue", "Prayer",
                "Reflection", "Liturgical", "Fasting", "Lent", "Marriage",
                "Novena", "Healing", "Eucharistic", "Divine Mercy", "Rosary",
                "Advent", "Consecration",
                // Spanish
                "Mariana", "Escritura", "Santos", "Virtud", "Oración",
                "Reflexión", "Litúrgico", "Ayuno", "Cuaresma", "Matrimonio",
                "Novena", "Sanación", "Eucarístico", "Divina Misericordia",
                "Rosario", "Adviento", "Consagración",
            ],
            required: true,
        },

        description: {
            type: String,
            default: '',
        },

        totalDays: {
            type: Number,
            required: true,
            min: 1,
        },

        dailyItems: {
            type: [DailyItemSchema],
            required: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

    },
    {
        timestamps: true,
    }
);

// Safety check: totalDays must match dailyItems length
PlanSchema.pre('save', function (next) {
    if (this.dailyItems.length !== this.totalDays) {
        return next(
            new Error('totalDays must match number of dailyItems')
        );
    }
    next();
});

module.exports = mongoose.model('Plan', PlanSchema);
