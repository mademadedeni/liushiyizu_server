
// 没有变量的路由放在前面，有变量的放后面；防止相似匹配
var notParam = [{
    type: "user",
    url: "/user/upload/avatar",
    permission: 5
}, {
    type: "article",
    url: "/article/create",
    permission: 5
},];
var haveParam = [{
    type: "user",
    url: "/users/:id/update",
    regExp: "/users/[a-zA-Z0-9_]+/update",
    params: [":id"],
    permission: 5
}, {
    type: "user",
    url: "/users/:id",
    regExp: "/users/[a-zA-Z0-9_]+",
    params: [":id"],
    permission: 2
}, {
    type: "article",
    url: "/articles/:id/update",
    regExp: "/articles/[a-zA-Z0-9_]+/update",
    params: [":id"],
    permission: 5
}];
var loginList = notParam.concat(haveParam);

var whiteList = [{
    type: "article",
    url: "/articles",
    permission: 5
}, {
    type: "article",
    url: "/articles/:id",
    regExp: "/articles/[a-zA-Z0-9_]+",
    params: [":id"],
    permission: 5
}]

module.exports = {
    loginList,
    whiteList
};