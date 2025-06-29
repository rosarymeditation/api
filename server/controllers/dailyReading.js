const DailyReading = require("../models/dailyReading");
const Language = require("../models/language");
const { upload } = require("../utility/global");
const OpenAI = require("openai");
const axios = require("axios");
const AWS = require("aws-sdk");
const os = require("os");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");

const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
const s3 = new AWS.S3({
  accessKeyId: process.env.S3ACCESSKEY, // set in .env
  secretAccessKey: process.env.S3SECRETKEY, // set in .env
  region: "eu-west-2",
});

require("dotenv").config();

//const CHATGPT_API_KEY = process.env.CHATGPT_API_KEY;
const openai = new OpenAI({
  apiKey: process.env.CHATGPT_API_KEY,
});
const {
  SERVER_ERROR,
  OK,
  VALIDATION_ERROR,
  Messages,
} = require("../errors/statusCode");
const languageIds = {
  english: "650294586a369b86e4f201f0",
  spanish: "6502946f6a369b86e4f201f2",
};
const systemPromptEnglish = `
You are a formatting assistant. Your task is to format daily scripture readings using the exact HTML structure shown below.

⚠️ DO NOT change, reword, paraphrase, summarize, or omit any part of the input text.
✅ DO preserve **all original words exactly as received** — even punctuation and line breaks.
✅ DO wrap each verse or paragraph in its own <p> tag.
✅ Insert scripture titles, lectionary numbers, and references into the correct tags.

Only format — do not interpret or edit.

The required HTML format is:

<div>
    <h2>[Day Title]</h2>
    <h3>[Reading Cycle Info]</h3>
    <h3>Lectionary: [Lectionary Number]</h3>

    <h4>Reading One</h4>
    <p><strong>[Reading I Reference]</strong></p>
    <p>[Reading 1 Text - one verse per <p>]</p>

    <h4>Responsorial Psalm</h4>
    <p><strong>[Psalm Reference]</strong></p>
    <p><strong>Response</strong> [Psalm Response]</p>
    <p>[Psalm Verse 1]</p>
    <p>[Psalm Verse 2]</p>
    ...

    <h4>Reading Two</h4>
    <p><strong>[Reading II Reference]</strong></p>
    <p>[Reading II Text]</p>

    <h4>Verse Before the Gospel</h4>
    <p><strong>[Verse Reference]</strong></p>
    <p><strong>Response</strong> [Verse Text]</p>

    <h4>Gospel</h4>
    <p><strong>[Gospel Reference]</strong></p>
    <p>[Gospel Text - each verse in its own <p> tag]</p>
</div>
`;
const systemPromptSpanish = `
Eres un asistente de formato. Tu tarea es dar formato a las lecturas bíblicas diarias usando la estructura HTML exacta que se muestra a continuación.

⚠️ NO debes cambiar, reformular, parafrasear, resumir ni omitir ninguna parte del texto recibido.
✅ Debes conservar **todas las palabras exactamente como están dadas**, incluyendo puntuación y saltos de línea.
✅ Cada versículo o párrafo debe ir dentro de su propia etiqueta <p>.
✅ Inserta los títulos, números del leccionario y referencias en las etiquetas correctas.

Solo debes dar formato — no interpretes ni edites.

El formato HTML requerido es:

<div>
    <h2>[Título del día]</h2>
    <h3>[Información del ciclo de lectura]</h3>
    <h3>Leccionario: [Número del leccionario]</h3>

    <h4>Primera Lectura</h4>
    <p><strong>[Referencia de la primera lectura]</strong></p>
    <p>[Texto de la primera lectura - un versículo por etiqueta <p>]</p>

    <h4>Salmo Responsorial</h4>
    <p><strong>[Referencia del salmo]</strong></p>
    <p><strong>Respuesta</strong> [Respuesta del salmo]</p>
    <p>[Versículo 1 del salmo]</p>
    <p>[Versículo 2 del salmo]</p>
    ...

    <h4>Segunda Lectura</h4>
    <p><strong>[Referencia de la segunda lectura]</strong></p>
    <p>[Texto de la segunda lectura]</p>

    <h4>Aclamación antes del Evangelio</h4>
    <p><strong>[Referencia de la aclamación]</strong></p>
    <p><strong>Respuesta</strong> [Texto de la aclamación]</p>

    <h4>Evangelio</h4>
    <p><strong>[Referencia del Evangelio]</strong></p>
    <p>[Texto del Evangelio - cada versículo en su propia etiqueta <p>]</p>
</div>
`;
const reflectionPromptEN = `
You are a Catholic priest writing a daily reflection on the Scripture readings. Use a pastoral tone, engaging the reader personally, as if speaking directly during a homily. Do not summarize only—invite the reader into a real-life application of the readings.

Use the following HTML format to structure the reflection. Keep it interactive, spiritual, and applicable to daily life. Include rhetorical questions and relatable examples. Each section should draw from the reading, bring spiritual insight, and end with a call to reflection or action.

IMPORTANT: Only include sections for readings that are present in the input. If a Second Reading is not included in the user input, do not include a header or section for it. Do not write "Not applicable today" — omit the section entirely.

Use this HTML structure:

<div>
  <h1>Reflection for [Liturgical Day Name]</h1>

  <p>Dear brothers and sisters in Christ,</p>

  <p>[Opening greeting with a warm, reflective tone and how today’s readings speak to everyday life.]</p>

  <h3>First Reading – [Scripture Reference]</h3>
  <p>[Reflection on the first reading, with real-life examples or relatable insight. Include 1–2 questions to invite self-examination.]</p>

  <h3>Responsorial Psalm – [Psalm Reference]</h3>
  <p>[Reflection on the theme of the psalm. Highlight emotional or spiritual truths. Ask: How do we relate to this in prayer or suffering?]</p>

  <!-- OMIT this section if Second Reading is not provided -->
  <h3>Second Reading – [Scripture Reference]</h3>
  <p>[Highlight how the second reading challenges or affirms the Christian life. Use encouragement, clarity, and real-world connection.]</p>

  <h3>Gospel – [Gospel Reference]</h3>
  <p>[Break open the Gospel using storytelling or vivid imagery. Refer to Christ’s message directly and invite the reader to encounter Him personally.]</p>

  <h3>Living the Message</h3>
  <p>[Offer 2–3 practical questions or challenges. Invite the reader to act, pray, or change something concrete this week.]</p>

  <p style="text-align: center;"><strong>Prayer:</strong> [Write a heartfelt closing prayer asking God for guidance, courage, and to live out today’s message. Use "Lord Jesus" or "Heavenly Father" to begin.]</p>
</div>
`;
const reflectionPromptES = `
Eres un sacerdote católico que escribe una reflexión diaria sobre las lecturas bíblicas. Usa un tono pastoral, cercano y espiritual, como si estuvieras dando una homilía durante la Misa. No te limites a resumir: invita al lector a aplicar la Palabra a su vida cotidiana.

Usa el siguiente formato HTML para estructurar la reflexión. Hazla interactiva, con ejemplos reales, preguntas para el lector y una conclusión práctica. Cada sección debe basarse en la lectura correspondiente y terminar con una llamada a la acción o a la oración.

IMPORTANTE: Solo incluye secciones de lecturas que estén presentes en el texto proporcionado. Si no hay Segunda Lectura, omite completamente esa sección. No escribas “No aplica hoy”.

Utiliza esta estructura:

<div>
  <h1>Reflexión para [Nombre del Día Litúrgico]</h1>

  <p>Queridos hermanos y hermanas en Cristo,</p>

  <p>[Saludo inicial cálido, conectando las lecturas con la vida diaria.]</p>

  <h3>Primera Lectura – [Referencia Bíblica]</h3>
  <p>[Reflexión con ejemplos de la vida real. Añade 1–2 preguntas que inviten a la introspección personal.]</p>

  <h3>Salmo Responsorial – [Referencia del Salmo]</h3>
  <p>[Expón el valor emocional o espiritual del salmo. ¿Cómo se relaciona con nuestro sufrimiento o nuestra oración?]</p>

  <!-- OMITIR esta sección si no se proporciona Segunda Lectura -->
  <h3>Segunda Lectura – [Referencia Bíblica]</h3>
  <p>[Conecta esta lectura con la vida cristiana práctica. Usa un lenguaje claro, esperanzador y aplicable.]</p>

  <h3>Evangelio – [Referencia del Evangelio]</h3>
  <p>[Desarrolla el Evangelio con imágenes vivas o narrativa pastoral. Habla directamente del mensaje de Jesús. Hazlo personal.]</p>

  <h3>Viviendo el Mensaje</h3>
  <p>[Ofrece 2–3 preguntas prácticas o desafíos concretos. Anima al lector a actuar, orar o cambiar algo esta semana.]</p>

  <p style="text-align: center;"><strong>Oración:</strong> [Escribe una oración final sincera pidiendo ayuda a Dios para vivir el mensaje del día. Empieza con "Señor Jesús" o "Padre celestial".]</p>
</div>
`;
const translationPrompt = (language) => `
You are a translation assistant. Translate the following text into ${language}. 
- Keep the meaning and tone as close to the original as possible. 
- Do not summarize or omit any part of the content. 
- If the original text contains proper nouns (names, places, etc.), do not translate them.
- Preserve paragraph structure.

Text to translate:
`;
// const query = new Query(PostCode);
// async function getDailyReadings(date, language) {
//   const messages = [
//     {
//       role: "system",
//       content: "You are an assistant providing Catholic daily readings.",
//     },
//     {
//       role: "user",
//       content: `Generate full Catholic daily readings for ${date} in ${language}.Only provide the content,using the most acceptable format known as the "Daily Readings" format.`,
//     },
//   ];

