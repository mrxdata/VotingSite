const { Pool } = require('pg');
require("dotenv").config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

pool.connect((err) => {
    if (err) {
        console.error("Ошибка подключения к базе данных:", err.message);
        return;
    }
    console.log("Подключение к базе данных PostgreSQL успешно установлено.");
});

module.exports = pool;
