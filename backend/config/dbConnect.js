const { Pool } = require('pg');
require("dotenv").config();

let pool;

if (process.env.NODE_ENV === 'production') {
  // For Render or other hosted environments
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  // For local development
  pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
}

// Optional: graceful error handler
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Initial test connection
(async () => {
  try {
    const client = await pool.connect();
    console.log('Database connected successfully');
    client.release();
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
})();

module.exports = pool;
