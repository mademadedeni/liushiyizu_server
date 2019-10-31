const config = require("../config.js");
const { loginList } = require("../middleware/loginList.js");
const _ = require("lodash");

module.exports = async (ctx, next) => {
    var route = undefined;
    _.each(loginList, function (router) {
        var url = config.prefix + router.url;
        if (url.indexOf(":") > -1) {
            url = ctx.originalUrl.match(new RegExp(router.regExp));
        }
        if (url == ctx.originalUrl) {
            route = router;
            return false;
        }
    });
    if (route) {
        if (ctx.session.user) {
            if (route.permission > ctx.session.user.permission) {
                ctx.body = {
                    code: config.code.CODE_NOT_PERMISSION,
                    message: "没有权限",
                    success: false
                }
            }
            await next();
        } else {
            ctx.body = {
                code: config.code.CODE_NOT_LOGIN,
                message: "未登录",
                success: false
            }
        }
    } else {
        await next();
    }
}