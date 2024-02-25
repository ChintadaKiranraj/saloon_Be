// const Pool = require("pg").Pool;
// const pool = new Pool({
//     user: "postgres",
//     host: "localhost",
//     database: "postgres",  // this is the data base name i n this data base having the students table
//     password: "root",
//     port: 5432,
// })

// module.exports = pool;
require('dotenv').config()
const { Pool } = require('pg');
const pool = new Pool({
    user: process.env.DB_USERNAME,
    host: 'localhost',
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
});

module.exports = {
    dbConnection: function () {
        return pool.connect();
    }
};

