const PersonalisedReflection = require("../models/personalisedReflection");
const DailyReading = require("../models/dailyReading");
const Language = require("../models/language");
const Anthropic = require("@anthropic-ai/sdk");
const { SERVER_ERROR, OK } = require("../errors/statusCode");

const anthropic = new Anthropic({ apiKey: process.env.ANTROPIC_API_KEY });

// ─────────────────────────────────────────────
//  Mood metadata
// ─────────────────────────────────────────────
const moodMeta = {
    grateful: {
        label: "Grateful",
        tone: "warm and celebratory",
        focus: "invite the reader to deepen their gratitude and see God's hand in everyday blessings",
    },
    anxious: {
        label: "Anxious",
        tone: "gentle and reassuring",
        focus: "speak directly to worry and fear, offering scriptural peace and the reminder that God holds them",
    },
    lonely: {
        label: "Lonely",
        tone: "tender and companionable",
        focus: "remind the reader they are never alone — that Christ himself walked in loneliness and understands",
    },
    angry: {
        label: "Angry",
        tone: "honest and pastoral",
        focus: "validate the emotion without judgment, draw on the lament psalms, and invite the anger to become prayer",
    },
    guilty: {
        label: "Guilty",
        tone: "merciful and healing",
        focus: "speak of God's unconditional mercy, the gift of confession, and the truth that guilt carried to God becomes freedom",
    },
    grieving: {
        label: "Grieving",
        tone: "slow, gentle and compassionate",
        focus: "sit with the reader in their loss, point to Christ's own grief, and offer hope without rushing their pain",
    },
    joyful: {
        label: "Joyful",
        tone: "uplifting and celebratory",
        focus: "channel their joy into praise and invite them to share that joy with others as a form of evangelisation",
    },
    exhausted: {
        label: "Exhausted",
        tone: "restful and unhurried",
        focus: "offer permission to rest, draw on 'Come to me all who are weary', and remind them that God works even in stillness",
    },
    numb: {
        label: "Numb",
        tone: "patient and non-demanding",
        focus: "acknowledge spiritual dryness as a known and named experience in the Church (acedia), and offer a gentle path back without pressure",
    },
    seeking: {
        label: "Seeking answers",
        tone: "curious and intellectually engaging",
        focus: "engage their questions honestly, affirm that doubt can be a form of faith, and point toward the mystery of God",
    },
    struggling: {
        label: "Struggling with faith",
        tone: "honest and non-judgmental",
        focus: "meet them in the struggle, share that saints and Scripture are full of people who wrestled with God, and offer solidarity not solutions",
    },
    deciding: {
        label: "Facing a big decision",
        tone: "grounding and discerning",
        focus: "draw on the Catholic tradition of discernment, invite stillness and prayer, and remind them that God guides those who seek him",
    },
};

// ─────────────────────────────────────────────
//  Strip HTML tags to clean plain text for Claude
// ─────────────────────────────────────────────
function extractPlainText(html) {
    if (!html) return "";
    return html
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, " ")
        .trim();
}

