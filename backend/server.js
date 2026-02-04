const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { verifyAccessToken } = require("./config/generateTokens");
require("dotenv").config();
const config = require("./config/env");
const serverless = require("serverless-http");

const port = process.env.PORT || 8000;

app.use(cookieParser());
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  }),
);
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
if (config.env === "development") {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;
