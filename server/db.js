const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'TallerMecanico',
  password: 'postgres',
  port: 5432, 
});

module.exports = pool;

