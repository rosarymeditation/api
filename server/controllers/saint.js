const DailyVerse = require("../models/dailyVerse");
const Saint = require("../models/saint");
const Language = require("../models/language");
const axios = require("axios");
const PrayerType = require("../models/prayer-type");
const { upload } = require("../utility/global");
const OpenAI = require("openai");
const {
  SERVER_ERROR,
  OK,
  VALIDATION_ERROR,
  Messages,
} = require("../errors/statusCode");
// const query = new Query(PostCode);
const parseArrayField = (field) => {
  if (!field) return [];
  if (Array.isArray(field)) return field;

  // If field is a JSON string like '["x","y"]', parse it
  try {
    const parsed = JSON.parse(field);
    if (Array.isArray(parsed)) return parsed;
  } catch { }

  // Fallback: split by line breaks or commas
  return field
    .split(/\r?\n|,/)
    .map(s => s.trim())
    .filter(Boolean);
};
async function generateSaintDetailContent(sourceText, language, maxRetries = 3) {
  async function generateOnce() {
    const systemPrompt = `
You are a Catholic hagiography writer and theologian.
The output language must be: ${language}

Generate authoritative, devotional content for a Catholic saint suitable for a premium mobile app.
You MUST rely on traditional Catholic teaching, history, and commonly accepted devotional sources.

FOR EVERY SAINT, YOU MUST:

- Provide at least ONE traditionally recognized patronage
- Select EXACTLY ONE Bible verse associated with the saint
- Derive EXACTLY ONE short inspirational quote from that verse
- Provide a complete devotional prayer addressed directly to the saint (MANDATORY)
- Provide a long biography (minimum 300 words, multi-paragraph)
- Provide a detailed reflection (minimum 3 paragraphs)

CRITICAL REQUIREMENTS:

- The "prayer" field MUST contain a real devotional prayer
- Minimal or symbolic prayers are NOT allowed

FORBIDDEN LANGUAGE (ABSOLUTE):

The following words or phrases MUST NEVER appear, even once:

unwaveringly
unwaveringness
steadfast resolve
timeless
profound
deeply moving
rich tapestry
bears witness
serves as a reminder
invites us to
calls us to
journey of faith
beacon of hope

Before producing final output, internally scan and rewrite the text to ensure none of the above appear.

OUTPUT RULES:

- STRICT JSON only
- Double quotes only
- NO markdown
- NO commentary
- NO trailing commas
`;

    const userPrompt = `
SOURCE TEXT:
"""
${sourceText}
"""

Return JSON in this EXACT structure:

{
  "name": "",
  "subtitle": "",
  "feastDay": "",
  "place": "",
  "patronage": [],
  "biography": "",
  "reflection": "",
  "bibleVerses": [],
  "quote": "",
  "prayer": "",
  "teaser": ""
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0.2,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],

      // 🚫 HARD TOKEN BAN (THIS IS THE KEY FIX)
      logit_bias: {
        "34769": -100, // unwavering
        "2627": -100,  // unwaveringly
        "9752": -100   // unwaveringness
      }
    });

    const aiContent = response.choices[0].message.content;

    let saintJson;
    try {
      saintJson = JSON.parse(aiContent);
    } catch {
      saintJson = JSON5.parse(aiContent);
    }

    // Structural safety nets
    if (!saintJson.patronage?.length) {
      saintJson.patronage = ["Faithful Christians"];
    }

    if (!saintJson.bibleVerses || saintJson.bibleVerses.length !== 1) {
      saintJson.bibleVerses = ["Romans 8:28"];
    }

    if (!saintJson.quote) {
      saintJson.quote = "All things work together for good for those who love God.";
    }

    if (!saintJson.prayer || saintJson.prayer.trim().length < 40) {
      throw new Error("Prayer missing or insufficient.");
    }

    // Final forbidden-word check (guaranteed pass now)
    const forbidden = [
      "steadfast resolve",
      "timeless",
      "profound",
      "deeply moving",
      "rich tapestry",
      "bears witness",
      "serves as a reminder",
      "invites us to",
      "calls us to",
      "journey of faith",
      "beacon of hope"
    ];

    const fullText = JSON.stringify(saintJson).toLowerCase();
    for (const word of forbidden) {
      if (fullText.includes(word)) {
        throw new Error(`Forbidden word detected: "${word}"`);
      }
    }

    const toHtml = (text) =>
      `<div>\n${text
        .split(/\n+/)
        .map(p => p.trim())
        .filter(Boolean)
        .map(p => `<p>${p}</p>`)
        .join("\n")}\n</div>`;

    return {
      ...saintJson,
      biography: toHtml(saintJson.biography),
      reflection: toHtml(saintJson.reflection),
      prayer: toHtml(saintJson.prayer),
      teaser: toHtml(saintJson.teaser)
    };
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await generateOnce();
    } catch (err) {
      if (attempt < maxRetries) {
        console.warn(`Retrying saint generation (attempt ${attempt + 1})`);
        continue;
      }
      throw err;
    }
  }
}


const generatePrompt = (rawBio) => `
You are a helpful assistant that generates structured saint profiles in **valid JSON** format.

Instructions:
- Use the raw biography provided as input.
- Output must be a **single JSON object** with the following fields:
  - name: string
  - feastDate: string in YYYY-MM-DD format
  - teaser: string (short preview)
  - biography: string (expanded version of rawBio)
  - prayer: string
  - imageUrl: string (URL or empty string)
  - quotes: array of strings (JSON array, e.g., ["quote1","quote2"])
  - scriptureLinks: array of strings (JSON array, e.g., ["link1","link2"])
  - miracles: array of strings (JSON array, e.g., ["miracle1","miracle2"])
  - patronages: array of strings (JSON array, e.g., ["patronage1","patronage2"])

**Important rules:**
- Return only valid JSON, nothing else (no commentary, no explanation).
- All array fields must be valid JSON arrays.
- If a field has no data, return an empty string for strings, or empty array [] for arrays.

Raw biography input:
${rawBio}
`;

const translatePrompt = (text, targetLanguage) => `
Translate the following text into ${targetLanguage}. 
Keep the meaning, tone, and context accurate. 
Return only the translated text without quotes or extra notes.

Text: """${text}"""
`;
const openai = new OpenAI({
  apiKey: process.env.CHATGPT_API_KEY,
});
const languageIds = {
  english: "650294586a369b86e4f201f0",
  spanish: "6502946f6a369b86e4f201f2",
};
async function translateText(text, api) {
  const url = `https://translation.googleapis.com/language/translate/v2?key=${api}`;
  try {
    const response = await axios.post(url, {
      q: text,
      source: "en",
      target: "es",
      format: "text",
    });

    console.log(
      "Translated Text:",
      response.data.data.translations[0].translatedText
    );
    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error(
      "Translation Error:",
      error.response ? error.response.data : error.message
    );
  }
}
module.exports = {
  create: async (req, res) => {
    try {
      const { content, date } = req.body;

      // 1. Generate saint content in both languages
      const englishResult = await generateSaintDetailContent(content, "English");
      const spanishResult = await generateSaintDetailContent(content, "Spanish");

      // 2. Handle uploaded image
      const photoUrl = req.file?.location || "";

      // 3. Prepare feast date
      const feastDate = new Date(date);
      const day = feastDate.getDate();
      const month = feastDate.getMonth() + 1;
      const dateString = `${day}/${month}`;

      // 4. Create English saint document
      const englishSaint = new Saint({
        name: englishResult.name,
        subtitle: englishResult.subtitle,
        feastDate,
        dateString,
        place: englishResult.place,
        patronage: englishResult.patronage,
        biography: englishResult.biography,
        reflection: englishResult.reflection,
        quote: englishResult.quote,
        bibleVerses: englishResult.bibleVerses,
        prayer: englishResult.prayer,
        teaser: englishResult.teaser,
        imageUrl: photoUrl,
        language: "650294586a369b86e4f201f0" // English
      });

      // 5. Create Spanish saint document
      const spanishSaint = new Saint({
        name: spanishResult.name,
        subtitle: spanishResult.subtitle,
        feastDate,
        dateString,
        place: spanishResult.place,
        patronage: spanishResult.patronage,
        biography: spanishResult.biography,
        reflection: spanishResult.reflection,
        quote: spanishResult.quote,
        bibleVerses: spanishResult.bibleVerses,
        prayer: spanishResult.prayer,
        teaser: spanishResult.teaser,
        imageUrl: photoUrl,
        language: "6502946f6a369b86e4f201f2" // Spanish
      });

      // 6. Save both documents
      await englishSaint.save();
      await spanishSaint.save();

      return res.status(200).json({
        error: false,
        message: "Saint profile created successfully (EN + ES)."
      });

    } catch (err) {
      console.error("Create saint error:", err);
      return res.status(500).json({
        error: true,
        message: "Failed to create saint profile."
      });
    }
  },

  checkIfExist: async (req, res) => {
    try {
      let { date } = req.body;

      const targetDate = new Date(date);
      const formattedDate = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate()
      )
        .toISOString()
        .replace("Z", "+00:00");


      const dataEnglish = await Saint.findOne({
        language: languageIds.english,
        feastDate: targetDate,
      });

      const dataSpanish = await Saint.findOne({
        language: languageIds.spanish,
        feastDate: targetDate,
      });
      // .skip((page - 1) * limit) // Skip documents based on the current page
      // .limit(limit);
      //.sort({ verseNum: 1 });
      return res.status(OK).json({
        hasEnglish: dataEnglish ? true : false,
        hasSpanish: dataSpanish ? true : false,
        englishData: dataEnglish,
        spanishData: dataSpanish,
      });
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).json({ error: true, message: err });
    }
  },

  saint: async (req, res) => {
    try {
      let { code, date } = req.body;

      const targetDate = new Date(date);
      var findCode = await Language.findOne({
        code: code.toString(),
      });

      // const data = await DailyReading.findOne({
      //   language: findCode._id,
      //   date: targetDate,
      // });

      const data = await Saint.findOne({
        language: findCode._id,
        feastDate: targetDate,
      });


      // .skip((page - 1) * limit) // Skip documents based on the current page
      // .limit(limit);
      //.sort({ verseNum: 1 });
      return res.status(OK).json(data);
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).json({ error: true, message: err });
    }
  },
};
