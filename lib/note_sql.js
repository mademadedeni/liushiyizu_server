const query = require("./mysql");

// 注册用户
let addUser = function(value) {
	let _sql = "INSERT INTO t_user(user_code, user_name, user_password, user_permission, user_sex, user_age, user_phone, user_email, user_address) VALUES(?,?,?,?,?,?,?,?,?);";
	return query(_sql,value);
}

let updateNote = function (id,value) {
	var _sql = `UPDATE t_user SET ${value} WHERE id=${id}`;
	return query(_sql);
}

// 查找用户
let selectUser = function (type,row,value) {
	let _sql = "";
	if (type == '0') {
		_sql = `SELECT * FROM t_user LIMIT ${row.start},${row.end}`;
	}else{
		_sql = `SELECT * FROM t_user WHERE ${type} = '${value}' LIMIT ${row.start},${row.end}`;
	}
	return query(_sql);
}

let selectPermission = function () {
	let _sql = `SELECT permission_id FROM t_permission`;
	return query(_sql);
}

let deleteNote = function (id) {
	let _sql = `DELETE FROM t_user WHERE id IN (${id})`;
	return query(_sql);
}

module.exports = {
	addUser,
	selectUser,
	selectPermission,
	deleteNote,
	updateNote
}