const config = require('../config.js');
const userModel = require("../model/user.js");
const userSql = require("../lib/user.js");
const _ = require("lodash");
const utils = require("../utils/utils.js");
const md5 = require("md5");
const fs = require('fs');
const path = require("path");
const upload = require("./upload.js");
const svgCaptcha = require("svg-captcha");
const uuidv5 = require("uuid/v5");
const csprng = require("csprng");

// 用户注册
async function insertUser(ctx, next) {
    var user = new userModel(ctx.request.body);
    var captcha = _.get(ctx.request.body, "captcha");
    var auth = user.insertAuth();
    if (auth !== true) {
        ctx.body = {
            code: config.code.CODE_PARAMETER_ERROR,
            message: "参数错误：" + auth,
            success: false
        }
        return;
    }
    if (captcha !== ctx.session.captcha) {
        ctx.body = utils.bodyFormat({ success: false, message: "验证码错误", code: config.code.CODE_PARAMETER_ERROR });
        ctx.session.captcha = null;
        return;
    }
    await userSql.selectUserByName(user.name)
        .then(res => {
            if (res.length > 0) {
                ctx.body = utils.bodyFormat({
                    success: false,
                    message: "用户已存在"
                });
            } else {
                ctx.body = utils.bodyFormat({
                    success: true,
                    message: "success"
                });
            }
        }).catch(err => {
            if (err) {
                throw err;
            }
        });
    if (!ctx.body.success) {
        return;
    }
    var namespace = uuidv5("www.liushiyizu.top", uuidv5.DNS);
    var userId = uuidv5(user.name, namespace).replace(/-/g, '');
    var salt = csprng(80, 36);
    var password = md5(user.password + salt);
    var avatar = config.upload.requestPath + "/" + config.upload.defaultName;
    var code = utils.codeMd(user.password);
    await userSql.addUser({ id: userId, name: user.name, password: password, salt: salt, avatar: avatar, code: code })
        .then(res => {
            if (res.affectedRows > 0) {
                ctx.body = utils.bodyFormat();
            }
        }).catch(err => {
            ctx.throw(500, err);
        });
}
// 验证码
async function captcha(ctx, next) {
    ctx.type = 'svg';
    var captcha = svgCaptcha.create({
        width: 150,
        height: 40
    });
    ctx.session.captcha = captcha.text;
    ctx.body = captcha.data;
}

