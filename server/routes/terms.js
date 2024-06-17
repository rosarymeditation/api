const controller = require("../controllers/terms");
const { rootUrl } = require("../utility/constants");
const { auth, upload } = require("../utility/global");
module.exports = (app) => {
  app.post(rootUrl("term"), controller.create);
  app.post(rootUrl("terms"), controller.findAll);
  app.post(rootUrl("findTerm"), controller.findTerm);
  // app.post(rootUrl("dailyVerses"), controller.findAll);
  // app.delete(rootUrl("affirmation/:id"), controller.delete);
  // app.patch(rootUrl("affirmation/:id"), controller.update);
};
