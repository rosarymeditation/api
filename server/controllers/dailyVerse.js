const DailyVerse = require("../models/dailyVerse");
const Language = require("../models/language");
const PrayerType = require("../models/prayer-type");
const { upload } = require("../utility/global");
const {
  SERVER_ERROR,
  OK,
  VALIDATION_ERROR,
  Messages,
} = require("../errors/statusCode");
// const query = new Query(PostCode);

module.exports = {
  create: async (req, res) => {
    const arr = [
      {
        content:
          "Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.",
        verse: "Jeremías 29:11",
        date: "2024-09-01",
        language: "6502946f6a369b86e4f201f2",
        month: "September",
      },
    ];

    try {
      arr.forEach(async (item) => {
        const itemDate = new Date(item.date);
        const month = itemDate.getMonth() + 1; // Month is 0-indexed, so we add 1
        const day = itemDate.getDate();
        const da = `${day}/${month}`;
        item.formattedDate = da;
        //const { content, verse, language, date } = item;
        const data = DailyVerse({
          language: item.language,
          verse: item.verse,
          content: item.content,
          month: item.month,
          date: item.date,
          formattedDate: da,
        });
        await data.save();
      });

      return res.status(OK).send({ error: false });
    } catch (err) {
      console.log(err);
      return res.status(OK).send({ error: true });
    }
  },
  todayVerse: async (req, res) => {
    try {
      const { date, code } = req.body;
      console.log(code);
      console.log("daily Verse");
      var findCode = await Language.findOne({
        code: code.toString(),
      });

      console.log(findCode);
      // console.log(findCode._id);
      // const allData = await DailyVerse.findOne({
      //   language: findCode._id,
      //   formattedDate: date,
      // });
      // allData.forEach((item) => {
      //   const month = item.date.getMonth() + 1; // Month is 0-indexed, so we add 1
      //   const day = item.date.getDate();
      //   const da = `${day}/${month}`;
      //   item.formattedDate = da;
      //   item.save();
      // });

      let data = await DailyVerse.findOne({
        language: findCode._id,
        formattedDate: date,
      });

      if (data.verse.length > data.content.length) {
        data = {
          content: data.verse,
          verse: data.content,
          _id: data._id,
          language: data.language,
          date: data.date,
          formattedDate: data.formattedDate,
        };
      }

      return res.status(OK).send(data);
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).send({ error: true, message: err });
    }
  },
  findAll: async (req, res) => {
    try {
      const { page = 1, limit = 10, code } = req.body;
      console.log(code);
      var findCode = await Language.findOne({
        code: code.toString(),
      });

      // console.log(findCode._id);
      const data = await DailyVerse.find({ language: findCode._id })
        .skip((page - 1) * limit) // Skip documents based on the current page
        .limit(limit)
        .sort({ date: "asc" })
        .populate(language);
      return res.status(OK).send({ data: data });
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).send({ error: true, message: err });
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.params.id;
      const data = await DailyVerse.findByIdAndDelete(id);
      return res.status(OK).send({ error: false });
    } catch (err) {
      return res.status(OK).send({ error: true, message: err });
    }
  },

  update: async (req, res) => {
    try {
      const id = req.params.id;

      const { content, langauge } = req.body;
      const updatedData = {
        content: content,
        langauge: langauge,
      };
      updatedData.hasUpdated = true;
      const options = { new: true };

      const result = await DailyVerse.findByIdAndUpdate(
        id,
        updatedData,
        options
      );

      return res.status(OK).send({ error: false, result });
    } catch (err) {
      return res.status(OK).send({ error: true, message: err });
    }
  },
};
