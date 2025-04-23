require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    passqord: process.env.DB_PASS,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrpyt: true,
        enableArithAbort: true,
    },
};

module.exports = config;