// const PostCode = require("../models").PostCode;
// const Query = new require("../queries/crud");
// const validate = require("../validations/validation");
const FeedStatus = require("../models/feedStatus");
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
      const { name } = req.body;
      const data = FeedStatus({
        name: name,
      });
      await data.save();

      return res.status(OK).json({ error: false });
    } catch (err) {
      return res.status(OK).json({ error: true });
    }

    // const data = await Feed.findOne({ author: userId })
    //   .populate("user")
    //   .exec();
  },
};
