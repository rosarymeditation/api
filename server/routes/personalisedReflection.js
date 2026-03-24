const controller = require("../controllers/personalisedReflection");
const { rootUrl } = require("../utility/constants");
const { auth, upload } = require("../utility/global");

module.exports = (app) => {
  app.post(
    rootUrl("personalised-reflection"),
    controller.getPersonalisedReflection
  );
};