// ─────────────────────────────────────────────
//  Strip markdown code fences just in case
// ─────────────────────────────────────────────
function stripCodeFences(text) {
    return text
        .replace(/^```html\s*/i, "")
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();
}

// ─────────────────────────────────────────────
//  Reflection prompt
// ─────────────────────────────────────────────
function buildReflectionPrompt(mood, language = "English") {
    const meta = moodMeta[mood];
    return `
You are a Catholic priest writing a personalised daily reflection for someone who is feeling ${meta.label.toLowerCase()}.

Tone: ${meta.tone}.
Pastoral goal: ${meta.focus}.

YOUR APPROACH:
1. Begin by acknowledging where they are emotionally — without naming the mood word directly.
2. Find the ONE verse or image from today's scripture that speaks most powerfully into this state.
3. Break that passage open specifically for someone in this condition — not generically.
4. Offer one small, concrete spiritual invitation for today. Not a challenge — an invitation.
5. Close with a short first-person prayer they would actually want to pray right now.

QUALITY STANDARDS:
- Write as if speaking gently to one person, not addressing a congregation.
- Avoid religious clichés ("lean on God", "trust the plan", "everything happens for a reason").
- Use concrete, sensory language where possible.
- Maximum 380 words total.
- Return only raw HTML using the structure below. No markdown, no code fences, no backticks.

HTML STRUCTURE — use this exactly, it must match the general reflection format:

<div>
  <h1>Reflection for [Liturgical Day Name]</h1>

  <p>Dear [name of reader — use "friend" if unsure],</p>

  <p>[Opening paragraph — acknowledge where they are emotionally. Warm and without judgment.]</p>

  <h3>From today's scripture – [Scripture Reference]</h3>
  <blockquote>[The most relevant verse]</blockquote>
  <p>[Break open the scripture for this mood specifically.]</p>

  <h3>Living the Message</h3>
  <p>[One small, concrete spiritual invitation for today.]</p>

  <p style="text-align: center;"><strong>Prayer:</strong> [First-person prayer beginning with "Lord" or "Father".]</p>
</div>

Write in ${language}.
    `.trim();
}

// ─────────────────────────────────────────────
//  Suggested verses prompt
// ─────────────────────────────────────────────
function buildVersesPrompt(mood, language = "English") {
    const meta = moodMeta[mood];
    return `
You are a Catholic scripture guide. Suggest 3 Bible verses for someone who is feeling ${meta.label.toLowerCase()}.

RULES:
- Choose verses that speak directly and pastorally into this emotional state.
- Use only well-known, accurately quoted Catholic Bible verses (NRSV or RSV-CE translation).
- Do not invent or paraphrase verses — quote them exactly as they appear in scripture.
- For each verse provide: the reference, the exact quoted text, and one short sentence (max 15 words) explaining why it speaks to this mood.
- Write the reason in ${language}.
- Return only a valid raw JSON array. No markdown, no code fences, no explanation outside the JSON.

EXACT FORMAT:
[
  {
    "reference": "Psalm 34:18",
    "text": "The Lord is close to the brokenhearted and saves those who are crushed in spirit.",
    "reason": "A reminder that God draws nearest when we feel furthest from him."
  },
  {
    "reference": "Romans 8:38-39",
    "text": "For I am convinced that neither death nor life... will be able to separate us from the love of God.",
    "reason": "Nothing you carry today can separate you from God's love."
  },
  {
    "reference": "Isaiah 41:10",
    "text": "Do not fear, for I am with you; do not be dismayed, for I am your God.",
    "reason": "God's presence is not conditional on how you feel."
  }
]
    `.trim();
}

// ─────────────────────────────────────────────
//  Core generation
// ─────────────────────────────────────────────
async function generateAndCache({
    readingId,
    mood,
    languageId,
    languageLabel,
    reading,
}) {
    const userContent = `
SCRIPTURE READINGS:
${extractPlainText(reading.content)}

STANDARD REFLECTION (use as theological context only — do not copy):
${extractPlainText(reading.summary)}
    `.trim();

    // Run reflection and verse suggestions in parallel
    const [reflectionResponse, versesResponse] = await Promise.all([
        anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1024,
            system: buildReflectionPrompt(mood, languageLabel),
            messages: [{ role: "user", content: userContent }],
        }),
        anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 512,
            system: buildVersesPrompt(mood, languageLabel),
            messages: [{ role: "user", content: `The person is feeling ${moodMeta[mood].label.toLowerCase()}. Suggest 3 Bible verses.` }],
        }),
    ]);

    const content = stripCodeFences(reflectionResponse.content[0].text);

    // Parse suggested verses safely
    let suggestedVerses = [];
    try {
        suggestedVerses = JSON.parse(stripCodeFences(versesResponse.content[0].text));
    } catch (e) {
        console.error("Failed to parse suggested verses JSON:", e.message);
        suggestedVerses = [];
    }

    await PersonalisedReflection.create({
        dailyReading: readingId,
        mood,
        language: languageId,
        content,
        suggestedVerses,
    });

    return { content, suggestedVerses };
}

// ─────────────────────────────────────────────
//  Pre-generate all 12 moods for a reading
//
//  Call from your dailyReading create() after
//  saving both EN and ES records:
//
//  const { pregenerateMoodReflections } = require('./personalisedReflection');
//  pregenerateMoodReflections(savedEN._id, languageIds.english, "English");
//  pregenerateMoodReflections(savedES._id, languageIds.spanish, "Spanish");
// ─────────────────────────────────────────────
async function pregenerateMoodReflections(readingId, languageId, languageLabel) {
    const reading = await DailyReading.findById(readingId);
    if (!reading) {
        console.error(`pregenerateMoodReflections: reading ${readingId} not found`);
        return;
    }

    const moods = Object.keys(moodMeta);

    await Promise.allSettled(
        moods.map(async (mood) => {
            try {
                const exists = await PersonalisedReflection.findOne({
                    dailyReading: readingId,
                    mood,
                    language: languageId,
                });

                if (exists) return;

                await generateAndCache({
                    readingId,
                    mood,
                    languageId,
                    languageLabel,
                    reading,
                });

                console.log(`✅ Pre-generated: ${mood} (${languageLabel})`);
            } catch (err) {
                console.error(`❌ Pre-generation failed for mood "${mood}": ${err.message}`);
            }
        })
    );
}

// ─────────────────────────────────────────────
//  Controller
// ─────────────────────────────────────────────
module.exports = {
    pregenerateMoodReflections,

    // POST /api/daily-reading/personalised-reflection
    // Body: { readingId, mood, code }
    getPersonalisedReflection: async (req, res) => {
        try {
            const { readingId, mood, code } = req.body;

            // ── 1. Validate mood ──────────────────────
            if (!moodMeta[mood]) {
                return res
                    .status(400)
                    .json({ error: true, message: "Invalid mood key." });
            }

            // ── 2. Resolve language ───────────────────
            const language = await Language.findOne({ code: code.toString() });
            if (!language) {
                return res
                    .status(400)
                    .json({ error: true, message: "Language not found." });
            }

            // ── 3. Return from cache if available ─────
            const cached = await PersonalisedReflection.findOne({
                dailyReading: readingId,
                mood,
                language: language._id,
            });

            if (cached) {
                return res.status(OK).json({
                    content: cached.content,
                    suggestedVerses: cached.suggestedVerses || [],
                    cached: true,
                });
            }

            // ── 4. Fetch the source reading ───────────
            const reading = await DailyReading.findById(readingId);
            if (!reading) {
                return res
                    .status(404)
                    .json({ error: true, message: "Reading not found." });
            }

            // ── 5. Generate, cache and return ─────────
            const languageLabel =
                language.name || (code === "es" ? "Spanish" : "English");

            const { content, suggestedVerses } = await generateAndCache({
                readingId,
                mood,
                languageId: language._id,
                languageLabel,
                reading,
            });

            return res.status(OK).json({ content, suggestedVerses, cached: false });

        } catch (err) {
            console.error("personalised reflection error:", err.message);
            return res
                .status(SERVER_ERROR)
                .json({ error: true, message: "Internal Server Error" });
        }
    },
};