const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const { verifyAccessToken } = require("./config/generateTokens");
require("dotenv").config();

const port = process.env.PORT || 8000;

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

/* ===========================
   API ROUTES (FIRST)
=========================== */
app.use(require("./controllers/Register"));
app.use(require("./controllers/Login"));
app.use(require("./controllers/RefreshToken"));
app.use(require("./controllers/Logout"));

app.use(verifyAccessToken);
app.use(require("./controllers/Applications"));
app.use(require("./controllers/NewApplication"));
app.use(require("./controllers/EditApplication"));
app.use(require("./controllers/DeleteApplication"));
app.use(require("./controllers/EditProfile"));
app.use(require("./controllers/FetchUser"));

/* ===========================
   SERVE FRONTEND (PRODUCTION)
=========================== */
const frontendPath = path.join(__dirname, "../frontend/dist");

app.use(express.static(frontendPath));

/* SPA fallback (React Router support) if /api is not in request url then render index.html */
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

/* ===========================
   START SERVER
=========================== */
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
