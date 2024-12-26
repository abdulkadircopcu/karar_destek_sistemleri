const mysql = require('mysql2/promise');
require('dotenv/config');

const dbConn = mysql.createPool({
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB_NAME,
    host: process.env.MYSQL_INSTANCE_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

dbConn.getConnection()
    .then(connection => {
        console.log("Veritabanı bağlantısı başarılı.");
        connection.release();
    })
    .catch(err => {
        console.error("Veritabanı bağlantı hatası:", err);
    });

module.exports = dbConn;