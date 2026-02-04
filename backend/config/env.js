require("dotenv").config();

const isProd = process.env.NODE_ENV === "production";

const config = {
  env: process.env.NODE_ENV,
  databaseUrl: isProd
    ? process.env.DATABASE_URL_PROD
    : process.env.DATABASE_URL_DEV,
  frontendUrl: isProd
    ? process.env.FRONTEND_URL_PROD
    : process.env.FRONTEND_URL_DEV,
};

if (!config.databaseUrl) {
  throw new Error("❌ DATABASE URL is not defined");
}

module.exports = config;