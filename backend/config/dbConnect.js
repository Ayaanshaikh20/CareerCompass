const { Pool } = require("pg");
const config = require("./env");

const isProd = config.env === "production";

const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: isProd ? { rejectUnauthorized: false } : false,
  max: 2, // VERY IMPORTANT for Lambda + Neon
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on("connect", () => {
  console.log(`✅ Connected to ${isProd ? "Neon (PROD)" : "Local PG"}`);
});

module.exports = pool;
