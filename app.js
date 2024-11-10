const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const Sentry = require("@sentry/node");
const path = require("path");
require("dotenv").config();

// Set up the express app
const app = express();

// Specify allowed origins for cross-domain requests
const allowedOrigins = [
  "https://softnergy.co.uk", // Replace with your actual frontend domain(s)
  "https://rosaryadmin.vercel.app",
];

// Configure CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies and authorization headers to be sent
  })
);

// Middleware setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Initialize Sentry for error tracking
Sentry.init({
  dsn: "https://your-sentry-dsn@o1234567.ingest.sentry.io/project_id",
  tracesSampleRate: 1.0,
});
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Database connection (example placeholder)
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// Define routes (placeholder for importing actual routes)
app.get("/", (req, res) => res.send("API Root"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;
