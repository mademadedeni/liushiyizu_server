const pkg = require('./package.json');
const isDev = process.env.NODE_ENV == "development" || process.env.NODE_ENV == undefined;
const path = require("path");
const IP = "10.17.1.8";
var config = {
    // mode: 'universal',
    server: isDev ? {
        port: 4000,
        host: `${IP}`,
    } : {
        port: 8000,
        host: 'localhost',
    },
    sql: isDev ? {
        host: 'localhost', //数据库地址
        port: '3306', //数据库端口
        user: "root", //数据库用户名
        password: "root", //数据库密码
        database: "liushiyizu", //数据库名
        timeout: 30000, //请求超时30s
    } : {
        host: 'localhost', //数据库地址
        port: '3306', //数据库端口
        user: "root", //数据库用户名
        password: "lIu@123456X", //数据库密码
        // password: "root", //数据库密码
        database: "liushiyizu", //数据库名
        timeout: 30000, //请求超时30s
    },
    redis: { // 需要配置文件支持
        host: '127.0.0.1', //redis地址
        port: '9736', //redis端口号
        password: "liu123456x"
    },
    session: {
        sessionName: "liushiyizu",
        sessionTimeout: 1000 * 3600 * 0.5,
        memoryName: "MEMID",
        memoryTimeout: 1000 * 3600 * 24 * 7,
    },
    code: {
        CODE_SUCCESS: 0, //正常
        CODE_NOT_LOGIN: 1, // 未登录
        CODE_NOT_PERMISSION: 2, //没有权限
        CODE_PARAMETER_ERROR: 8, //参数错误
        CODE_FIELD_ILLEGAL: 9, //字段不合法
        CODE_UNKNOWN_ERROR: 10, //未知错误
    },
    upload: {
        url: __dirname + "/static", // 上传默认文件夹
        defaultName: "default.jpg", // 头像默认名称
        savePath: path.join(__dirname, "/static/image/avatar"), // 头像上传目录
        requestPath: "/image/avatar", // 头像请求地址
        tempdir: path.join(__dirname, "/temp")
    },
    prefix: "/api",
    uuid:"www.liushiyizu.top"
}

Object.assign(config, {
    env: {
        apiUrl: isDev ? `http://${IP}:${config.server.port}` : 'http://www.liushiyizu.top',
    }
})

module.exports = config;