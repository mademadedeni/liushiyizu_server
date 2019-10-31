var mysql = require('mysql');
var config = require('../config.js');
var _ = require("lodash");

var pool = mysql.createPool({
   connectionLimit: 20,
   host: config.sql.host,
   port: config.sql.port,
   user: config.sql.user,
   connectTimeout: config.sql.timeout,
   password: config.sql.password,
   database: config.sql.database
});
// console.log(pool);

let query = function (sql, values) {

   return new Promise((resolve, reject) => {
      pool.getConnection(function (err, connection) {
         if (err) {
            reject(err);
         } else {
            connection.query({ sql: sql, values: values }, (err, rows) => {
               if (err) {
                  reject(err);
               } else {
                  var rows = JSON.parse(JSON.stringify(rows));
                  if(Array.isArray(rows)){
                     _.each(rows, (row, key) => {
                        rows[key] = _.mapKeys(row, function (value, key) {
                           return _.camelCase(key);
                        });
                     });
                  }
                  resolve(rows);
               }
               connection.release();
            })
         }
      })
   })

}
module.exports = query