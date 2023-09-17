const controller = require("../controllers/language");
const { rootUrl } = require("../utility/constants");
const { upload } = require("../utility/global");
module.exports = (app) => {
  app.post(rootUrl("language"), controller.create);
  app.post(rootUrl("languages"), controller.findAll);
  app.delete(rootUrl("language/:id"), controller.delete);
  app.patch(
    rootUrl("language/:id"),

    controller.update
  );
};
