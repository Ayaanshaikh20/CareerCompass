const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { verifyAccessToken } = require("./config/generateTokens");
require("dotenv").config();
const config = require("./config/env");
const fileUpload = require("express-fileupload");
const port = process.env.PORT || 8000;
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);
app.use(fileUpload());


/* ===========================
   API ROUTES (FIRST)
=========================== */
app.use(require("./controllers/auth/ForgetPassword"));
app.use(require("./controllers/auth/ResetPassword"));
app.use(require("./controllers/auth/Register"));
app.use(require("./controllers/auth/Login"));
app.use(require("./controllers/auth/GuestLogin"));
app.use(require("./controllers/auth/RefreshToken"));
app.use(require("./controllers/auth/Logout"));

//Health check
app.get("/health", async (req, res) => {
  res.send(`Backend up and running`);
});

//Start message
app.get("/", (req, res) => {
  res.send("Career Compass API is live! Use /health to check status. ✅✅");
});

app.use(verifyAccessToken);
app.use(require("./controllers/main/Applications"));
app.use(require("./controllers/main/User"));
app.use(require("./controllers/main/Companies"));
app.use(require("./controllers/main/Notifications"));
app.use(require("./controllers/main/Documents"));
app.use(require("./controllers/main/Analyzer"));
app.use(require("./controllers/main/Payment"));

/* ===========================
   START SERVER
=========================== */
// Only start server if not in Lambda
if (process.env.AWS_EXECUTION_ENV === undefined) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;
