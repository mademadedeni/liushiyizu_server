const query = require("./mysql.js");

// 注册用户
let addUser = function(value) {
  let _sql = "INSERT INTO t_user SET ?";
  return query(_sql, value)
}
// 通过名字查找用户
let selectUserByName = function (name) {
  let _sql = `SELECT * FROM t_user WHERE name=?`;
  return query(_sql,name)
}

// 通过Id查找用户
let selectUserById = function (id) {
  let _sql = `SELECT * FROM t_user WHERE id=?`;
  return query(_sql,id)
}
// 通过id更新用户信息
let updateUser = function (id,value) {
	var _sql = `UPDATE t_user SET ${value} WHERE id=?`;
	return query(_sql,id);
}

module.exports={
	addUser,
  updateUser,
	selectUserByName,
  selectUserById,
}