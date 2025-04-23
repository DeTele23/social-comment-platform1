const sql = require('mssql');
const config = require('../dbConfig');

module.exports = async function (context, req) {
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT * FROM Comments');
        context.res = {
            status: 200,
            body: result.recordset,
        };

    } catch (err) {
        context.res = {
            status: 500,
            body: 'Database error: ' + err.message,
        };
    }
};