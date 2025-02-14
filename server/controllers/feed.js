// const PostCode = require("../models").PostCode;
// const Query = new require("../queries/crud");
// const validate = require("../validations/validation");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const Feed = require("../models/feed");
const FeedStatus = require("../models/feedStatus");
const FeedLike = require("../models/feedLikes");
const User = require("../models/user");
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
      const userId = req.userData.id;
      const { content } = req.body;
      const findUser = await User.findById(userId);
      let feedStatus;

      feedStatus = "6501e15612296a1e7f03a47e";

      //
      const data = Feed({
        author: userId,
        status: feedStatus,
        content: content,
        url: photo || "",
      });
      await data.save();
      const msg = {
        to: "rosary@softnergy.com",
        from: "rosary@softnergy.com",
        templateId: "d-910819cd9df647e8a4b2c719d081c512",
        dynamic_template_data: {
          name: data.author.email,
          id: data._id,
          content: data.content,
        },
      };

      sgMail.send(msg, (error, result) => {
        if (error) {
          console.log(error);
        } else {
          console.log("That's wassup!");
        }
      });
      return res.status(OK).json({ error: false });
    } catch (err) {
      return res.status(OK).json({ error: true });
    }
  },
  sendMessage: async (req, res) => {},
  like: async (req, res) => {
    try {
      const userId = req.userData.id;
      const { feedId } = req.body;
      const findLike = await FeedLike.findOne({ user: userId, feed: feedId });
      if (findLike) {
        const data = await FeedLike.findByIdAndDelete(findLike._id);
        return res
          .status(OK)
          .json({ error: false, isForDelete: true, userId: userId });
      } else {
        const data = FeedLike({
          user: userId,
          feed: feedId,
        });
        Feed.findByIdAndUpdate(
          { _id: feedId },
          { $push: { likes: data } }
        ).exec();
        await data.save();

        return res
          .status(OK)
          .json({ error: false, isForDelete: false, userId: userId });
      }
    } catch (err) {
      return res.status(OK).json({ error: true, isForDelete: false });
    }
  },

  findByUser: async (req, res) => {
    try {
      const userId = req.userData.id;
      const { page = 1, limit = 10 } = req.body;
      const data = await Feed.find({ author: userId })
        .skip((page - 1) * limit) // Skip documents based on the current page
        .limit(limit)
        .sort({ createdAt: "desc" })
        .populate("author")
        .populate("status")
        .populate("likes")
        .populate("comments");
      return res.status(OK).json({ data: data });
    } catch (err) {
      return res.status(OK).json({ error: true, message: err });
    }
  },
  findById: async (req, res) => {
    try {
      const userId = req.body.id;

      const data = await Feed.findById(userId);
      return res.status(OK).json({ data: data });
    } catch (err) {
      return res.status(OK).json({ error: true, message: err });
    }
  },

  findAll: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.body;
      const findStatus = await FeedStatus.findOne({ name: "Approved" });
      const data = await Feed.find({ status: findStatus._id })
        .skip((page - 1) * limit) // Skip documents based on the current page
        .limit(limit)
        .sort({ createdAt: "desc" })
        .populate("author")
        .populate("status")
        .populate("likes")
        .populate("comments");
      return res.status(OK).json({ data: data });
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).json({ error: true, message: err });
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.params.id;
      const data = await Feed.findByIdAndDelete(id);
      return res.status(OK).json({ error: false });
    } catch (err) {
      return res.status(OK).json({ error: true, message: err });
    }
  },

  update: async (req, res) => {
    try {
      //console.log(req.params.id);
      const id = req.params.id;
      const photoObject = req.file;
      const photo = photoObject ? req.file.location : null;
      const { content } = req.body;
      const updatedData = {
        content: content,
        url: photo || "",
      };
      updatedData.hasUpdated = true;
      const options = { new: true };

      const result = await Feed.findByIdAndUpdate(id, updatedData, options);

      return res.status(OK).json({ error: false, result });
    } catch (err) {
      return res.status(OK).json({ error: true, message: err });
    }
  },
};
