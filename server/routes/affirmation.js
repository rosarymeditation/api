const controller = require("../controllers/affirmation");
const { rootUrl } = require("../utility/constants");
const { auth, upload } = require("../utility/global");
module.exports = (app) => {
  //app.post(rootUrl("affirmation"), controller.create);
  app.post(rootUrl("todaysAffirmation"), controller.todayAffirmation);
  // app.post(rootUrl("dailyVerses"), controller.findAll);
  // app.delete(rootUrl("affirmation/:id"), controller.delete);
  // app.patch(rootUrl("affirmation/:id"), controller.update);
};
