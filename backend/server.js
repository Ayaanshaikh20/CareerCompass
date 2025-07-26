const express = require("express");
const app = express();
const port = 8000;
const cors = require("cors");
require("dotenv").config();

app.use(cors());

app.use(express.json());

// ✅ API routes first
app.use(require("./controllers/Register"));
app.use(require("./controllers/Login"));
app.use(require("./controllers/Applications"));
app.use(require("./controllers/RefreshToken"));
app.use(require("./controllers/NewApplication"));
app.use(require("./controllers/EditApplication"));
app.use(require("./controllers/DeleteApplication"));

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
