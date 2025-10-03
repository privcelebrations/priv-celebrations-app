// /server/db/index.js

const { Pool } = require('pg');

// Make sure your file has this EXACT code.
// This explicitly creates the connection pool using your .env variable names,
// which is why the new test script worked.
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432', 10),
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};