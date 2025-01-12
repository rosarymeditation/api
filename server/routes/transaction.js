const controller = require("../controllers/transaction");
const { rootUrl } = require("../utility/constants");
const { auth, upload } = require("../utility/global");
module.exports = (app) => {
  app.post(rootUrl("create-payment-order"), controller.stripePayment);
  app.post(rootUrl("stripe-payment"), controller.stripePayment);
  app.post(rootUrl("create-order"), auth, controller.createOrder);
  app.post(rootUrl("create-order-guest"), controller.createOrderForGuest);
  //ßapp.post(rootUrl("capture-payment-order"), controller.executePayment);
  // app.get(rootUrl("payment-cancel"), controller.paymentCancel);
  // app.get(rootUrl("payment-success"), controller.paymentSuccess);
  //payment-cancel
};
