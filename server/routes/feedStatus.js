const controller = require("../controllers/feedStatus");
const { rootUrl } = require("../utility/constants");
module.exports = (app) => {
  app.post(rootUrl("feedStatus"), controller.create);
};
