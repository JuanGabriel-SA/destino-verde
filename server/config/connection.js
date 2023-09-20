const mysql = require("mysql");

const connection = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'destino-verde',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = connection;