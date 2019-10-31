const query = require("./mysql");

// 注册用户
let insertUser = function( value ) {
  let _sql = "insert into tp_users(name,pass) values(?,?);"
  return query( _sql, value )
}
// 通过名字查找用户
let findUserByName = function (  name ) {
  let _sql = `SELECT * from tp_users where USER_NAME = "${name}"`;
  return query( _sql)
}
// 通过手机号查找用户
let findUserByPhone = function (  phone ) {
  let _sql = `SELECT * FROM tp_users WHERE USER_MOBILE = "${phone}"`
  // let _sql = `SELECT * FROM tp_users WHERE USER_MOBILE = 15701658745`
  return query( _sql)
}
module.exports={
	insertUser,
	findUserByName,
	findUserByPhone
}