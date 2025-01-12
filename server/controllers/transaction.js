const { SERVER_ERROR, OK } = require("../errors/statusCode");
const stripe = require("stripe")(process.env.STRIPE);
const Transaction = require("../models/transaction");
const Address = require("../models/address");
const Order = require("../models/orders");
const Product = require("../models/product");
const User = require("../models/user");
const twilio = require("twilio");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const numbersToSend = ["+447857965032", "+447935885977"];
const accountSid = process.env.TWILIOSID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIOTOKEN; // Your Auth Token from www.twilio.com/console
const client = new twilio(accountSid, authToken);
// const query = new Query(PostCode);
function rand() {
  return Math.floor(Math.random() * 50) + 1;
}
function rand2() {
  return Math.floor(Math.random() * 10) + 1;
}
module.exports = {
  stripePayment: async (req, res) => {
    let { amount } = req.body;

    amount = parseInt(amount * 100);
    const lineItem = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Purchase`,
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

  createOrder: async (req, res) => {
    let { total, orders } = req.body;
    let hasDigital = false;
    const digitalUrl = [];
    const userId = req.userData.id;
    const address = await Address.findOne({ user: userId, isDefault: true });
    const findUser = await User.findById(userId);
    const refId = Math.floor(1000000 + Math.random() * 900000000);

    const transaction = Transaction({
      total: total,
      address: `${address.address}, ${address.postCode}, ${address.city}, ${address.country}`,
      refId: refId,
      user: userId,
    });

    const data1 = await transaction.save();

    for (const item of orders) {
      // Wait for product lookup
      var findProduct = await Product.findById(item._id);

      if (findProduct.isDigital) {
        hasDigital = true;
        digitalUrl.push({
          item_name: findProduct.name,
          download_link: findProduct.url,
        });
      }

      // Create and save the order
      const order = new Order({
        transaction: data1._id,
        price: item.price,
        quantity: item.quantity,
        product: item._id,
      });

      // Wait for the order to be saved
      const data2 = await order.save();
    }
    if (hasDigital) {
      const msg = {
        to: findUser.email, // The recipient's email
        from: "payment@rosarymeditationguide.com", // Sender email
        templateId: "d-b3688efbbc044236894813b3b4357fa0", // Your SendGrid dynamic template ID
        subject: "Your Purchase is Complete!", // Email subject
        dynamic_template_data: {
          customer_name: findUser.firstname, // Customer's first name
          order_number: refId, // The order reference ID
          purchase_date: new Date().toLocaleDateString(), // Current date in the desired format
          amount_paid: total, // Amount paid
          current_year: new Date().getFullYear(), // Current year
          items: digitalUrl, // URL for the digital item download(s)
        },
      };

      sgMail
        .send(msg)
        .then(() => {
          console.log("Email sent successfully!");
        })
        .catch((error) => {
          console.error(error);
        });
    }
    numbersToSend.forEach((number) => {
      client.messages
        .create({
          body: `${findUser.firstname}, ordered from Rosary Meditation Guide and order total is £${total}`,
          from: "Afro Food", // Your Twilio phone number
          to: number,
        })
        .then((message) =>
          console.log(`Message sent to ${number}: ${message.sid}`)
        )
        .catch((error) =>
          console.error(`Error sending message to ${number}: ${error.message}`)
        );
    });
    res.status(OK).send();
  },

  createOrderForGuest: async (req, res) => {
    //  _checkoutGuestUser.address = user.address;
    //  _checkoutGuestUser.fullname = user.fullname;
    //  _checkoutGuestUser.email = user.email;
    //  _checkoutGuestUser.city = user.city;
    //  _checkoutGuestUser.country = user.country;
    //  _checkoutGuestUser.postCode = user.postCode;

    let { address, fullname, email, city, country, postCode, total, orders } =
      req.body;
    let hasDigital = false;
    const digitalUrl = [];

    const refId = Math.floor(1000000 + Math.random() * 900000000);

    const transaction = Transaction({
      total: total,
      email: email,
      fullname,
      address: `${address}, ${postCode}, ${city}, ${country}`,
      refId: refId,
    });

    const data1 = await transaction.save();

    for (const item of orders) {
      // Wait for product lookup
      var findProduct = await Product.findById(item._id);

      if (findProduct.isDigital) {
        hasDigital = true;
        digitalUrl.push({
          item_name: findProduct.name,
          download_link: findProduct.url,
        });
      }

      // Create and save the order
      const order = new Order({
        transaction: data1._id,
        price: item.price,
        quantity: item.quantity,
        product: item._id,
      });

      // Wait for the order to be saved
      const data2 = await order.save();
    }
    if (hasDigital) {
      const msg = {
        to: email, // The recipient's email
        from: "payment@rosarymeditationguide.com", // Sender email
        templateId: "d-b3688efbbc044236894813b3b4357fa0", // Your SendGrid dynamic template ID
        subject: "Your Purchase is Complete!", // Email subject
        dynamic_template_data: {
          customer_name: fullname, // Customer's first name
          order_number: refId, // The order reference ID
          purchase_date: new Date().toLocaleDateString(), // Current date in the desired format
          amount_paid: total, // Amount paid
          current_year: new Date().getFullYear(), // Current year
          items: digitalUrl, // URL for the digital item download(s)
        },
      };

      sgMail
        .send(msg)
        .then(() => {
          console.log("Email sent successfully!");
        })
        .catch((error) => {
          console.error(error);
        });
    }
    numbersToSend.forEach((number) => {
      client.messages
        .create({
          body: `${fullname}, ordered from Rosary Meditation Guide and order total is £${total}`,
          from: "Afro Food", // Your Twilio phone number
          to: number,
        })
        .then((message) =>
          console.log(`Message sent to ${number}: ${message.sid}`)
        )
        .catch((error) =>
          console.error(`Error sending message to ${number}: ${error.message}`)
        );
    });
    res.status(OK).send();
  },
};
