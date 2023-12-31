// const PostCode = require("../models").PostCode;
// const Query = new require("../queries/crud");
// const validate = require("../validations/validation");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const PrayerRequest = require("../models/prayerRequest");
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
      const { content, name } = req.body;
      console.log(req.body);
      const data = PrayerRequest({
        content: content,
        name: name || "Anonymous",
      });
      await data.save();

      // sgMail.send(msg, (error, result) => {
      //   if (error) {
      //     console.log(error);
      //   } else {
      //     console.log("That's wassup!");
      //   }
      // });
      return res.status(OK).send({ error: false });
    } catch (err) {
      return res.status(OK).send({ error: true });
    }
  },

  findAll: async (req, res) => {
    try {
      const { page = 1, limit = 20 } = req.body;

      const data = await PrayerRequest.find()
        .skip((page - 1) * limit) // Skip documents based on the current page
        .limit(limit)
        .sort({ createdAt: "desc" });
      return res.status(OK).send({ data: data });
    } catch (err) {
      return res.status(SERVER_ERROR).send({ error: true, message: err });
    }
  },
};
