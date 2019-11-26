const articleSql = require('../lib/articleSql.js');
const utils = require('../utils/utils.js');
const articleModel = require('../model/article.js');
const _ = require('lodash');
const config = require('../config.js');
const uuidv4 = require("uuid/v4");

/**
 * 创建文章
 * @param {string} title 文章标题
 * @param {string} content 文章内容
 */
async function createArticle(ctx, next) {
    var article = new articleModel(ctx.request.body);
    var auth = article.insertAuth();
    if (auth !== true) {
        ctx.body = utils.bodyFormat({
            success: false,
            code: config.code.CODE_PARAMETER_ERROR,
            message: "参数错误"
        });
        return;
    }

    article.id = uuidv4().replace(/-/g, '');
    article.user_id = ctx.session.user.id;
    article.permission = ctx.session.user.permission;
    article.create_date = utils.dateTime();
    article.update_date = utils.dateTime();
    await articleSql.createArticle(article).then(res => {
        if (res.affectedRows > 0) {
            ctx.body = utils.bodyFormat();
        } else {
            ctx.body = utils.bodyFormat({
                success: false,
                message: "创建失败"
            });
        }
    }).catch(err => {
        ctx.throw(500, err);
    });
}
/**
 * 创建文章
 * @param {string} id 文章id
 * @param {string} title 文章标题
 * @param {string} content 文章内容
 */
async function updateArticle(ctx, next) {
    var article = new articleModel(ctx.request.body);
    var auth = article.updateAuth();
    if (auth !== true) {
        ctx.body = utils.bodyFormat({
            code: config.code.CODE_PARAMETER_ERROR,
            success: false,
            message: "参数错误：" + auth
        });
        return;
    }
    var art = {};
    await articleSql.selectArticleById(article.id).then(res => {
        if (res.length > 0) {
            art = res[0];
        }
    }).catch(err => {
        ctx.throw(500, err);
    });
    if (_.isEmpty(art)) {
        ctx.body = utils.bodyFormat({
            success: false,
            message: "文章不存在",
        });
        return;
    } else if (art.userId !== ctx.session.user.id) {
        ctx.body = utils.bodyFormat({
            success: false,
            message: "没有权限",
            code: config.code.CODE_NOT_PERMISSION
        });
    }
    var articleId = ctx.params.id;
    await articleSql.updateArticle(articleId, article.updateArticle()).then(res => {
        if (res.affectedRows > 0) {
            ctx.body = utils.bodyFormat();
        } else {
            ctx.body = utils.bodyFormat({
                success: false,
                message: "更新失败"
            });
        }
    }).catch(err => {
        ctx.throw(500, err);
    });
}


/**
 * 通过ID查询文章
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
async function selectArticleById(ctx, next) {
    var articleId = ctx.params.id;

    if (_.isNil(articleId) || _.isNull(articleId) || articleId === "") {
        ctx.body = utils.bodyFormat({
            success: false,
            message: "参数错误",
            code: config.code.CODE_PARAMETER_ERROR
        });
        return;
    }

    await articleSql.selectArticleById(articleId)
        .then(res => {
            if (res.length > 0) {
                ctx.body = utils.bodyFormat({
                    success: true,
                    data: res[0]
                });
            } else {
                ctx.body = utils.bodyFormat({
                    success: false,
                    message: "文章不存在"
                });
            }
        }).catch(err => {
            ctx.throw(500, err);
        });
}

/**
 * 获取文章
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
async function selectArticle(ctx, next) {
    var { pageNum, pageSize } = ctx.request.query;
    var pageIndex = (pageNum - 1) * pageSize;

    if (!_.isInteger(pageIndex - 0) || !_.isInteger(pageSize - 0) || pageIndex < 0 || pageSize <= 0) {
        ctx.body = utils.bodyFormat({ success: false, message: "参数错误", code: config.code.CODE_PARAMETER_ERROR });
        return;
    }

    await articleSql.selectArticle({ pageIndex: pageIndex, pageSize: pageSize })
        .then(res => {
            if (res.length > 0) {
                ctx.body = utils.bodyFormat({
                    success: true,
                    data: res
                });
            } else {
                ctx.body = utils.bodyFormat({
                    success: true,
                    data: []
                });
            }
        }).catch(err => {
            ctx.throw(500, err);
        });
    ctx.body.pageNum = pageNum;
    ctx.body.pageSize = pageSize;
    // 统计
    await articleSql.countArticle()
        .then(res => {
            if (res.length > 0) {
                ctx.body.totalCount = res[0]['count'];
            } else {
                ctx.body.totalCount = 0;
            }
        }).catch(err => {
            ctx.throw(500, err);
        });
}

/**
 * @param {[type]} userId
 */
