const mysql = require('mysql2');
const loggers = require("./logger.js");

let handler_name = "SQL Handler";
let credentials = require('../config/credentials.json');

let log = (...data) => {loggers.log(handler_name, data)}
let debug = (...data) => {loggers.log(handler_name, data)}

let connection = mysql.createConnection({
    host: credentials.mysql.uri,
    user: credentials.mysql.username,
    password: credentials.mysql.password
});

function createTables() {}

function handle_errors(error) {
    
    switch (error.code) {
        case "PROTOCOL_CONNECTION_LOST":
            debug("Lost connection... Reconnecting");
            connection.connect();
            break;
    
        case "ERR_DUPLICATE_ENTRY":
            debug("Non-Fatal | Duplicate Entry Error");
            break;

        default:
            debug("Unknown SQL Error: ",error.sqlMessage);
            break;
    }
}

module.exports = {
    handle_errors,
    query: connection.query
}