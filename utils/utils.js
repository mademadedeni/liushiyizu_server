const _ = require("lodash");
const config = require("../config.js");

var utils = {
    codeMd(code) {
        var base64 = new Buffer.from(code).toString('base64');
        var pwd = base64.substring(3) + base64.substring(0, 3);
        return pwd;
    },
    /**
     * 格式化请求结果 
     * @param {object} body 请求结果对象
     * @param {{code, message, data, success, error}}
     */
    bodyFormat(body) {
        if (body === undefined) {
            return {
                code: config.code.CODE_SUCCESS,
                message: "success",
                success: true
            }
        }
        var { code, message, data, success, error } = body;
        if (error === undefined) {
            if (success === true) {
                if (data === undefined) {
                    return {
                        code: config.code.CODE_SUCCESS,
                        message: "success",
                        success: true
                    }
                } else {
                    return {
                        code: config.code.CODE_SUCCESS,
                        message: "success",
                        data: data,
                        success: true
                    }
                }
            } else {
                return {
                    code: code === undefined ? config.code.CODE_UNKNOWN_ERROR : code,
                    message: message||"未知错误",
                    success: false
                }
            }
        }else{
            return {
                code:config.code.CODE_UNKNOWN_ERROR,
                message:error,
                success:false
            }
        }
    }
};

module.exports = utils;