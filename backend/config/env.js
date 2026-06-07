require("dotenv").config();

const isProd = process.env.NODE_ENV === "production";

const config = {
  env: process.env.NODE_ENV,
  frontendUrl: isProd
    ? process.env.FRONTEND_URL_PROD
    : process.env.FRONTEND_URL_DEV,
};

module.exports = config;