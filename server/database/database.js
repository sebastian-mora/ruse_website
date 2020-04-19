var mysql = require('mysql');

var con = mysql.createConnection({
  host: "10.0.0.219",
  user: "seb",
  password: "test",
  database:'sqldev'
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = con;