const controller = require("../controllers/prayer");
const { rootUrl } = require("../utility/constants");
const { auth, upload } = require("../utility/global");
module.exports = (app) => {
  app.post(rootUrl("prayer"), upload.single("photo"), controller.create);
  app.post(rootUrl("prayers"), controller.findAll);
  app.delete(rootUrl("prayer/:id"), controller.delete);
  app.post(
    rootUrl("prayer_update"),
    upload.single("photo"),

    controller.update
  );
};
