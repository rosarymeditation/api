const Psalm = require("../models/psalm");
const Language = require("../models/language");
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
    try {
      console.log("kekekekkekek");
      const { content, title, language, verse } = req.body;
      console.log(req.body);
      const number = parseInt(verse.match(/\d+/)[0]);
      const data = Psalm({
        language: language,
        title: title,
        content: content,
        verse,
        verseNum: number,
      });
      await data.save();

      return res.status(OK).json({ error: false });
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).json({ error: true });
    }
  },

  findAll: async (req, res) => {
    try {
      let { page = 1, limit = 30, code } = req.body;
      limit = 30;
      //  console.log(code);
      var findCode = await Language.findOne({
        code: code.toString(),
      });

      //  console.log(findCode._id);
      const data = await Psalm.find({ language: findCode._id })
        .skip((page - 1) * limit) // Skip documents based on the current page
        .limit(limit)
        .sort({ verseNum: 1 });
      return res.status(OK).json({ data: data });
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
        // console.log(number);
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
