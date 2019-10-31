const router = require("koa-router")();
const article = require("./article.js");
const user = require("./user.js");
const config = require("../config.js");

router.get("/", async (ctx, next) => {
    ctx.type = "text/html";
    ctx.body = `<h1 style="text-align:center;">欢迎来到刘氏一族1！</h1>`
});
router.prefix(config.prefix);
router.use(article.routes(),article.allowedMethods());
router.use(user.routes(),user.allowedMethods());

module.exports = router;