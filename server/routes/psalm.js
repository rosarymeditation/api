const controller = require("../controllers/psalm");
const { rootUrl } = require("../utility/constants");
const { auth, upload } = require("../utility/global");
module.exports = (app) => {
  app.post(rootUrl("psalm"), upload.single("photo"), controller.create);
  app.post(rootUrl("psalms"), controller.findAll);
  app.delete(rootUrl("psalm/:id"), controller.delete);
  app.patch(
    rootUrl("psalm/:id"),
    upload.single("photo"),

    controller.update
  );
};
