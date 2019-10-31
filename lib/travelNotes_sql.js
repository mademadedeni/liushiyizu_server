const query = require("./mysql");

// 注册用户
let addTravelNotes = function(value) {
  let _sql = "INSERT INTO t_travelNotes(notes_author, notes_title, notes_content, notes_createDate, notes_editDate, notes_money, notes_label, notes_status) VALUES(?,?,?,?,?,?,?,?);";
  return query(_sql, value);
}
// 通过名字查找用户
let selectTravelNotes = function (title) {
  let _sql = `SELECT * FROM t_travelNotes WHERE notes_title="${title}"`
  return query(_sql);
}

let updateTravelNotes = function (id,value) {
	var _sql = `UPDATE t_travelNotes SET ${value} WHERE notes_id=${id}`;
	return query(_sql);
}

module.exports={
	addTravelNotes,
	selectTravelNotes,
	updateTravelNotes
}