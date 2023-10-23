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

      const data = Psalm({
        language: language,
        title: title,
        content: content,
        verse,
      });
      await data.save();

      return res.status(OK).send({ error: false });
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).send({ error: true });
    }
  },

  findAll: async (req, res) => {
    try {
      const { page = 1, limit = 10, code } = req.body;
      console.log(code);
      var findCode = await Language.findOne({
        code: code.toString(),
      });

      console.log(findCode._id);
      const data = await Psalm.find({ language: findCode._id })
        .skip((page - 1) * limit) // Skip documents based on the current page
        .limit(limit)
        .sort({ title: "asc" });
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

  update: async (req, res) => {
    try {
      const id = req.params.id;

      const { title, content, langauge, verse } = req.body;
      const updatedData = {
        title: title,
        content: content,
        langauge: langauge,
        verse,
      };
      updatedData.hasUpdated = true;
      const options = { new: true };

      const result = await Psalm.findByIdAndUpdate(id, updatedData, options);

      return res.status(OK).send({ error: false, result });
    } catch (err) {
      return res.status(OK).send({ error: true, message: err });
    }
  },
};