async function selectArticleByUserId(ctx, next) {
    var userId = ctx.params.userId;
    var { pageNum, pageSize } = ctx.request.query;
    var pageIndex = (pageNum - 1) * pageSize;

    if (!_.isInteger(pageIndex - 0) || !_.isInteger(pageSize - 0) || pageIndex < 0 || pageSize <= 0) {
        ctx.body = utils.bodyFormat({
            success: false,
            message: "参数错误",
            code: config.code.CODE_PARAMETER_ERROR
        });
        return;
    }

    if (!_.isString(userId) || _.size(userId) != 32) {
        ctx.body = utils.bodyFormat({
            success: false,
            message: "参数错误",
            code: config.code.CODE_PARAMETER_ERROR
        });
        return;
    }

    await articleSql.selectArticleByUserId(userId, pageIndex, pageSize).then(function (res) {
        if (res.length > 0) {
            ctx.body = utils.bodyFormat({
                success: true,
                data: res
            });
        } else {
            ctx.body = utils.bodyFormat({
                success: true,
                data: []
            });
        }
    }).catch(function (error) {
        ctx.throw(500, error);
    });
    if (ctx.body.success) {
        // 统计
        await articleSql.countArticle(userId).then(res => {
            if (res.length > 0) {
                ctx.body.totalCount = res[0]['count'];
            } else {
                ctx.body.totalCount = 0;
            }
            ctx.body.pageNum = pageNum;
            ctx.body.pageSize = pageSize;
        }).catch(error => {
            ctx.throw(500, error);
        });
    }
}


/**@name  编辑或创建文章
 * @description  {code:{0:success,1:not login,2:not permission,3:content error,4:unkown error}}
 * @status  {1:创建,2:更新}
 * @return {[type]}
 */
async function editArticle(ctx, next) {
    //检查登录
    var user = ctx.session.user;
    var article_id = ctx.params.id;
    var article = ctx.request.body;
    //验证标题和内容
    if (!user) {
        return ctx.body = {
            code: config.CODE_NOT_LOGIN,
            message: "not login",
            data: false
        }
    }

    //权限验证 是否编辑，是否编辑自己文章||是否管理员
    if (article_id && (user.id != article.user_id && user.user_permission !== 1)) {
        return ctx.body = {
            code: config.CODE_NOT_PERMISSION,
            message: "not permission",
            data: false
        }
    }

    //如果是更新验证id
    if (article_id && !article_model.checkField(article_model.id.name, article_id)) {
        return ctx.body = {
            code: config.CODE_UNKNOWN_ERROR,
            message: "unkown error",
            data: false
        }
    }
    if (!article_model.checkField(article_model.title.name, article.title) || !article_model.checkField(article_model.content.name, article.content)) {
        return ctx.body = {
            code: 4,
            message: "content error",
            data: false
        }
    }

    if (article_id) {
        await articleSql.updateArticle(article_id, article_model.updateValue({
            article_title: article.title,
            article_content: article.content,
            article_update_date: Date.now(),
        })).then(res => {
            if (res.affectedRows > 0) {
                ctx.body = {
                    message: "success"
                }
            } else {
                ctx.body = {
                    message: "failed"
                }
            }
        }).catch(err => {
            ctx.response.status = 500;
            if (err) {
                console.log("article_controller:", err)
                throw err;
            }
        });
    } else {
        await articleSql.createArticle([user.id, article.title, article.content, Date.now(), Date.now()])
            .then(res => {
                if (res.affectedRows > 0) {
                    ctx.body = {
                        code: config.CODE_SUCCESS,
                        message: "success",
                    }
                }
            }).catch(err => {
                ctx.response.status = 500;
                if (err) {
                    console.log("article_controller:", err)
                    throw err;
                }
            });
    }

}



async function deleteArticle(ctx, next) {
    var user = ctx.session.user;
    let articleId = ctx.params.id;

    if (user.permission !== 1) {
        await articleSql.selectArticleById(articleId).then(res => {
            if (res.length > 0) {
                if (res[0].userId == user.id) {
                    ctx.body = {
                        message: 'success'
                    }
                } else {
                    ctx.body = {
                        message: '只能删除自己的文章'
                    }
                }
            } else {
                ctx.body = {
                    message: '文章不存在'
                }
            }
        }).catch(err => {
            ctx.throw(500, err);
        });

        if (ctx.body.message !== 'success') {
            return ctx.body = utils.bodyFormat({ success: false, message: ctx.message });
        }
    }

    await articleSql.deleteArticle(articleId).then(res => {
        if (res.affectedRows > 0) {
            ctx.body = utils.bodyFormat();
        } else {
            ctx.body = utils.bodyFormat({ success: false, message: "删除失败" });
        }
    }).catch(err => {
        ctx.throw(500, err);
    });
}

// 删除多条文章
async function deleteArticles(ctx, next) {
    //检查登录
    var user = ctx.session.user;
    let articleId = ctx.params.id;

    if (user.permission >= 3) {
        return ctx.body = {
            message: '没有权限',
            code: config.CODE_NOT_PERMISSION
        }
    }

    if (!_.isArray(articleId)) {
        return ctx.body = {
            message: 'id error',
            data: articleId
        }
    }
    _.each(articleId, function (value) {
        if (!utils.isInteger(value)) {
            return ctx.body = {
                message: 'id error',
                data: value
            }
        }
    });

    await articleSql.deleteArticle(articleId.join(','))
        .then(res => {
            if (res.affectedRows > 0) {
                ctx.body = {
                    message: 'success',
                    data: {
                        fieldCount: res.fieldCount,
                        successCount: res.affectedRows
                    }
                };
            } else {
                ctx.body = {
                    message: 'failed'
                }
            }
        }).catch(err => {
            if (err) {
                ctx.response.status = 500;
                ctx.body = {
                    message: err,
                    data: false
                }
            }
        });
}

module.exports = {
    selectArticleById,
    selectArticle,
    selectArticleByUserId,
    editArticle,
    updateArticle,
    deleteArticle,
    deleteArticles,
    createArticle,
}