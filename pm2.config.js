module.exports = {
    apps: [{
        // 生产环境
        name: "server",
        // 项目启动入口文件
        script: "./server.js",
        // 项目环境变量
        env: {
            "NODE_ENV": "production",
            // "PORT": 8686
        }
    }]
}