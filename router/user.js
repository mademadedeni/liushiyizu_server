const router = require("koa-router")();
const user = require("../controller/user.js");

router.get("/users/:id",user.selectUserById);
router.get("/user/name",user.selectUser);
router.get("/user/userInfo",user.userInfo);
router.get("/user/captcha",user.captcha);

router.post("/user/signin",user.insertUser);
router.post("/user/exit",user.userExit);
router.post("/user/login",user.userLogin);
router.post("/user/upload/avatar",user.uploadAvatar);
router.post("/users/:id/update",user.updateUser);

module.exports = router;