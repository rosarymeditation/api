const Terms = require("../models/terms");
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
    const { eula, privacy, term, language } = req.body;

    if (eula == null) {
      return res.status(OK).send({ error: true });
    }
    try {
      const data = Terms({
        language: language,
        eula: eula,
        privacy: privacy,
        term: term,
      });
      await data.save();

      return res.status(OK).send({ error: false });
    } catch (err) {
      console.log(err);
      return res.status(OK).send({ error: true });
    }
  },

  findAll: async (req, res) => {
    try {
      const { code } = req.body;

      var findCode = await Language.findOne({
        code: code.toString(),
      });

      // console.log(findCode._id);
      const data = await Terms.find({ language: findCode._id });

      return res.status(OK).send({ data: data });
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).send({ error: true, message: err });
    }
  },

  findTerm: async (req, res) => {
    try {
      const { code } = req.body;
      console.log(code);
      var findCode = await Language.findOne({
        code: code.toString(),
      });
      console.log("daily affirmation");
      // console.log(findCode._id);
      // const allData = await Affirmation.findOne({
      //   language: findCode._id,
      //   formattedDate: date,
      // });
      // allData.forEach((item) => {
      //   const month = item.date.getMonth() + 1; // Month is 0-indexed, so we add 1
      //   const day = item.date.getDate();
      //   const da = `${day}/${month}`;
      //   item.formattedDate = da;
      //   item.save();
      // });

      const data = await Terms.findOne({
        language: findCode._id,
      });

      return res.status(OK).send(data);
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).send({ error: true, message: err });
    }
  },
};
