const controller = require("../controllers/translate");
const { rootUrl } = require("../utility/constants");
const { auth, upload } = require("../utility/global");

module.exports = (app) => {
  app.post(rootUrl("translate"), controller.convert);
};
