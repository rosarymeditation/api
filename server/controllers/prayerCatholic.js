const Prayer = require("../models/prayer");
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
    try {
      const photoObject = req.file;
      const photo = photoObject ? req.file.location : null;
      const type = await PrayerType.findOne({ name: "CATHOLIC" });
      const { content, title, language } = req.body;
      const data = Prayer({
        title: title,
        language: language,
        content: content,
        type: type._id,
        url: photo || "",
      });
      await data.save();

      return res.status(OK).send({ error: false });
    } catch (err) {
      console.log(err);
      return res.status(OK).send({ error: true });
    }
  },
  findAll: async (req, res) => {
    console.log(req.body);
    try {
      const type = await PrayerType.findOne({ name: "CATHOLIC" });
      const { page = 1, limit = 10, code } = req.body;
      console.log(code);
      var findCode = await Language.findOne({
        code: code.toString(),
      });

      console.log(findCode._id);
      const data = await Prayer.find({ language: findCode._id, type: type._id })
        .skip((page - 1) * limit) // Skip documents based on the current page
        .limit(limit)
        .sort({ title: "asc" })
        .populate("language");
      console.log(data);
      return res.status(OK).json({ data: data });
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).send({ error: true, message: err });
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.params.id;
      const data = await Prayer.findByIdAndDelete(id);
      return res.status(OK).send({ error: false });
    } catch (err) {
      return res.status(OK).send({ error: true, message: err });
    }
  },

  update: async (req, res) => {
    try {
      const id = req.params.id;
      const photoObject = req.file;
      const photo = photoObject ? req.file.location : null;
      const { title, content, langauge } = req.body;
      const updatedData = {
        title: title,
        content: content,
        langauge: langauge,
        url: photo || "",
      };
      updatedData.hasUpdated = true;
      const options = { new: true };

      const result = await Prayer.findByIdAndUpdate(id, updatedData, options);

      return res.status(OK).send({ error: false, result });
    } catch (err) {
      return res.status(OK).send({ error: true, message: err });
    }
  },
};
