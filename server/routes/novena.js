const controller = require("../controllers/novena");
const { rootUrl } = require("../utility/constants");
const { auth, upload } = require("../utility/global");
module.exports = (app) => {
  app.post(rootUrl("novena"), upload.single("photo"), controller.create);
  app.post(rootUrl("novenas"), controller.findAll);
  app.delete(rootUrl("novena/:id"), controller.delete);
  app.patch(
    rootUrl("novena/:id"),
    upload.single("photo"),

    controller.update
  );
};
