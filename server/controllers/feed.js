// const PostCode = require("../models").PostCode;
// const Query = new require("../queries/crud");
// const validate = require("../validations/validation");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const Feed = require("../models/feed");
const FeedStatus = require("../models/feedStatus");
const Language = require("../models/language");
const FeedLike = require("../models/feedLikes");
const User = require("../models/user");
const { upload } = require("../utility/global");
require("dotenv").config(); // Load environment variables

const axios = require("axios");
const {
  SERVER_ERROR,
  OK,
  VALIDATION_ERROR,
  Messages,
} = require("../errors/statusCode");

async function translateText(text) {
  const apiKey = "AIzaSyAw6l4HVAJBP58FJmAPFwSbtcyEZaUoWVQ";
  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
  try {
    const response = await axios.post(url, {
      q: text,
      source: "en",
      target: "es",
      format: "text",
    });

    console.log(
      "Translated Text:",
      response.data.data.translations[0].translatedText
    );
    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error(
      "Translation Error:",
      error.response ? error.response.data : error.message
    );
  }
}
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
      const spanish = await translateText(content);

      //
      const data = Feed({
        author: userId,
        status: feedStatus,
        content: content,
        language: "650294586a369b86e4f201f0",
        url: photo || "",
      });
      const data2 = Feed({
        author: userId,
        status: feedStatus,
        content: spanish,
        language: "6502946f6a369b86e4f201f2",
        url: photo || "",
      });
      await data.save();
      await data2.save();
      // const msg = {
      //   to: "rosary@softnergy.com",
      //   from: "rosary@softnergy.com",
      //   templateId: "d-910819cd9df647e8a4b2c719d081c512",
      //   dynamic_template_data: {
      //     name: data.author.email,
      //     id: data._id,
      //     content: data.content,
      //   },
      // };

      // sgMail.send(msg, (error, result) => {
      //   if (error) {
      //     console.log(error);
      //   } else {
      //     console.log("That's wassup!");
      //   }
      // });
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
      const { page = 1, limit = 10, code } = req.body;
     
      var findCode = await Language.findOne({
        code: code || "0",
      });
      const findStatus = await FeedStatus.findOne({
        name: "Approved",
      });
      const data = code
        ? await Feed.find({ status: findStatus._id, language: findCode._id })
            .skip((page - 1) * limit) // Skip documents based on the current page
            .limit(limit)
            .sort({ createdAt: "desc" })
            .populate("author")
            .populate("status")
            .populate("likes")
            .populate("comments")
        : await Feed.find({
            status: findStatus._id,
            $or: [
              { language: "650294586a369b86e4f201f0" },
              { language: { $exists: false } },
            ],
          })
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
