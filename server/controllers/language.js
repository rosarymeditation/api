const Language = require("../models/language");
const {
  SERVER_ERROR,
  OK,
  VALIDATION_ERROR,
  Messages,
} = require("../errors/statusCode");

module.exports = {
  create: async (req, res) => {
    try {
      const { name, code } = req.body;
      const data = Language({
        name: name,
        code: code,
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
      const data = await Language.find();

      return res.status(OK).send({ data: data });
    } catch (err) {
      return res.status(SERVER_ERROR).send({ error: true, message: err });
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.params.id;
      const data = await Language.findByIdAndDelete(id);
      return res.status(OK).send({ error: false });
    } catch (err) {
      return res.status(OK).send({ error: true, message: err });
    }
  },

  update: async (req, res) => {
    try {
      console.log(req.params.id);

      const { name, code } = req.body;
      const updatedData = {
        name,
        code,
      };
      updatedData.hasUpdated = true;
      const options = { new: true };

      const result = await Language.findByIdAndUpdate(id, updatedData, options);

      return res.status(OK).send({ error: false, result });
    } catch (err) {
      return res.status(OK).send({ error: true, message: err });
    }
  },
};
