const express = require("express");
const app = express();
const port = 8000;
const cors = require("cors");
const dbConnect = require("./config/dbConnect");
require("dotenv").config();
app.use(cors());
app.use(express.json());

app.use(require("./controllers/Register"));

app.use(require("./controllers/Login"));

app.use(require("./controllers/RefreshToken"));

app.use(require("./controllers/NewApplication"));

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, () => {
  dbConnect();
  console.log(`Server is running on port ${port}`);
});
