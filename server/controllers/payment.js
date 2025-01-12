const paypal = require("paypal-rest-sdk");

const Audio = require("../models/audio");
const {
  SERVER_ERROR,
  OK,
  VALIDATION_ERROR,
  Messages,
  NO_RESULT,
} = require("../errors/statusCode");
paypal.configure({
  mode: "sandbox", // Use 'sandbox' for testing, 'live' for production
  client_id:
    "ARqd5dviGW50rQOUcR6Sg0X3r-86DwW5Rpf11pXgnmyFpGdtTrLO20_CbULdcy76J5GhhI-ydTBgu61U",
  client_secret:
    "EIdTJPIN14ipXvS6GXDocCXHcnBm4Hb9YGCcv4Vj0J39vfd59QxN_75Cy5r_yC288z3awF1wMSz5HjmL",
});
const stripe = require("stripe")(process.env.STRIPE);
// const query = new Query(PostCode);
const currencies = [
  { currency: "Australian dollar", code: "AUD" },
  { currency: "Brazilian real", code: "BRL" },
  { currency: "Canadian dollar", code: "CAD" },
  { currency: "Chinese Renmenbi", code: "CNY" },
  { currency: "Czech koruna", code: "CZK" },
  { currency: "Danish krone", code: "DKK" },
  { currency: "Euro", code: "EUR" },
  { currency: "Hong Kong dollar", code: "HKD" },
  { currency: "Hungarian forint", code: "HUF" },
  { currency: "Israeli new shekel", code: "ILS" },
  { currency: "Japanese yen", code: "JPY" },
  { currency: "Malaysian ringgit", code: "MYR" },
  { currency: "Mexican peso", code: "MXN" },
  { currency: "New Taiwan dollar", code: "TWD" },
  { currency: "New Zealand dollar", code: "NZD" },
  { currency: "Norwegian krone", code: "NOK" },
  { currency: "Philippine peso", code: "PHP" },
  { currency: "Polish złoty", code: "PLN" },
  { currency: "Pound sterling", code: "GBP" },
  { currency: "Russian ruble", code: "RUB" },
  { currency: "Singapore dollar", code: "SGD" },
  { currency: "Swedish krona", code: "SEK" },
  { currency: "Swiss franc", code: "CHF" },
  { currency: "Thai baht", code: "THB" },
  { currency: "United States dollar", code: "USD" },
];
module.exports = {
  // stripePayment: async (req, res) => {
  //   let { amount } = req.body;
  //   console.log("----------------------JUDNNNNNENEN----------");
  //   console.log(req.body);
  //   //amount = parseInt(amount * 100);
  //   amount = parseInt(amount * 100);
  //   const lineItem = [
  //     {
  //       price_data: {
  //         currency: "usd",
  //         product_data: {
  //           name: `Donation to RMG`,
  //         },
  //         unit_amount: amount,
  //       },
  //       quantity: 1,
  //     },
  //   ];
  //   data = {
  //     payment_method_types: ["card"],
  //     line_items: lineItem,
  //     mode: "payment",
  //     success_url: "https://success",
  //     cancel_url: "https://error",
  //   };
  //   const session = await stripe.checkout.sessions.create(data);
  //   res.status(OK).send(session.id);
  // },
};
