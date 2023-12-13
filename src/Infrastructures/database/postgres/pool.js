/* istanbul ignore file */

const { Pool } = require('pg');

// OLD CODE
// const testConfig = {
//   host: process.env.PGHOST_TEST,
//   port: process.env.PGPORT_TEST,
//   user: process.env.PGUSER_TEST,
//   password: process.env.PGPASSWORD_TEST,
//   database: process.env.PGDATABASE_TEST,
// };

// const prodConfig = {
//   host: process.env.PGHOST,
//   port: process.env.PGPORT,
//   user: process.env.PGUSER,
//   password: process.env.PGPASSWORD,
//   database: process.env.PGDATABASE,
// };

const poolConfig = {
  test: {
    host: process.env.PGHOST_TEST,
    port: process.env.PGPORT_TEST,
    user: process.env.PGUSER_TEST,
    password: process.env.PGPASSWORD_TEST,
    database: process.env.PGDATABASE_TEST,
  },
  production: {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  },
};

// const pool = process.env.NODE_ENV === 'test' ? new Pool(testConfig) : new Pool();

// const pool = new Pool(process.env.NODE_ENV === 'test' ? testConfig : prodConfig);

// If NODE_ENV is not set, it defaults to 'production'.
const pool = new Pool(poolConfig[process.env.NODE_ENV || 'production']);

module.exports = pool;

/*
  PENJELASAN

  Komentar kode istanbul ignore file berfungsi untuk memberitahu Jest bahwa berkas ini (pool.js)
  tidak perlu diuji. Berkas ini akan diabaikan oleh jest dan tidak akan masuk ke dalam laporan
  coverage test.
*/
