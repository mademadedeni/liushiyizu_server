const Koa = require('koa');
const koaBody = require('koa-body');
const redisStore = require('koa-redis');
const redis = require('redis');
const session = require('koa-session-minimal');
const koastatic = require('koa-static');
const cors = require("koa2-cors");
const router = require('./router');
const dataFormat = require('./middleware/dataFormat');
const checkLogin = require('./middleware/checkLogin');
var userController = require("./controller/user.js");

const app = new Koa();

const isDev = process.env.NODE_ENV == "development" || process.env.NODE_ENV == undefined;

let config = require('./config.js');

async function start() {
    const host = config.server.host;
    const port = config.server.port;

    if (isDev) {
        // cors 同源策略
        app.use(cors({
            origin: function (ctx) {
                if (ctx.origin === "http://localhost:4000") {
                    return "http://localhost:3000"
                }
                return false;
            },
            exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
            maxAge: 30,
            credentials: true,
            allowMethods: ['GET', 'POST', 'DELETE'],
            allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'custom-token'],
        }));
    }

    // 格式化请求
    app.use(koaBody({
        // jsonLimit:'1mb',  //JSON 数据体的大小限制      String/Integer  1mb
        // formLimit:'56kb',    //限制表单请求体的大小    String / Integer 56kb
        // textLimit:'56kb',   //限制 text body 的大小   String / Integer  56kb
        // encoding:'utf-8',    //表单的默认编码         String   utf-8
        multipart: true, //是否支持 multipart-formdate 的表单(文件上传)     Boolean  false
        // stict:true,         //严格模式,启用后不会解析 GET, HEAD, DELETE 请求   Boolean  true
        onError: function (err, context) {
            throw err;
        },
        /*formidable:{
           maxFields:1000,    //限制字段的数量   Integer  1000
           maxFieldsSize:2 * 1024 * 1024,     //限制字段的最大大小   Integer  2 * 1024 * 1024
           uploadDir:os.tmpDir(),   //文件上传的文件夹 String   os.tmpDir()
           keepExtensions:false,    //保留原来的文件后缀   Boolean  false
           hash:false,    //如果要计算文件的 hash，则可以选择 md5/sha1  String   false
           multipart:true,   //是否支持多文件上传   Boolean  true
           onFileBegin:function(name,file){}   //文件上传前的一些设置操作   Function  function(name,file){}
        }*/
    }));

    // session
    // redis
    var redisClient = redis.createClient({
        password: config.redis.password,
        host: config.redis.host,
        port: config.redis.port,
    });
    redisClient.on("error", function (err) {
        console.log(err);
    });
    redisClient.on("connect", function () {
        console.log('connect redis');
    });
    // session存储配置
    app.use(session({
        key: config.session.sessionName,
        cookie: function (ctx) {
            var maxAge = 0;
            if (ctx.session.user) {
                maxAge = config.session.sessionTimeout;
            }
            return {
                // domain: '10.0.0.100',
                path: '/',
                maxAge: maxAge,
                httpOnly: true,
                secure: false
            }
        },
        store: new redisStore({
            client: redisClient
        }),
    }));
    // 自动登录
    app.use(async function (ctx, next) {
        var userId = ctx.cookies.get(config.session.memoryName);
        if (!ctx.session.user && userId) {
            await userController.autoLogin(ctx, userId);
            console.log(ctx.href);
        }
        await next();
    });

    // 静态资源
    app.use(koastatic(__dirname + '/static'));

    //权限和登录验证
    app.use(checkLogin);

    //仅对/api开头的url进行格式化处理,在添加路由之前调用
    app.use(dataFormat);

    //注册路由
    app.use(router.routes(), router.allowedMethods());

    app.on('error', (err, ctx) => {
        console.error("server error:", err);
        ctx.body = err;
    });

    app.listen(port, host);
    console.log(`Server listening on http://${host}:${port}`);
}

start();
