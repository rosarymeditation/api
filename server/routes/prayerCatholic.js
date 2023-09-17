const controller = require("../controllers/prayerCatholic");
const { rootUrl } = require("../utility/constants");
const { auth, upload } = require("../utility/global");
module.exports = (app) => {
  app.post(
    rootUrl("catholic-prayer"),
    upload.single("photo"),
    controller.create
  );
  app.post(rootUrl("catholic-prayers"), controller.findAll);
  app.delete(rootUrl("catholic-prayer/:id"), controller.delete);
  app.patch(
    rootUrl("catholic-prayer/:id"),
    upload.single("photo"),

    controller.update
  );
};
