const express = require("express");
const app = express();
const port = 8000;
const cors = require("cors");
const { rateLimit } = require("express-rate-limit")
require("dotenv").config();

const limiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	limit: 15, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
	// store: ... , // Redis, Memcached, etc. See below.
});

app.use(cors());
app.use(limiter);
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
