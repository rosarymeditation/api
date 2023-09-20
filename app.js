const express = require("express");
const logger = require("morgan");
const Sentry = require("@sentry/node");
const ProfilingIntegration = require("@sentry/profiling-node");
const path = require("path");
const bodyParser = require("body-parser");

require("dotenv").config();
var cors = require("cors");
const { ACCESS_TOKEN } = require("./server/utility/constants");

// Set up the express app
const app = express();

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(cors({ credentials: true, origin: true }));
// Log requests to the console.
app.use(logger("dev"));

Sentry.init({
  dsn: "https://62697854002c3b3789e0737992f31a9a@o1324264.ingest.sentry.io/4505894487457792",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
});

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());
app.use(Sentry.Handlers.errorHandler());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const cookieExtractor = (res) => {
  let token = null;
  if (req && req.cookies) {
    console.log("access_token", req.cookies[ACCESS_TOKEN]);
    token = req.cookies[ACCESS_TOKEN];
  } else return token;
};
const mongoString =
  "mongodb+srv://nnamdi4nwosu:6xVUznWAtJ3mxNfy@cluster0.kbvmdmk.mongodb.net/test";
const mongoose = require("mongoose");
mongoose.connect(mongoString);
const database = mongoose.connection;
database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});
// Require our routes into the application.
const refPath = "./server/routes/";

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

app.use((err, req, res, next) => res.json(err));

app.set("port", process.env.PORT || 8001);

const server = app.listen(app.get("port"), function () {
  console.log("Server started on port " + app.get("port"));
});
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

module.exports = app;

// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();
// const mongoString = process.env.DATABASE_URL;
// const mongoose = require("mongoose");
// mongoose.connect(mongoString);
// const database = mongoose.connection;
// const app = express();

// app.use(express.json());
// app.use(cors());
// app.listen(process.env.PORT || 3000, () => {
//   console.log(`Server Started at ${3000}`);
// });
// //app.set("port", process.env.PORT || 8000);

// const refPath = "./server/routes/";
// require(`${refPath}testimony`)(app);
// require(`${refPath}user`)(app);
// require(`${refPath}feed`)(app);
// require(`${refPath}feedComment`)(app);
// require(`${refPath}feedStatus`)(app);
// require(`${refPath}prayer`)(app);
// require(`${refPath}language`)(app);
// require(`${refPath}suggestion`)(app);
// require(`${refPath}prayerCatholic`)(app);
// require(`${refPath}audio`)(app);
