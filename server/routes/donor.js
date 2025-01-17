const controller = require("../controllers/donor");
const { rootUrl } = require("../utility/constants");
module.exports = (app) => {
  app.post(rootUrl("donor"), controller.create);
  app.post(rootUrl("donors"), controller.findAll);
  app.delete(rootUrl("donor/:id"), controller.delete);
  app.post(rootUrl("donor_update"), controller.update);
};
