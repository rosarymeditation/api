const PersonalisedReflection = require("../models/PersonalisedReflection");
const DailyReading = require("../models/dailyReading");
const Language = require("../models/language");
const Anthropic = require("@anthropic-ai/sdk");
const { SERVER_ERROR, OK } = require("../errors/statusCode");

const anthropic = new Anthropic({ apiKey: process.env.ANTROPIC_API_KEY });

// ─────────────────────────────────────────────
//  Mood metadata — English base
// ─────────────────────────────────────────────
const moodMeta = {
    grateful: {
        label: "Grateful",
        labelEs: "agradecido",
        tone: "warm and celebratory",
        toneEs: "cálido y celebratorio",
        focus: "invite the reader to deepen their gratitude and see God's hand in everyday blessings",
        focusEs: "invitar al lector a profundizar su gratitud y ver la mano de Dios en las bendiciones cotidianas",
    },
    anxious: {
        label: "Anxious",
        labelEs: "ansioso",
        tone: "gentle and reassuring",
        toneEs: "gentil y tranquilizador",
        focus: "speak directly to worry and fear, offering scriptural peace and the reminder that God holds them",
        focusEs: "hablar directamente a la preocupación y el miedo, ofreciendo paz escritural y el recordatorio de que Dios los sostiene",
    },
    lonely: {
        label: "Lonely",
        labelEs: "solo",
        tone: "tender and companionable",
        toneEs: "tierno y acompañante",
        focus: "remind the reader they are never alone — that Christ himself walked in loneliness and understands",
        focusEs: "recordar al lector que nunca está solo — que el mismo Cristo caminó en soledad y comprende",
    },
    angry: {
        label: "Angry",
        labelEs: "enojado",
        tone: "honest and pastoral",
        toneEs: "honesto y pastoral",
        focus: "validate the emotion without judgment, draw on the lament psalms, and invite the anger to become prayer",
        focusEs: "validar la emoción sin juzgar, recurrir a los salmos de lamento e invitar a que la ira se convierta en oración",
    },
    guilty: {
        label: "Guilty",
        labelEs: "culpable",
        tone: "merciful and healing",
        toneEs: "misericordioso y sanador",
        focus: "speak of God's unconditional mercy, the gift of confession, and the truth that guilt carried to God becomes freedom",
        focusEs: "hablar de la misericordia incondicional de Dios, el don de la confesión y la verdad de que la culpa llevada a Dios se convierte en libertad",
    },
    grieving: {
        label: "Grieving",
        labelEs: "en duelo",
        tone: "slow, gentle and compassionate",
        toneEs: "pausado, gentil y compasivo",
        focus: "sit with the reader in their loss, point to Christ's own grief, and offer hope without rushing their pain",
        focusEs: "acompañar al lector en su pérdida, señalar el propio dolor de Cristo y ofrecer esperanza sin apresurar su dolor",
    },
    joyful: {
        label: "Joyful",
        labelEs: "alegre",
        tone: "uplifting and celebratory",
        toneEs: "edificante y celebratorio",
        focus: "channel their joy into praise and invite them to share that joy with others as a form of evangelisation",
        focusEs: "encauzar su alegría en alabanza e invitarlos a compartir esa alegría con otros como forma de evangelización",
    },
    exhausted: {
        label: "Exhausted",
        labelEs: "agotado",
        tone: "restful and unhurried",
        toneEs: "reposado y sin prisa",
        focus: "offer permission to rest, draw on 'Come to me all who are weary', and remind them that God works even in stillness",
        focusEs: "ofrecer permiso para descansar, recurrir a 'Venid a mí todos los que estáis cansados' y recordar que Dios actúa incluso en el silencio",
    },
    numb: {
        label: "Anxiety",
        labelEs: "Ansiedad",
        tone: "gentle and grounding",
        toneEs: "gentil y estabilizador",
        focus: "acknowledge the racing thoughts and physical tension anxiety brings, offer breathing room through scripture, and remind them that 'do not be anxious' is always paired with 'I am with you'",
        focusEs: "reconocer los pensamientos acelerados y la tensión física que trae la ansiedad, ofrecer espacio a través de la escritura y recordar que 'no te angusties' siempre va acompañado de 'estoy contigo'",
    },
    seeking: {
        label: "Seeking answers",
        labelEs: "buscando respuestas",
        tone: "curious and intellectually engaging",
        toneEs: "curioso e intelectualmente estimulante",
        focus: "engage their questions honestly, affirm that doubt can be a form of faith, and point toward the mystery of God",
        focusEs: "abordar sus preguntas con honestidad, afirmar que la duda puede ser una forma de fe y señalar hacia el misterio de Dios",
    },
    struggling: {
        label: "Struggling with faith",
        labelEs: "luchando con la fe",
        tone: "honest and non-judgmental",
        toneEs: "honesto y sin juicios",
        focus: "meet them in the struggle, share that saints and Scripture are full of people who wrestled with God, and offer solidarity not solutions",
        focusEs: "acompañarlos en la lucha, compartir que los santos y la Escritura están llenos de personas que lucharon con Dios y ofrecer solidaridad, no soluciones",
    },
    deciding: {
        label: "Facing a big decision",
        labelEs: "ante una decisión importante",
        tone: "grounding and discerning",
        toneEs: "estabilizador y discernidor",
        focus: "draw on the Catholic tradition of discernment, invite stillness and prayer, and remind them that God guides those who seek him",
        focusEs: "recurrir a la tradición católica del discernimiento, invitar al silencio y la oración y recordar que Dios guía a quienes lo buscan",
    },
};

