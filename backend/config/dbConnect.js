const { Pool } = require("pg");
require("dotenv").config();

// Simplify: Just use one config object. 
// On EC2, these variables will come from your .env file.
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  // NO SSL needed for localhost connections
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Database connected successfully to:", process.env.DB_NAME);
    client.release();
  } catch (err) {
    console.error("❌ Database connection error:", err.message);
    // Pro-tip: Log the variables to see what's missing (hide password though!)
    console.log("Attempted connection with User:", process.env.DB_USER, "on Host:", process.env.DB_HOST);
    process.exit(1);
  }
})();

module.exports = pool;