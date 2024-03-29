const router = require("koa-router")();
var article = require('../controller/article.js');

router.get("/articles",article.selectArticle);
router.get("/articles/:id",article.selectArticleById);
router.get("/users/:userId/articles",article.selectArticleByUserId);
router.get("/articles/delete/:id",article.deleteArticle);

router.post("/article/create",article.createArticle);
router.post("/articles/:id/update",article.updateArticle);
router.post("/editor/upload",article.uploadImg);

module.exports = router;