//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo", // Ensure the correct model name
//       messages: messages,
//       temperature: 1,
//       max_tokens: 1000,
//       top_p: 1,
//       frequency_penalty: 0,
//       presence_penalty: 0,
//     });

//     // Extract the content from the response
//     const content = response.choices[0].message.content.trim();
//     return content;
//   } catch (error) {
//     console.error(
//       "Error fetching daily readings:",
//       error.response ? error.response.data : error.message
//     );
//     return null;
//   }
// }
function cleanLiturgicalText(text) {
  return text
    .split("\n")
    .map((line) => {
      const noHtml = line.replace(/<[^>]*>/g, ""); // Remove HTML tags
      const trimmed = noHtml.trim();

      // Remove liturgical response indicators
      if (/^R\.\s*/.test(trimmed)) return trimmed.replace(/^R\.\s*/, "");
      if (/^V\.\s*/.test(trimmed)) return trimmed.replace(/^V\.\s*/, "");

      return trimmed;
    })
    .filter(Boolean)
    .join(" ");
}
function splitText(text, maxChars = 4000) {
  const paras = text.split(/\r?\n\s*\r?\n/); // Split by paragraphs
  const chunks = [];
  let buf = "";
  for (const p of paras) {
    const candidate = buf ? buf + "\n\n" + p : p; // Try to add paragraph to buffer
    if (candidate.length > maxChars) {
      // If the candidate exceeds the limit, push the current buffer and reset
      if (buf) {
        chunks.push(buf);
        buf = p; // Start new chunk with current paragraph
      } else {
        // Single paragraph too big → slice it into chunks
        for (let i = 0; i < p.length; i += maxChars) {
          chunks.push(p.slice(i, i + maxChars));
        }
        buf = "";
      }
    } else {
      buf = candidate; // Add the paragraph to the buffer
    }
  }

  // Add the remaining buffer as a final chunk
  if (buf) chunks.push(buf);
  return chunks;
}
// function splitText(text, maxChars = 4000) {
//   const paras = text.split(/\r?\n\s*\r?\n/);
//   const chunks = [];
//   let buf = "";
//   for (const p of paras) {
//     const candidate = buf ? buf + "\n\n" + p : p;
//     if (candidate.length > maxChars) {
//       if (buf) {
//         chunks.push(buf);
//         buf = p;
//       } else {
//         // single paragraph too big → slice it
//         for (let i = 0; i < p.length; i += maxChars) {
//           chunks.push(p.slice(i, i + maxChars));
//         }
//         buf = "";
//       }
//     } else {
//       buf = candidate;
//     }
//   }
//   if (buf) chunks.push(buf);
//   return chunks;
// }
async function generateSpeechAAC(
  text,
  voice = "nova", // Specify voice here (e.g., "nova" or others)
  fileName = "output.aac"
) {
  const cleanText = cleanLiturgicalText(text); // Clean text from any HTML tags or unwanted characters
  const chunks = splitText(cleanText, 4000); // Split the text into manageable chunks
  const tempMp3Files = [];

  try {
    // Step 1: Generate one MP3 per chunk
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const resp = await axios({
        method: "post",
        url: "https://api.openai.com/v1/audio/speech", // Using OpenAI's TTS API (adjust if using a different service)
        headers: {
          Authorization: `Bearer ${process.env.CHATGPT_API_KEY}`, // Ensure to pass the API key here
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer", // Get audio as a binary response
        data: {
          model: "tts-1", // Ensure this is the correct model for text-to-speech
          input: chunk, // The chunk of text to process
          voice: voice, // Voice option for TTS
        },
      });

      const mp3Path = path.join(os.tmpdir(), `tts_${uuidv4()}_${i}.mp3`); // Store MP3 temporarily
      fs.writeFileSync(mp3Path, resp.data); // Save the MP3 file
      tempMp3Files.push(mp3Path); // Keep track of the temporary MP3 files
    }

    // Step 2: Merge all MP3 files into one AAC file
    const mergedAac = path.join(os.tmpdir(), `merged_${uuidv4()}.aac`);

    await new Promise((resolve, reject) => {
      const cmd = ffmpeg();
      // Add each MP3 file as an input to ffmpeg
      tempMp3Files.forEach((mp3) => cmd.input(mp3));

      cmd
        .audioCodec("aac")
        .format("adts")
        .on("end", resolve) // Resolve the promise when merging is done
        .on("error", reject) // Reject the promise if there's an error
        .save(mergedAac); // Save the final merged file
    });

    // Step 3: Upload the merged AAC file to S3
    const fileContent = fs.readFileSync(mergedAac);
    const s3Params = {
      Bucket: "rosaryapp", // Your S3 bucket name
      ACL: "public-read", // Set the proper access control
      Key: `audio/${fileName}`, // File path in the bucket
      Body: fileContent, // The file content
      ContentType: "audio/aac", // Set the correct MIME type for AAC
    };

    const s3Response = await s3.upload(s3Params).promise(); // Upload to S3

    // Step 4: Cleanup temporary files
    for (const mp3 of tempMp3Files) {
      fs.existsSync(mp3) && fs.unlinkSync(mp3); // Delete MP3 files
    }
    fs.unlinkSync(mergedAac); // Delete the merged AAC file

    console.log("✅ Uploaded to S3:", s3Response.Location); // Log the S3 URL of the uploaded file
    return s3Response.Location; // Return the S3 URL
  } catch (err) {
    // Cleanup in case of an error
    tempMp3Files.forEach((f) => fs.existsSync(f) && fs.unlinkSync(f));
    console.error("❌ Error:", err.response?.data || err.message);
    throw err; // Throw the error after cleanup
  }
}
function formatDate(date) {
  if (!(date instanceof Date)) {
    throw new TypeError("Expected a Date object");
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}/${month}/${day}`;
}
function getLiturgicalPeriod(date) {
  const year = date.getFullYear();

  // Determine Weekday Year (Year I or Year II)
  const weekdayYear = year % 2 === 0 ? "Year II" : "Year I";

  // Determine Sunday Cycle (Cycle A, B, or C)
  const sundayCycleIndex = (year - 2020) % 3; // 2020 is Cycle A
  let sundayCycle;

  switch (sundayCycleIndex) {
    case 0:
      sundayCycle = "Cycle A";
      break;
    case 1:
      sundayCycle = "Cycle B";
      break;
    case 2:
      sundayCycle = "Cycle C";
      break;
  }

  // Determine whether the date is a Sunday
  const dayOfWeek = date.getDay(); // 0 is Sunday, 6 is Saturday

  // Return the relevant liturgical period based on the day of the week
  if (dayOfWeek === 0) {
    return sundayCycle; // Return the Sunday cycle for Sundays
  } else {
    return weekdayYear; // Return the weekday year for weekdays
  }
}
module.exports = {
  create: async (req, res) => {
    try {
      const { contentEnglish, contentSpanish, date } = req.body;
      console.log(req.files);
      console.log(req.body);
      const targetDate = new Date(date);
      const type = getLiturgicalPeriod(targetDate);
      const readingFileEN = req.files.readingFileEN;
      const readingFileES = req.files.readingFileES;

      // Here you will use the uploaded audio files directly
      const readingAudioFileEN = readingFileEN
        ? readingFileEN[0].location
        : null;
      const readingAudioFileES = readingFileES
        ? readingFileES[0].location
        : null;
      if (readingAudioFileEN == null || readingAudioFileES == null) {
        return res
          .status(SERVER_ERROR)
          .json({ error: false, message: "Saved or updated successfully." });
      }
      console.log(readingAudioFileES);
      console.log(readingAudioFileEN);
      // Format content and English reflection in parallel
      const [formattedEN, reflectionEN] = await Promise.all([
        openai.chat.completions.create({
          model: "gpt-4",
          temperature: 0.2,
          messages: [
            { role: "system", content: systemPromptEnglish },
            { role: "user", content: contentEnglish },
          ],
        }),
        openai.chat.completions.create({
          model: "gpt-4",
          temperature: 0.2,
          messages: [
            { role: "system", content: reflectionPromptEN },
            { role: "user", content: contentEnglish },
          ],
        }),
      ]);

      const formattedHtmlEN = formattedEN.choices[0].message.content;
      const formattedHtmlEN_Reflection =
        reflectionEN.choices[0].message.content;

      // Translate English reflection to Spanish
      const translationPrompt = (lang) => `
        You are a translation assistant. Translate the following text into ${lang}. 
        - Keep the meaning and tone.
        - Preserve structure and paragraphs.
        - Do not summarize or omit anything.
  
        Text:
      `;

      const translationResponse = await openai.chat.completions.create({
        model: "gpt-4",
        temperature: 0.2,
        messages: [
          { role: "system", content: "You are a helpful translator." },
          {
            role: "user",
            content: translationPrompt("Spanish") + formattedHtmlEN_Reflection,
          },
        ],
      });

      const formattedHtmlES_Reflection =
        translationResponse.choices[0].message.content;

      // Format provided Spanish content
      const formattedES = await openai.chat.completions.create({
        model: "gpt-4",
        temperature: 0.2,
        messages: [
          { role: "system", content: systemPromptSpanish },
          { role: "user", content: contentSpanish },
        ],
      });

      const formattedHtmlES = formattedES.choices[0].message.content;

      // Find existing records
      const [existingEN, existingES] = await Promise.all([
        DailyReading.findOne({
          language: languageIds.english,
          type,
          date: targetDate,
        }),
        DailyReading.findOne({
          language: languageIds.spanish,
          type,
          date: targetDate,
        }),
      ]);
      const now = new Date(); // Create timestamp once to ensure consistency

      const [reflectionAudio_EN_Url, reflectionAudio_ES_Url] =
        await Promise.all([
          generateSpeechAAC(
            formattedHtmlEN_Reflection,
            "fable",
            `reflection_en_${now}`
          ),
          generateSpeechAAC(
            formattedHtmlES_Reflection,
            "fable",
            `reflection_es_${now}`
          ),
        ]);
      // Upsert English record
      if (existingEN) {
        existingEN.content = formattedHtmlEN;
        existingEN.summary = formattedHtmlEN_Reflection;
        existingEN.readingAudio = readingAudioFileEN;
        existingEN.reflectionAudio = reflectionAudio_EN_Url;
        await existingEN.save();
      } else {
        await DailyReading.create({
          language: languageIds.english,
          type,
          content: formattedHtmlEN,
          summary: formattedHtmlEN_Reflection,
          date: targetDate,
          readingAudio: readingAudioFileEN,
          reflectionAudio: reflectionAudio_EN_Url,
        });
      }

      // Upsert Spanish record
      if (existingES) {
        existingES.content = formattedHtmlES;
        existingES.summary = formattedHtmlES_Reflection;
        existingES.readingAudio = readingAudioFileES;
        existingES.reflectionAudio = reflectionAudio_ES_Url;
        await existingES.save();
      } else {
        await DailyReading.create({
          language: languageIds.spanish,
          type,
          content: formattedHtmlES,
          summary: formattedHtmlES_Reflection,
          date: targetDate,
          readingAudio: readingAudioFileES,
          reflectionAudio: reflectionAudio_ES_Url,
        });
      }

      return res
        .status(OK)
        .json({ error: false, message: "Saved or updated successfully." });
    } catch (err) {
      // const str = err.response.data.toString("utf8"); // ①
      // const json = JSON.parse(str); // ②
      // console.error("OpenAI error:", json.error.message);
      return res
        .status(SERVER_ERROR)
        .json({ error: true, message: "Internal Server Error" });
    }
  },

  updateCreate: async (req, res) => {
    try {
      const { contentEnglish, contentSpanish, date } = req.body;
      console.log(req.files);
      console.log(req.body);
      const targetDate = new Date(date);
      const type = getLiturgicalPeriod(targetDate);
      const readingFileEN = req.files.readingFileEN;
      const readingFileES = req.files.readingFileES;

      // Here you will use the uploaded audio files directly
      const readingAudioFileEN = readingFileEN
        ? readingFileEN[0].location
        : null;
      const readingAudioFileES = readingFileES
        ? readingFileES[0].location
        : null;
      if (readingAudioFileEN == null || readingAudioFileES == null) {
        return res
          .status(SERVER_ERROR)
          .json({ error: false, message: "Saved or updated successfully." });
      }
      console.log(readingAudioFileES);
      console.log(readingAudioFileEN);
      // Format content and English reflection in parallel
      // const [formattedEN, reflectionEN] = await Promise.all([
      //   openai.chat.completions.create({
      //     model: "gpt-4",
      //     temperature: 0.2,
      //     messages: [
      //       { role: "system", content: systemPromptEnglish },
      //       { role: "user", content: contentEnglish },
      //     ],
      //   }),
      //   openai.chat.completions.create({
      //     model: "gpt-4",
      //     temperature: 0.2,
      //     messages: [
      //       { role: "system", content: reflectionPromptEN },
      //       { role: "user", content: contentEnglish },
      //     ],
      //   }),
      // ]);

      // const formattedHtmlEN = formattedEN.choices[0].message.content;
      // const formattedHtmlEN_Reflection =
      //   reflectionEN.choices[0].message.content;

      // // Translate English reflection to Spanish
      // const translationPrompt = (lang) => `
      //   You are a translation assistant. Translate the following text into ${lang}.
      //   - Keep the meaning and tone.
      //   - Preserve structure and paragraphs.
      //   - Do not summarize or omit anything.

      //   Text:
      // `;

      // const translationResponse = await openai.chat.completions.create({
      //   model: "gpt-4",
      //   temperature: 0.2,
      //   messages: [
      //     { role: "system", content: "You are a helpful translator." },
      //     {
      //       role: "user",
      //       content: translationPrompt("Spanish") + formattedHtmlEN_Reflection,
      //     },
      //   ],
      // });

      // const formattedHtmlES_Reflection =
      //   translationResponse.choices[0].message.content;

      // // Format provided Spanish content
      // const formattedES = await openai.chat.completions.create({
      //   model: "gpt-4",
      //   temperature: 0.2,
      //   messages: [
      //     { role: "system", content: systemPromptSpanish },
      //     { role: "user", content: contentSpanish },
      //   ],
      // });

      // const formattedHtmlES = formattedES.choices[0].message.content;

      // // Find existing records
      const [existingEN, existingES] = await Promise.all([
        DailyReading.findOne({
          language: languageIds.english,
          type,
          date: targetDate,
        }),
        DailyReading.findOne({
          language: languageIds.spanish,
          type,
          date: targetDate,
        }),
      ]);
      // const now = new Date(); // Create timestamp once to ensure consistency

      // const [reflectionAudio_EN_Url, reflectionAudio_ES_Url] =
      //   await Promise.all([
      //     generateSpeechAAC(
      //       formattedHtmlEN_Reflection,
      //       "fable",
      //       `reflection_en_${now}`
      //     ),
      //     generateSpeechAAC(
      //       formattedHtmlES_Reflection,
      //       "fable",
      //       `reflection_es_${now}`
      //     ),
      //   ]);
      // Upsert English record
      if (existingEN) {
        existingEN.readingAudio = readingAudioFileEN;

        await existingEN.save();
      } else {
      }

      // Upsert Spanish record
      if (existingES) {
        existingES.readingAudio = readingAudioFileES;

        await existingES.save();
      } else {
      }

      return res
        .status(OK)
        .json({ error: false, message: "Saved or updated successfully." });
    } catch (err) {
      // const str = err.response.data.toString("utf8"); // ①
      // const json = JSON.parse(str); // ②
      // console.error("OpenAI error:", json.error.message);
      return res
        .status(SERVER_ERROR)
        .json({ error: true, message: "Internal Server Error" });
    }
  },

  findOne: async (req, res) => {
    try {
      let { code, date } = req.body;
      limit = 30;
      const targetDate = new Date(date);
      var findCode = await Language.findOne({
        code: code.toString(),
      });
      console.log(targetDate);
      const data = await DailyReading.findOne({
        language: findCode._id,
        date: targetDate,
      });
      // .skip((page - 1) * limit) // Skip documents based on the current page
      // .limit(limit);
      //.sort({ verseNum: 1 });
      console.log(data);
      return res.status(OK).json(data);
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).json({ error: true, message: err });
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

      console.log(formattedDate);
      const dataEnglish = await DailyReading.findOne({
        language: languageIds.english,
        date: targetDate,
      });

      const dataSpanish = await DailyReading.findOne({
        language: languageIds.spanish,
        date: targetDate,
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

  findAllAdmin: async (req, res) => {
    try {
      let { page = 1, limit = 100, code } = req.body;

      // console.log(code);
      // var findCode = await Language.findOne({
      //   code: code.toString(),
      // });

      // console.log(findCode._id);
      const data = await Psalm.find()
        .skip((page - 1) * limit) // Skip documents based on the current page
        .limit(limit)
        .populate("language")
        .sort({ verseNum: 1 });
      return res.status(OK).json({ data: data });
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).json({ error: true, message: err });
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.params.id;
      const data = await Psalm.findByIdAndDelete(id);
      return res.status(OK).json({ error: false });
    } catch (err) {
      return res.status(OK).json({ error: true, message: err });
    }
  },
  findById: async (req, res) => {
    try {
      let { id } = req.body;

      const data = await Psalm.findById(id);
      return res.status(OK).json({ data: data });
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).json({ error: true, message: err });
    }
  },
  update: async (req, res) => {
    try {
      const { title, content, langauge, verse, id } = req.body;

      const updatedData = {
        title: title,
        content: content,
        langauge: langauge,
        verse: verse,
      };
      updatedData.hasUpdated = true;
      const options = { new: true };

      const result = await Psalm.findByIdAndUpdate(id, updatedData, options);

      return res.status(OK).json({ error: false, result });
    } catch (err) {
      return res.status(OK).json({ error: true, message: err });
    }
  },

  updateAll: async (req, res) => {
    try {
      const allPsalms = await Psalm.find();
      allPsalms.forEach(async (item) => {
        const number = parseInt(item.verse.match(/\d+/)[0]);
        console.log(number);
        const updatedData = {
          verseNum: parseInt(number),
        };
        updatedData.hasUpdated = true;
        const options = { new: true };

        const result = await Psalm.findByIdAndUpdate(
          item._id,
          updatedData,
          options
        );
      });

      return res.status(OK).json({ error: false });
    } catch (err) {
      return res.status(OK).json({ error: true, message: err });
    }
  },
};
