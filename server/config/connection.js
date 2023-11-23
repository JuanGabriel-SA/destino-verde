const mysql = require("mysql");

const connection = mysql.createPool({
    host: 'destino-verde-dataserver.mysql.database.azure.com',
    port: 3306,
    user: 'bushouko',
    password: 'Bobli947*',
    database: 'destino-verde-database',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = connection;