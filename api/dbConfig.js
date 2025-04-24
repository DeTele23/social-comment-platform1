require('dotenv').config();
const sql = require('mssql');

const config = {
    connectionString: process.env.AZURE_SQL_CONN,
    options: {
        encrpyt: true,
        enableArithAbort: true,
    },
};

module.exports = config;