const controller = require("../controllers/payment");
const { rootUrl } = require("../utility/constants");
const { auth, upload } = require("../utility/global");
module.exports = (app) => {
  app.post(rootUrl("create-payment"), controller.create);
  app.post(rootUrl("currency-list"), controller.currencies);
  app.post(rootUrl("stripe-payment"), controller.stripePayment);
  app.get(rootUrl("execute-payment"), controller.executePayment);
};
