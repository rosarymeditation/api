const controller = require("../controllers/distress");
const { rootUrl } = require("../utility/constants");
const { auth, upload } = require("../utility/global");
module.exports = (app) => {
  app.post(rootUrl("distress"), upload.single("photo"), controller.create);
  app.post(rootUrl("distressList"), controller.findAll);
  // app.post(rootUrl("dailyVerses"), controller.findAll);
  // app.delete(rootUrl("affirmation/:id"), controller.delete);
  // app.patch(rootUrl("affirmation/:id"), controller.update);
};
