const config = require('../config.js');

var dataFormat = async (ctx, next) => {
    try {
        //先去执行路由
        await next();
    } catch (error) {
        throw error;
    }

    switch (ctx.status) {
        case 200:
            //通过正则的url进行格式化处理
            if (/^\/api/.test(ctx.originalUrl)) {
                if (ctx.type !== "image/jpg") {
                    if (!ctx.body.code) {
                        ctx.body.code = config.code.CODE_SUCCESS;
                    }
                }
            }
            break;
        case 404:
            ctx.body = {
                code: 404,
                message: '404',
                success: false
            }
            break;
        case 500:
            ctx.body = {
                code: 500,
                message: '500',
                success: false
            }
            break;
        default:
            break;
    }
}

module.exports = dataFormat;