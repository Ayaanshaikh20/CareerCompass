const express = require("express");
const app = express();
const port = 8000;
const cors = require("cors");
const path = require("path");
require("dotenv").config();

app.use(cors());
app.use(express.json());

// ✅ API routes first
app.use(require("./controllers/register"));
app.use(require("./controllers/login"));
app.use(require("./controllers/applications"));
app.use(require("./controllers/refreshToken"));
app.use(require("./controllers/newApplication"));
app.use(require("./controllers/editApplication"));
app.use(require("./controllers/deleteApplication"));

app.get("/", (req, res) => {
  res.send("Hello world");
});

// // ✅ Then serve static files
// app.use(express.static(path.join(__dirname, "../frontend/build")));

// // ✅ Catch-all route for SPA (after all API routes!)
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
