const controller = require("../controllers/prayer");
const { rootUrl } = require("../utility/constants");
const { auth, upload } = require("../utility/global");
module.exports = (app) => {
  app.post(rootUrl("prayer"), upload.single("photo"), controller.create);
  app.post(rootUrl("prayers"), controller.findAll);
  app.delete(rootUrl("prayer/:id"), controller.delete);
  app.patch(
    rootUrl("prayer/:id"),
    upload.single("photo"),

    controller.update
  );
};
