const sql = require('mssql');
const config = require('../dbConfig');

module.exports = async function (context, req) {
    const {username, comment} = req.body;

    if (!username || !comment) {
        context.res = {
            status: 400,
            body: 'Missing username or comments',
        };
        return;
    }
    try {
        await sql.connect(config);

        await sql.query`INSERT INTO Comments (username, comment) VALUES (${username}, ${comment})`;
        context.res = {
            status: 201,
            body: 'Comment added succesfully',
        };
    } catch (err) {
        
        context.res = {
            status: 500,
            body: 'Error adding comment: ' + err.message,
        };
    }

};