// ─────────────────────────────────────────────
//  Resolve language label from code
// ─────────────────────────────────────────────
function resolveLanguageLabel(code, languageName) {
    if (languageName) return languageName;
    const map = {
        es: "Spanish",
        "1": "Spanish",
        1: "Spanish",
        en: "English",
        "0": "English",
        0: "English",
    };
    return map[code] ?? "English";
}

function isSpanish(languageLabel) {
    return languageLabel.toLowerCase().includes("spanish") ||
        languageLabel.toLowerCase().includes("español");
}

// ─────────────────────────────────────────────
//  Strip HTML tags to clean plain text
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
//  Strip markdown code fences
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
//  Reflection prompt — fully bilingual
// ─────────────────────────────────────────────
function buildReflectionPrompt(mood, languageLabel = "English") {
    const meta = moodMeta[mood];
    const es = isSpanish(languageLabel);
    const label = es ? meta.labelEs : meta.label.toLowerCase();
    const tone = es ? meta.toneEs : meta.tone;
    const focus = es ? meta.focusEs : meta.focus;

    if (es) {
        return `
Eres un sacerdote católico escribiendo una reflexión diaria personalizada para alguien que se siente ${label}.

Tono: ${tone}.
Objetivo pastoral: ${focus}.

TU ENFOQUE:
1. Comienza reconociendo dónde se encuentra emocionalmente — sin nombrar directamente el estado de ánimo.
2. Encuentra el UNO versículo o imagen de las escrituras de hoy que hable con más fuerza a este estado.
3. Abre ese pasaje específicamente para alguien en esta condición — no de forma genérica.
4. Ofrece una pequeña invitación espiritual concreta para hoy. No un desafío — una invitación.
5. Cierra con una oración breve en primera persona que realmente quisieran rezar ahora mismo.

ESTÁNDARES DE CALIDAD:
- Escribe como si hablaras suavemente a una sola persona, no a una congregación.
- Evita clichés religiosos ("apóyate en Dios", "confía en el plan", "todo pasa por algo").
- Usa lenguaje concreto y sensorial cuando sea posible.
- Máximo 380 palabras en total.
- Devuelve solo HTML sin formato. Sin markdown, sin bloques de código, sin comillas invertidas.

ESTRUCTURA HTML — úsala exactamente, debe coincidir con el formato de reflexión general:

<div>
  <h1>Reflexión para [Nombre del Día Litúrgico]</h1>

  <p>Querido amigo,</p>

  <p>[Párrafo de apertura — reconoce dónde se encuentra emocionalmente. Cálido y sin juicios.]</p>

  <h3>De la escritura de hoy – [Referencia Bíblica]</h3>
  <blockquote>[El versículo más relevante]</blockquote>
  <p>[Abre la escritura específicamente para este estado de ánimo.]</p>

  <h3>Viviendo el Mensaje</h3>
  <p>[Una pequeña invitación espiritual concreta para hoy.]</p>

  <p style="text-align: center;"><strong>Oración:</strong> [Oración en primera persona que comience con "Señor" o "Padre".]</p>
</div>

Escribe en Español.
        `.trim();
    }

    return `
You are a Catholic priest writing a personalised daily reflection for someone who is feeling ${label}.

Tone: ${tone}.
Pastoral goal: ${focus}.

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

  <p>Dear friend,</p>

  <p>[Opening paragraph — acknowledge where they are emotionally. Warm and without judgment.]</p>

  <h3>From today's scripture – [Scripture Reference]</h3>
  <blockquote>[The most relevant verse]</blockquote>
  <p>[Break open the scripture for this mood specifically.]</p>

  <h3>Living the Message</h3>
  <p>[One small, concrete spiritual invitation for today.]</p>

  <p style="text-align: center;"><strong>Prayer:</strong> [First-person prayer beginning with "Lord" or "Father".]</p>
</div>

Write in English.
    `.trim();
}

