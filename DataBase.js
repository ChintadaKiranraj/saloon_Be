const Pool = require("pg").Pool;
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "Nodejs_Database",  // this is the data base name i n this data base having the students table
    password: "KIRAN1998",
    port: 5432,
})

module.exports = pool;