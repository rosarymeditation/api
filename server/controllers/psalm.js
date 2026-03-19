const Psalm = require("../models/psalm");
const Language = require("../models/language");
const { SERVER_ERROR, OK } = require("../errors/statusCode");

module.exports = {
  create: async (req, res) => {
    try {
      const { content, title, language, verse, audioUrl } = req.body;
      const audio = req.files?.audio?.[0]?.location || audioUrl || null;
      const number = parseInt(verse.match(/\d+/)[0]);
      const data = Psalm({
        language,
        title,
        content,
        verse,
        verseNum: number,
        audioUrl: audio,
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
      const findCode = await Language.findOne({ code: code.toString() });
      const data = await Psalm.find({ language: findCode._id })
        .skip((page - 1) * 30)
        .limit(30)
        .sort({ verseNum: 1 });
      return res.status(OK).json({ data });
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).json({ error: true, message: err });
    }
  },

  findAllAdmin: async (req, res) => {
    try {
      const { page = 1, limit = 100 } = req.body;
      const data = await Psalm.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("language")
        .sort({ verseNum: 1 });
      return res.status(OK).json({ data });
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).json({ error: true, message: err });
    }
  },

  findById: async (req, res) => {
    try {
      const { id } = req.body;
      const data = await Psalm.findById(id).populate("language");
      return res.status(OK).json({ data });
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).json({ error: true, message: err });
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.params.id;
      await Psalm.findByIdAndDelete(id);
      return res.status(OK).json({ error: false });
    } catch (err) {
      return res.status(OK).json({ error: true, message: err });
    }
  },

  update: async (req, res) => {
    try {
      const { title, content, language, verse, id, audioUrl } = req.body;
      const audio = req.files?.audio?.[0]?.location || null;
      const findPsalm = await Psalm.findById(id);
      const number = verse ? parseInt(verse.match(/\d+/)[0]) : findPsalm.verseNum;
      const updatedData = {
        title,
        content,
        language,
        verse,
        verseNum: number,
        audioUrl: audio || audioUrl || findPsalm.audioUrl,
      };
      const result = await Psalm.findByIdAndUpdate(id, updatedData, { new: true });
      return res.status(OK).json({ error: false, result });
    } catch (err) {
      return res.status(OK).json({ error: true, message: err });
    }
  },

  updateAll: async (req, res) => {
    try {
      const allPsalms = await Psalm.find();
      await Promise.all(
        allPsalms.map((item) => {
          const number = parseInt(item.verse.match(/\d+/)[0]);
          return Psalm.findByIdAndUpdate(item._id, { verseNum: number }, { new: true });
        })
      );
      return res.status(OK).json({ error: false });
    } catch (err) {
      return res.status(OK).json({ error: true, message: err });
    }
  },
};