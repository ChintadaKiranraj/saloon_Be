// const Pool = require("pg").Pool;
// const pool = new Pool({
//     user: "postgres",
//     host: "localhost",
//     database: "postgres",  // this is the data base name i n this data base having the students table
//     password: "root",
//     port: 5432,
// })

// module.exports = pool;

const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'root',
    port: 5432,
});
module.exports = {
    dbConnection: function () {
        return pool.connect();
    }
};


