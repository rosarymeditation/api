const Donor = require("../models/donor");

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
      //const type = await PrayerType.findOne({ name: "OTHERS" });
      const { name, amount, tier, intentions } = req.body;
      const data = Donor({
        name: name,
        amount: amount,
        tier: tier,
        intentions: intentions,
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
      const { page = 1, limit = 20 } = req.body;

      // console.log(findCode._id);
      const data = await Donor.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: "desc" });
      return res.status(OK).json({ data: data });
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).json({ error: true });
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.params.id;
      const data = await Donor.findByIdAndDelete(id);
      return res.status(OK).json({ error: false });
    } catch (err) {
      return res.status(OK).json({ error: true, message: err });
    }
  },

  update: async (req, res) => {
    try {
      // console.log(req.body);

      const { name, amount, tier, intentions, id } = req.body;
      const findPrayer = Donor.findById(id);
      const updatedData = {
        name: name,
        amount: amount,
        tier: tier,
        intentions: intentions,
      };
      updatedData.hasUpdated = true;
      const options = { new: true };

      const result = await Donor.findByIdAndUpdate(id, updatedData, options);

      return res.status(OK).json({ error: false, result });
    } catch (err) {
      return res.status(OK).json({ error: true, message: err });
    }
  },
};
