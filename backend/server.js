const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { verifyAccessToken } = require("./config/generateTokens");
require("dotenv").config();
const config = require("./config/env");
const cron = require("node-cron");
const axios = require("axios");

const port = process.env.PORT || 8000;

app.use(cookieParser());
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  }),
);

// Schedule a task to run every 10 minutes
cron.schedule("*/10 * * * *", async () => {
  try {
    console.log("Running scheduled task every 10 minutes...");
  } catch (error) {
    console.error("Error in cron job:", error.message);
  }
});

app.use(express.json());

/* ===========================
   API ROUTES (FIRST)
=========================== */
app.use(require("./controllers/ForgetPassword"));
app.use(require("./controllers/ResetPassword"));
app.use(require("./controllers/Register"));
app.use(require("./controllers/Login"));
app.use(require("./controllers/RefreshToken"));
app.use(require("./controllers/Logout"));

//Health check
app.get("/health", async (req, res) => {
  res.send(`Backend up and running`);
});

//Start message
app.get("/", (req, res) => {
  res.send("Career Compass API is live! Use /health to check status. ✅✅");
});

app.use(verifyAccessToken);
app.use(require("./controllers/Applications"));
app.use(require("./controllers/NewApplication"));
app.use(require("./controllers/EditApplication"));
app.use(require("./controllers/DeleteApplication"));
app.use(require("./controllers/EditProfile"));
app.use(require("./controllers/FetchUser"));

/* ===========================
   START SERVER
=========================== */
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
