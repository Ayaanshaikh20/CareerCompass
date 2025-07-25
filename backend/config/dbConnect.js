// db.js
const { Pool } = require('pg');
require("dotenv").config();

const pgConObj = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_NAME,
  family: 4
};


const pool = new Pool(pgConObj);

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test connection on startup
(async () => {
  try {
    const client = await pool.connect();
    console.log('Database connected successfully');
    client.release();
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
})();

module.exports = pool;
