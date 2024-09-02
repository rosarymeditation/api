const Distress = require("../models/distress");
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
    const { title, content, language } = req.body;
    const photoObject = req.file;
    const photo = photoObject ? req.file.location : null;
    if (title == null || content == null) {
      return res.status(OK).json({ error: true });
    }
    try {
      const data = Distress({
        language: language,
        content: content,
        title: title,
        url: photo || "",
      });
      await data.save();

      return res.status(OK).json({ error: false });
    } catch (err) {
      console.log(err);
      return res.status(OK).json({ error: true });
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
      const data = await Distress.find({ language: findCode._id })
        .skip((page - 1) * limit) // Skip documents based on the current page
        .limit(limit)
        .sort({ title: 1 })
        .populate("language");
      return res.status(OK).json({ data: data });
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).json({ error: true, message: err });
    }
  },

  findAllAdmin: async (req, res) => {
    try {
      const { page = 1, limit = 100, code } = req.body;

      // console.log(findCode._id);
      const data = await Distress.find()
        .skip((page - 1) * limit) // Skip documents based on the current page
        .limit(limit)
        .sort({ title: 1 })
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
      const data = await Distress.findByIdAndDelete(id);
      return res.status(OK).json({ error: false });
    } catch (err) {
      return res.status(OK).json({ error: true, message: err });
    }
  },

  // update: async (req, res) => {
  //   try {
  //     const id = req.params.id;

  //     const { content, langauge, title } = req.body;
  //     const updatedData = {
  //       content: content,
  //       langauge: langauge,
  //       title: title,
  //     };
  //     updatedData.hasUpdated = true;
  //     const options = { new: true };

  //     const result = await Distress.findByIdAndUpdate(id, updatedData, options);

  //     return res.status(OK).send({ error: false, result });
  //   } catch (err) {
  //     return res.status(OK).send({ error: true, message: err });
  //   }
  // },
  findById: async (req, res) => {
    try {
      let { id } = req.body;

      const data = await Distress.findById(id);
      return res.status(OK).json({ data: data });
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).json({ error: true, message: err });
    }
  },
  update: async (req, res) => {
    try {
      console.log(req.body);
      const photoObject = req.file;
      const photo = photoObject ? req.file.location : null;

      const { title, content, langauge, id } = req.body;
      const findByOne = Distress.findById(id);
      const updatedData = {
        title: title,
        content: content,
        langauge: langauge,
        url: photo || findByOne.url,
      };
      updatedData.hasUpdated = true;
      const options = { new: true };

      const result = await Distress.findByIdAndUpdate(id, updatedData, options);

      return res.status(OK).json({ error: false, result });
    } catch (err) {
      return res.status(OK).json({ error: true, message: err });
    }
  },
};
