const controller = require("../controllers/dailyVerse");
const { rootUrl } = require("../utility/constants");
const { auth, upload } = require("../utility/global");
module.exports = (app) => {
  // app.post(rootUrl("dailyVerse"), controller.create);
  app.post(rootUrl("todaysVerse"), controller.todayVerse);
  app.post(rootUrl("dailyVerses"), controller.findAll);
  app.delete(rootUrl("dailyVerse/:id"), controller.delete);
  app.patch(rootUrl("dailyVerse/:id"), controller.update);
};
