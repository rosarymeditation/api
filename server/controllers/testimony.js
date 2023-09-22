// const PostCode = require("../models").PostCode;
// const Query = new require("../queries/crud");
// const validate = require("../validations/validation");
const Testimony = require("../models/testimony");
const User = require("../models/user");
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
      const userId = req.userData.id;
      const { content } = req.body;
      const data = Testimony({
        author: userId,
        content: content,
      });
      const save = await data.save();
      return res.status(OK).send({ error: false });
    } catch (err) {
      return res.status(OK).send({ error: true });
    }

    // const data = await Testimony.findOne({ author: userId })
    //   .populate("user")
    //   .exec();
  },

  findByUser: async (req, res) => {
    const userId = req.userData.id;

    try {
      const data = await Testimony.find({ author: userId }).populate("author");
      return res.status(OK).send({ data: data });
    } catch (err) {
      return res.status(OK).send({ error: true, message: err });
    }
  },

  findAll: async (req, res) => {
    try {
      const data = await Testimony.find().populate("author");
      return res.status(OK).send({ data: data });
    } catch (err) {
      return res.status(OK).send({ error: true, message: err });
    }
  },
};
