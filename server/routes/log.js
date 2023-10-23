const controller = require("../controllers/log");
const { rootUrl } = require("../utility/constants");
const { auth, upload } = require("../utility/global");
module.exports = (app) => {
  app.post(rootUrl("log-inspiration"), controller.inspiration);
  app.post(rootUrl("log-mystery"), controller.mystery);
  app.post(rootUrl("log-novena"), controller.novena);
  app.post(rootUrl("log-psalm"), controller.psalms);
  app.post(rootUrl("log-rosary"), controller.rosary);
};
