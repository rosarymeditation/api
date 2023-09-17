const controller = require("../controllers/audio");
const { rootUrl } = require("../utility/constants");
const { auth, upload } = require("../utility/global");
module.exports = (app) => {
  app.post(rootUrl("audio"), controller.create);
  app.post(rootUrl("audios"), controller.findAll);
  app.delete(rootUrl("audio/:id"), controller.delete);
};
