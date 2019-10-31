const query = require("./mysql");

// 添加文章
let createArticle = function (value) {
    let _sql = "INSERT INTO t_article SET ?;";
    return query(_sql, value);
}
//更新文章
let updateArticle = function (id, value) {
    let _sql = `UPDATE t_article SET ? WHERE id='${id}'`;
    return query(_sql, value);
}
// 通过ID查找文章
let selectArticleById = function (id) {
    let _sql = `SELECT t_article.id,t_article.title,t_article.content,t_article.create_date,t_article.update_date,t_article.permission,
                t_user.id AS user_id,t_user.name,t_user.permission AS user_permission,t_user.nickname,t_user.avatar
                FROM t_article INNER JOIN t_user ON t_article.user_id = t_user.id WHERE t_article.id=?`;
    return query(_sql, id);
}

// 查找文章
let selectArticle = function (params) {
    let _sql = `SELECT t_article.id,title,content,t_article.create_date,t_article.update_date,t_article.permission,
        t_user.name,nickname,t_user.permission AS user_permission,t_user.id AS user_id,phone,avatar
        FROM t_article INNER JOIN t_user ON t_article.user_id = t_user.id ORDER BY t_article.update_date LIMIT ${params.pageIndex},${params.pageSize}`;
    return query(_sql);
}

let selectArticleByUserId = function (userId, pageIndex, pageSize) {
    let _sql = `SELECT t_article.id,t_article.title,t_article.content,t_article.create_date,t_article.update_date,t_article.permission,
                t_user.id AS user_id,t_user.name,t_user.permission AS user_permission,t_user.nickname,t_user.avatar
                FROM t_article INNER JOIN t_user ON t_article.user_id = t_user.id WHERE t_user.id = ? LIMIT ${pageIndex},${pageSize}`;
    return query(_sql, userId);
}

// 统计文章总数
let countArticle = function (userId) {
    let _sql;
    if (userId) {
        _sql = `SELECT Count(*) AS count FROM t_article WHERE t_article.user_id = ?`;
        return query(_sql, userId);
    } else {
        _sql = `SELECT Count(*) AS count FROM t_article`;
        return query(_sql);
    }

}

let deleteArticle = function (id) {
    let _sql = `DELETE FROM t_article WHERE id IN (${id})`;
    return query(_sql);
}

module.exports = {
    createArticle,
    updateArticle,
    selectArticle,
    selectArticleById,
    selectArticleByUserId,
    countArticle,
    deleteArticle
}