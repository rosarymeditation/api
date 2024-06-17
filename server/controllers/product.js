// const PostCode = require("../models").PostCode;
// const Query = new require("../queries/crud");
// const validate = require("../validations/validation");
const Product = require("../models/product");
const ProductImage = require("../models/productImage");
const User = require("../models/user");
const { upload, formatSlug, rand } = require("../utility/global");
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
      const files = req.files;
      const imageIds = [];

      if (files.length == 0) {
        return res.status(SERVER_ERROR).send({ error: true });
      }

      const photoObject = req.file;
      const photo = photoObject ? req.file.location : null;

      const { name, price, description } = req.body;

      files.forEach((file) => {
        console.log(file.location);
        const image = ProductImage({ url: file.location });
        image.save();
        imageIds.push(image._id);
      });
      const data = Product({
        name: name,
        serial: rand(1, 100000) + rand(1, 100000),
        price: price,
        slug: formatSlug(name),
        description: description,

        productImages: imageIds,
      });
      await data.save();

      return res.status(OK).send({ error: false });
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).send({ error: true });
    }
  },

  findById: async (req, res) => {
    const id = req.body.id;
    console.log(id);
    try {
      const data = await Product.findById(id).populate("productImages");

      console.log(data);
      return res.status(OK).send(data);
    } catch (err) {
      return res.status(OK).send({ error: true, message: err });
    }
  },

  findAll: async (req, res) => {
    try {
      const { page = 1, limit = 30, search = "" } = req.body;
      const partialSearchCriteria = {
        name: { $regex: new RegExp(search, "i") },
      };

      const data = search
        ? await Product.find(partialSearchCriteria)
            .skip((page - 1) * limit) // Skip documents based on the current page
            .limit(limit)
            .populate("productImages")
        : await Product.find()
            .skip((page - 1) * limit) // Skip documents based on the current page
            .limit(limit)
            .populate("productImages");

      return res.status(OK).send({ data: data, count: data.length });
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).send({ error: true, message: err });
    }
  },
};
