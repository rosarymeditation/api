const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox", // Use 'sandbox' for testing, 'live' for production
  client_id:
    "ARqd5dviGW50rQOUcR6Sg0X3r-86DwW5Rpf11pXgnmyFpGdtTrLO20_CbULdcy76J5GhhI-ydTBgu61U",
  client_secret:
    "EIdTJPIN14ipXvS6GXDocCXHcnBm4Hb9YGCcv4Vj0J39vfd59QxN_75Cy5r_yC288z3awF1wMSz5HjmL",
});

const Audio = require("../models/audio");
const {
  SERVER_ERROR,
  OK,
  VALIDATION_ERROR,
  Messages,
  NO_RESULT,
} = require("../errors/statusCode");
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
  create: async (req, res) => {
    try {
      const { amount, currency } = req.body;
      const create_payment_json = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        redirect_urls: {
          return_url: "http://localhost:8001/api/execute-payment",
          cancel_url: "https://error",
        },
        transactions: [
          {
            item_list: {
              items: [
                {
                  name: "donation",
                  sku: "donation",
                  price: amount,
                  currency: currency,
                  quantity: 1,
                },
              ],
            },
            amount: {
              currency: currency,
              total: amount,
            },
            description: "Rosary Meditation Guide Donation",
          },
        ],
      };

      paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
          throw error;
        } else {
          console.log(payment);
          const approvalUrl = payment.links.find(
            (link) => link.rel === "approval_url"
          ).href;
          const token = approvalUrl.match(/token=([^&]+)/)[1];
          console.log(token);
          const payerId = token.substring("EC-".length);
          console.log(payerId);
          return res.status(OK).send({
            url: approvalUrl,
            payerId: token,
            paymentId: payment.id,
          });
        }
      });
    } catch (err) {
      return res.status(OK).send({ error: true });
    }
  },

  currencies: async (req, res) => {
    try {
      return res.status(OK).send({ data: currencies });
    } catch (err) {
      return res.status(NO_RESULT).send({ error: true });
    }
  },

  executePayment: async (req, res) => {
    try {
      const payerId = req.query.PayerID;
      const paymentId = req.query.paymentId;
      console.log(req.body);
      var execute_payment_json = {
        payer_id: payerId,
        transactions: [
          {
            amount: {
              currency: "USD",
              total: "5.00",
            },
          },
        ],
      };

      // var _paymentId = paymentId;

      paypal.payment.execute(
        paymentId,
        execute_payment_json,
        function (error, payment) {
          if (error) {
            console.log(error.response);
            return res.status(OK).send({ error: true, message: error });
          } else {
            console.log("Get Payment Response");
            console.log(JSON.stringify(payment));
            return res.status(OK).send({ error: true, message: err });
          }
        }
      );
    } catch (err) {
      return res.status(OK).send({ error: true, message: err });
    }
  },

  stripePayment: async (req, res) => {
    let { amount } = req.body;
    console.log("----------------------JUDNNNNNENEN----------");
    console.log(req.body);

    //amount = parseInt(amount * 100);

    amount = parseInt(amount * 100);
    const lineItem = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Donation to RMG`,
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ];
    data = {
      payment_method_types: ["card"],
      line_items: lineItem,
      mode: "payment",
      success_url: "https://success",
      cancel_url: "https://error",
    };

    const session = await stripe.checkout.sessions.create(data);

    res.status(OK).send(session.id);
  },
};
