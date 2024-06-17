const controller = require("../controllers/product");
const { rootUrl } = require("../utility/constants");
const { auth, upload } = require("../utility/global");
module.exports = (app) => {
  app.post(
    rootUrl("product/create"),
    upload.array("image", 5),

    controller.create
  );
  app.post(rootUrl("product/all"), controller.findAll);

  app.post(rootUrl("product/findById"), controller.findById);
};
