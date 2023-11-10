const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "live", // Use 'sandbox' for testing, 'live' for production
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

const Audio = require("../models/audio");
const {
  SERVER_ERROR,
  OK,
  VALIDATION_ERROR,
  Messages,
  NO_RESULT,
} = require("../errors/statusCode");
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
    const { amount, currency } = req.body;
    try {
      const create_payment_json = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        redirect_urls: {
          return_url: "https://success",
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
          return res.status(OK).send(payment.links[1].href);
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

  delete: async (req, res) => {
    try {
      const id = req.params.id;
      const data = await Audio.findByIdAndDelete(id);
      return res.status(OK).send({ error: false });
    } catch (err) {
      return res.status(OK).send({ error: true, message: err });
    }
  },
};