// ─────────────────────────────────────────────
//  Suggested verses prompt — fully bilingual
// ─────────────────────────────────────────────
function buildVersesPrompt(mood, languageLabel = "English") {
    const meta = moodMeta[mood];
    const es = isSpanish(languageLabel);
    const label = es ? meta.labelEs : meta.label.toLowerCase();

    if (es) {
        return `
Eres un guía de las Escrituras católico. Sugiere 3 versículos bíblicos para alguien que se siente ${label}.

REGLAS:
- Elige versículos que hablen directa y pastoralmente a este estado emocional.
- Usa solo versículos bíblicos católicos bien conocidos y citados con precisión (traducción NRSV o RSV-CE).
- No inventes ni parafrasees versículos — cítalos exactamente como aparecen en las Escrituras.
- Para cada versículo proporciona: la referencia, el texto exacto citado y una oración corta (máx. 15 palabras) explicando por qué habla a este estado de ánimo.
- Escribe la razón en Español.
- Devuelve solo un array JSON válido sin formato. Sin markdown, sin bloques de código, sin explicación fuera del JSON.

FORMATO EXACTO:
[
  {
    "reference": "Salmo 34:18",
    "text": "El Señor está cerca de los que tienen el corazón quebrantado y salva a los de espíritu abatido.",
    "reason": "Un recordatorio de que Dios se acerca más cuando nos sentimos más lejos de él."
  },
  {
    "reference": "Romanos 8:38-39",
    "text": "Estoy convencido de que ni la muerte ni la vida... podrán separarnos del amor de Dios.",
    "reason": "Nada de lo que cargas hoy puede separarte del amor de Dios."
  },
  {
    "reference": "Isaías 41:10",
    "text": "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios.",
    "reason": "La presencia de Dios no depende de cómo te sientes."
  }
]
        `.trim();
    }

    return `
You are a Catholic scripture guide. Suggest 3 Bible verses for someone who is feeling ${label}.

RULES:
- Choose verses that speak directly and pastorally into this emotional state.
- Use only well-known, accurately quoted Catholic Bible verses (NRSV or RSV-CE translation).
- Do not invent or paraphrase verses — quote them exactly as they appear in scripture.
- For each verse provide: the reference, the exact quoted text, and one short sentence (max 15 words) explaining why it speaks to this mood.
- Write the reason in English.
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
    const es = isSpanish(languageLabel);

    const userContent = `
${es ? "LECTURAS DE LAS ESCRITURAS:" : "SCRIPTURE READINGS:"}
${extractPlainText(reading.content)}

${es
            ? "REFLEXIÓN ESTÁNDAR (usar solo como contexto teológico — no copiar):"
            : "STANDARD REFLECTION (use as theological context only — do not copy):"}
${extractPlainText(reading.summary)}
    `.trim();

    const moodLabelForPrompt = es
        ? moodMeta[mood].labelEs
        : moodMeta[mood].label.toLowerCase();

    const versesUserMessage = es
        ? `La persona se siente ${moodLabelForPrompt}. Sugiere 3 versículos bíblicos.`
        : `The person is feeling ${moodLabelForPrompt}. Suggest 3 Bible verses.`;

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
            messages: [{ role: "user", content: versesUserMessage }],
        }),
    ]);

    const content = stripCodeFences(reflectionResponse.content[0].text);

    let suggestedVerses = [];
    try {
        suggestedVerses = JSON.parse(
            stripCodeFences(versesResponse.content[0].text)
        );
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
        console.error(
            `pregenerateMoodReflections: reading ${readingId} not found`
        );
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
                console.error(
                    `❌ Pre-generation failed for mood "${mood}": ${err.message}`
                );
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
            const languageLabel = resolveLanguageLabel(code, language.name);

            const { content, suggestedVerses } = await generateAndCache({
                readingId,
                mood,
                languageId: language._id,
                languageLabel,
                reading,
            });

            return res
                .status(OK)
                .json({ content, suggestedVerses, cached: false });

        } catch (err) {
            console.error("personalised reflection error:", err.message);
            return res
                .status(SERVER_ERROR)
                .json({ error: true, message: "Internal Server Error" });
        }
    },
};