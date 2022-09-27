/* Connection file to database (bridge between Node.js & MySQL) */

// Documentation: https://www.npmjs.com/package/mysql2

const mysql = require('mysql2');

const envVars = require('../utils/environmentUtil')
// console.log(envVars)

// Note: environment variables are stored in a (local) .env file.
const dbConn = mysql.createConnection({
    host: process.env.mysqlConnection_host,
    user: process.env.mysqlConnection_user,
    password: process.env.mysqlConnection_password,
    database: process.env.mysqlConnection_database
});

dbConn.connect();

// Testing connection was successful.
// dbConn.query('SELECT * FROM Artifacts', function(error, results, fields) {
//     if (error) {
//         throw error;
//     }
//     console.log("The artifacts are: ", results)
//     console.log("Connection to MySQL KnowledgeStitcher Database was successful.")
// })

// dbConn.end();

module.exports = dbConn;