// 更新用户信息
async function updateUser(ctx, next) {
    var userId = ctx.params.id;
    var reqBody = ctx.request.body;
    if (reqBody && (reqBody.hasOwnProperty("id") || reqBody.hasOwnProperty("name") || reqBody.hasOwnProperty("password") || reqBody.hasOwnProperty("permission"))) {
        ctx.body = utils.bodyFormat({ success: false, message: "参数错误", code: config.code.CODE_PARAMETER_ERROR });
        return;
    }
    var user = new userModel(reqBody);
    var auth = user.updateAuth();
    if (auth !== true) {
        ctx.body = utils.bodyFormat({ success: false, message: "参数错误：" + auth });
        return;
    }
    await userSql.updateUser(userId, user.updateToString()).then((res) => {
        if (res.affectedRows > 0) {
            ctx.body = utils.bodyFormat();
        } else {
            ctx.body = utils.bodyFormat({ success: false });
        }
    }).catch((error) => {
        ctx.throw(500, error);
    });
    await userSql.selectUserById(userId).then((res) => {
        if (res.length > 0) {
            updateSession(ctx, res[0]);
        }
    }).catch((error) => {
        ctx.throw(500, error);
    });
}
// 根据用户名查询用户
async function selectUser(ctx, next) {
    var userName = ctx.query.userName;
    if (new userModel({ name: userName }).authName()) {
        ctx.body = {
            code: config.code.CODE_PARAMETER_ERROR,
            message: "参数错误：name",
            success: false
        }
    }
    await userSql.selectUserByName(userName).then((res) => {
        if (res.length > 0) {
            ctx.body = {
                code: config.code.CODE_SUCCESS,
                message: "success",
                data: getSessionUser(res[0]),
                success: true
            }
        } else {
            ctx.body = {
                code: config.code.CODE_SUCCESS,
                message: "success",
                data: null,
                success: false
            }
        }
    }).catch(err => {
        if (err) {
            throw err;
        }
    })
}
// 根据id查询用户
async function selectUserById(ctx, next) {
    var userId = ctx.params.id;
    if (_.isEmpty(userId) || _.isNull(userId) || _.isNil(userId)) {
        ctx.body = {
            code: config.code.CODE_PARAMETER_ERROR,
            message: "参数错误：name",
            success: false
        }
    }
    await userSql.selectUserById(userId).then((res) => {
        if (res.length > 0) {
            ctx.body = {
                message: "success",
                code: config.code.CODE_SUCCESS,
                data: res[0],
                success: true
            }
        } else {
            ctx.body = {
                message: "success",
                code: config.code.CODE_SUCCESS,
                data: null,
                success: true
            }
        }
    }).catch(err => {
        if (err) {
            throw err;
        }
    });
}
// 登录
async function userLogin(ctx, next) {
    var params = ctx.request.body;
    var user = new userModel({ name: params.name, password: params.password });
    var authRes = user.insertAuth();
    if (authRes !== true) {
        ctx.body = {
            code: config.code.CODE_PARAMETER_ERROR,
            message: "参数错误：" + authRes,
            success: false
        }
        return;
    }

    await userSql.selectUserByName(user.name).then((res) => {
        if (res.length > 0) {
            var password = md5(user.password + res[0].salt);
            if (res[0].password == password) {
                updateSession(ctx, res[0]);
                ctx.body = {
                    code: config.code.CODE_SUCCESS,
                    message: "success",
                    data: getSessionUser(ctx),
                    success: true
                }
            } else {
                ctx.body = {
                    code: config.code.CODE_SUCCESS,
                    message: "密码不正确",
                    success: false
                }
            }
        } else {
            ctx.body = {
                code: config.code.CODE_SUCCESS,
                message: "用户不存在",
                success: false
            }
        }
    }).catch((err) => {
        if (err) {
            throw err;
        }
    });

}
// 自动登录
async function autoLogin(ctx, userId) {
    await userSql.selectUserById(userId).then((res) => {
        if (res.length > 0) {
            updateSession(ctx, res[0]);
            ctx.body = {
                code: config.code.CODE_SUCCESS,
                message: "success",
                data: getSessionUser(ctx),
                success: true
            }
        } else {
            ctx.body = {
                code: config.code.CODE_SUCCESS,
                message: "用户不存在",
                success: false
            }
        }
        console.log(1);
    }).catch(err => {
        if (err) {
            throw err;
        }
    });
}
// 更新session
function updateSession(ctx, user) {
    ctx.session.user = user;
    if (ctx.request.body.autoLogin === true) {
        ctx.cookies.set(config.session.memoryName, ctx.session.user.id, {
            maxAge: config.session.memoryTimeout,
            // signed:'',
            // expires:new Date('2018-11-26 18:22:00'),
            path: '/',
            // domain:'',
            secure: false,
            httpOnly: true,
            overwrite: false,
        });
    }
}
// 清除session
function clearSession(ctx) {
    ctx.cookies.set(config.session.sessionName, "", { maxAge: 0 });
    ctx.cookies.set(config.session.memoryName, "", { maxAge: 0 });
    ctx.session.user = undefined;
}
// 获取用户信息也可做检查登录判断
async function userInfo(ctx, next) {
    if (ctx.session.user) {
        ctx.body = {
            code: config.code.CODE_SUCCESS,
            message: "success",
            data: getSessionUser(ctx),
            success: true
        }
    } else {
        if (ctx.cookies.get(config.session.memoryName)) {

            return;
        }
        ctx.body = {
            code: config.code.CODE_NOT_LOGIN,
            message: "未登录",
            data: null,
            success: false
        }
    }
}
// 退出登录
async function userExit(ctx, next) {
    clearSession(ctx);
    ctx.body = {
        code: config.code.CODE_SUCCESS,
        message: "success",
        success: true
    }
}
// 从session中获取用户信息，会过滤掉敏感信息
function getSessionUser(ctx) {
    var user = ctx.session.user;
    if (!user) {
        return null;
    } else {
        return {
            id: user.id,
            name: user.name,
            sex: user.sex,
            // password: user.password,
            // code: user.code,
            nickname: user.nickname,
            permission: user.permission,
            age: user.age,
            phone: user.phone,
            email: user.email,
            address: user.address,
            avatar: user.avatar,
            signature: user.signature,
            // createDate: user.createDate,
            // updateDate: user.updateDate,
        };
    }
}
// 上传头像
async function uploadAvatar(ctx, next) {
    if (ctx.request.files) {
        const file = ctx.request.files.file;
        const user = ctx.session.user;
        // 头像:userId+后缀
        var basename = user.id + path.extname(file.name);
        var avatarUrl = config.upload.requestPath + "/" + basename;
        var writeState = "";
        await upload.upload(file, {
            writePath: config.upload.savePath,
            fileType: ["image/jpeg", "image/png"],
            fileName: basename,
            maxSize: 500
        }).then(resolve => {
            if (resolve == "success") {
                writeState = "success";
            } else {
                writeState = resolve;
            }
        }).catch(err => {
            ctx.response.status = 500;
            console.log(err);
            ctx.body = {
                code: config.code.CODE_UNKNOWN_ERROR,
                message: err,
                success: false
            }
        });
        if (writeState !== "success") {
            ctx.body = {
                code: config.code.CODE_UNKNOWN_ERROR,
                message: writeState,
                success: false
            }
            return;
        }
        await userSql.updateUser(user.id, new userModel().updateToString({ avatar: avatarUrl }))
            .then(res => {
                if (res.affectedRows > 0) {
                    ctx.session.user.avatar = avatarUrl;
                    ctx.body = {
                        code: config.code.CODE_SUCCESS,
                        message: 'success',
                        data: avatarUrl,
                        success: true
                    };
                } else {
                    ctx.body = {
                        code: config.code.CODE_UNKNOWN_ERROR,
                        message: 'save error',
                        success: false
                    };
                }
            }).catch(err => {
                console.log('error', err)
                ctx.response.status = 500;
                ctx.body = {
                    code: config.code.CODE_UNKNOWN_ERROR,
                    message: err,
                    success: false
                }
            });
    } else {
        ctx.body = {
            code: config.code.CODE_PARAMETER_ERROR,
            message: "参数错误",
            success: false
        }
    }
}
module.exports = {
    insertUser,
    updateUser,
    selectUser,
    selectUserById,
    userLogin,
    userInfo,
    userExit,
    autoLogin,
    uploadAvatar,
    captcha,
}