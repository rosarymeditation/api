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
      const photo = req.files?.photo?.[0]?.location || null;
      const audioUrl = req.files?.audio?.[0]?.location || null;
      const { content, title, language, type } = req.body;
      const data = Prayer({ title, language, content, type, url: photo, audioUrl });
      await data.save();
      return res.status(OK).json({ error: false });
    } catch (err) {
      console.log(err);
      return res.status(OK).json({ error: true });
    }
  },
  findAllAdmin: async (req, res) => {
    try {
      const { page = 1, limit = 50 } = req.body;
      const data = await Prayer.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ title: "asc" })
        .populate("language")
        .populate("type");
      return res.status(OK).json({ data });
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).json({ error: true, message: err });
    }
  },
  findById: async (req, res) => {
    try {
      const { id } = req.body;
      const data = await Prayer.findById(id)
        .populate("language")
        .populate("type");
      return res.status(OK).json({ data });
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).json({ error: true, message: err });
    }
  },
  findAll: async (req, res) => {
    try {
      const type = await PrayerType.findOne({ name: "OTHERS" });
      const { page = 1, limit = 10, code } = req.body;
      //  console.log(code);
      var findCode = await Language.findOne({
        code: code.toString(),
      });

      // console.log(findCode._id);
      const data = await Prayer.find({ language: findCode._id, type: type._id })
        .skip((page - 1) * limit) // Skip documents based on the current page
        .limit(limit)
        .sort({ title: "asc" })
        .populate("language");
      return res.status(OK).json({ data: data });
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).json({ error: true, message: err });
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.params.id;
      const data = await Prayer.findByIdAndDelete(id);
      return res.status(OK).json({ error: false });
    } catch (err) {
      return res.status(OK).json({ error: true, message: err });
    }
  },

  update: async (req, res) => {
    try {
      const photo = req.files?.photo?.[0]?.location || null;
      const audioUrl = req.files?.audio?.[0]?.location || null;
      const { title, content, language, type, id } = req.body;
      const findPrayer = await Prayer.findById(id);
      const updatedData = {
        title,
        content,
        language,
        type,
        url: photo || findPrayer.url,
        audioUrl: audioUrl || findPrayer.audioUrl,
      };
      const result = await Prayer.findByIdAndUpdate(id, updatedData, { new: true });
      return res.status(OK).json({ error: false, result });
    } catch (err) {
      return res.status(OK).json({ error: true, message: err });
    }
  },
};
