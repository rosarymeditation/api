const controller = require("../controllers/plan");
const { rootUrl } = require("../utility/constants");
const { auth, upload } = require("../utility/global");
module.exports = (app) => {
  app.post(rootUrl("plan"), upload.single("photo"), controller.create);
  app.post(rootUrl("plans"),  controller.findAll);


};
