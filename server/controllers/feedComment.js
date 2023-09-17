// const PostCode = require("../models").PostCode;
// const Query = new require("../queries/crud");
// const validate = require("../validations/validation");
const FeedComment = require("../models/feedComment");

const User = require("../models/user");
const {
  SERVER_ERROR,
  OK,
  VALIDATION_ERROR,
  Messages,
} = require("../errors/statusCode");
const Feed = require("../models/feed");
// const query = new Query(PostCode);

module.exports = {
  create: async (req, res) => {
    try {
      const userId = req.userData.id;
      const { content, feedId } = req.body;
      const data = FeedComment({
        author: userId,
        content: content,
        feed: feedId,
      });
      data.save().then(async (result) => {
        console.log(result);
        Feed.findByIdAndUpdate(
          { _id: feedId },
          { $push: { comments: result } }
        ).exec();
        const comment = await FeedComment.findById(result.id)
          .sort({ createdAt: "desc" })
          .populate("author");
        return res.status(OK).send(comment);
      });
    } catch (err) {
      return res.status(SERVER_ERROR).send({ error: true });
    }

    // const data = await FeedComment.findOne({ author: userId })
    //   .populate("user")
    //   .exec();
  },

  findByFeed: async (req, res) => {
    const { id, limit = 10, page = 1 } = req.body;

    try {
      const data = await FeedComment.find({ feed: id })
        .skip((page - 1) * limit) // Skip documents based on the current page
        .limit(limit)
        .sort({ createdAt: "desc" })
        .populate("author");
      return res.status(OK).send({ data: data });
    } catch (err) {
      return res.status(OK).send({ error: true, message: err });
    }
  },

  findByUser: async (req, res) => {
    const userId = req.userData.id;

    try {
      const data = await FeedComment.find({ author: userId })
        .sort({ createdAt: "desc" })
        .populate("author");
      return res.status(OK).send({ data: data });
    } catch (err) {
      return res.status(OK).send({ error: true, message: err });
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.body.id;
      const data = await FeedComment.findByIdAndDelete(id);
      return res.status(OK).send({ error: false });
    } catch (err) {
      return res.status(OK).send({ error: true, message: err });
    }
  },

  update: async (req, res) => {
    try {
      const id = req.body.id;
      const updatedData = req.body;
      updatedData.hasUpdated = true;
      const options = { new: true };
      console.log(req.body);
      console.log(id);
      const result = await FeedComment.findByIdAndUpdate(
        { _id: id },
        updatedData,
        options
      );

      return res.status(OK).send({ error: false, result });
    } catch (err) {
      return res.status(OK).send({ error: true, message: err });
    }
  },
};
