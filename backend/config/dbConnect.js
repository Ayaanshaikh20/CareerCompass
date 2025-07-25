// db.js
const { Pool } = require('pg');
require("dotenv").config();

const pgConObj = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_NAME,
  ssl: true,
  family: 4
};

const pool = new Pool(pgConObj);

module.exports = pool;
