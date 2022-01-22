const mysql = require("mysql");

const con = mysql.createConnection({
    connectionLimit: 100,
    host: "liderenergia.atthost24.pl",
    user: "19315_biostories",
    password: "SwinkaPeppa-31",
    database: "19315_biostories"
});

module.exports = con;
