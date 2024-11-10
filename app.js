const express = require("express");
const logger = require("morgan");
const Sentry = require("@sentry/node");
const ProfilingIntegration = require("@sentry/profiling-node");
const path = require("path");
const bodyParser = require("body-parser");

require("dotenv").config();
const cors = require("cors");
const { ACCESS_TOKEN } = require("./server/utility/constants");

// Set up the express app
const app = express();

const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Allow all origins without restrictions
app.use(cors({ origin: "*", credentials: true }));

// Log requests to the console.
app.use(logger("dev"));

Sentry.init({
  dsn: "https://62697854002c3b3789e0737992f31a9a@o1324264.ingest.sentry.io/4505894487457792",
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

// Sentry request and error handlers
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(Sentry.Handlers.errorHandler());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    console.log("access_token", req.cookies[ACCESS_TOKEN]);
    token = req.cookies[ACCESS_TOKEN];
  }
  return token;
};

const mongoString = process.env.DATABASE_URL;
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoString);
    console.log(`Mongo connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Import and use routes
const refPath = "./server/routes/";
require(`${refPath}affirmation`)(app);
require(`${refPath}dailyVerse`)(app);
require(`${refPath}testimony`)(app);
require(`${refPath}user`)(app);
require(`${refPath}feed`)(app);
require(`${refPath}feedComment`)(app);
require(`${refPath}feedStatus`)(app);
require(`${refPath}prayer`)(app);
require(`${refPath}language`)(app);
require(`${refPath}suggestion`)(app);
require(`${refPath}prayerCatholic`)(app);
require(`${refPath}audio`)(app);
require(`${refPath}psalm`)(app);
require(`${refPath}novena`)(app);
require(`${refPath}log`)(app);
require(`${refPath}payment`)(app);
require(`${refPath}prayerRequest`)(app);
require(`${refPath}distress`)(app);
require(`${refPath}product`)(app);
require(`${refPath}terms`)(app);
require(`${refPath}dailyReading`)(app);

// Custom error handler
app.use((err, req, res, next) => res.json(err));

// Start server after connecting to DB
connectDB().then(() => {
  app.listen(process.env.PORT || 8001, () => {
    console.log(`Listening on port ${process.env.PORT || 8001}`);
  });
});

// Route for testing Sentry error reporting
app.get("/debug-sentry", (req, res) => {
  throw new Error("Test Sentry error!");
});

module.exports = app;
