const DailyReading = require("../models/dailyReading");
const Language = require("../models/language");
const { upload } = require("../utility/global");
const OpenAI = require("openai");
const axios = require("axios");
require("dotenv").config();

//const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const {
  SERVER_ERROR,
  OK,
  VALIDATION_ERROR,
  Messages,
} = require("../errors/statusCode");
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
//     const readingText = response.choices[0].message.content.trim();
//     return readingText;
//   } catch (error) {
//     console.error(
//       "Error fetching daily readings:",
//       error.response ? error.response.data : error.message
//     );
//     return null;
//   }
// }
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
      // const date = new Date("2024-08-28"); // A weekday example

      //const reading = await getDailyReadings("28/08/2024", "English");
      // console.log("kekekekkekek");
      const { content, summary, language, date } = req.body;
      const targetDate = new Date(date);
      const type = getLiturgicalPeriod(new Date(date));
      const findReading = await DailyReading.findOne({
        language: language,
        type: type,
        date: targetDate,
      });
      if (findReading) {
        console.log("Duplicate");
        return res.status(OK).send({ error: true, message: "Duplicate" });
      }

      const data = DailyReading({
        language: language,
        type: type,
        content: content,
        summary: summary,
        date: date,
      });
      await data.save();

      return res
        .status(OK)
        .send({ error: false, message: "Saved Successfully" });
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).send({ error: true });
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
      console.log(req.body);
      const data = await DailyReading.findOne({
        language: findCode._id,
        date: targetDate,
      });
      // .skip((page - 1) * limit) // Skip documents based on the current page
      // .limit(limit);
      //.sort({ verseNum: 1 });
      return res.status(OK).send(data);
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).send({ error: true, message: err });
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
      return res.status(OK).send({ data: data });
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).send({ error: true, message: err });
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.params.id;
      const data = await Psalm.findByIdAndDelete(id);
      return res.status(OK).send({ error: false });
    } catch (err) {
      return res.status(OK).send({ error: true, message: err });
    }
  },
  findById: async (req, res) => {
    try {
      let { id } = req.body;

      const data = await Psalm.findById(id);
      return res.status(OK).send({ data: data });
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).send({ error: true, message: err });
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

      return res.status(OK).send({ error: false, result });
    } catch (err) {
      return res.status(OK).send({ error: true, message: err });
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

      return res.status(OK).send({ error: false });
    } catch (err) {
      return res.status(OK).send({ error: true, message: err });
    }
  },
};
