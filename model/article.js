const _ = require("lodash");

class article {
    constructor(article) {
        if (article === undefined) {
            return;
        }
        var _this = this;
        var propertys = ["id", "userId", "title", "content", "permission", "createDate", "updateDate"];
        _.each(propertys, function (value) {
            if (article.hasOwnProperty(value)) {
                _this[value] = article[value];
            }
        });
    }
    /**
     * @description 返回article对象去掉值为undefined的属性
     */
    toSelf() {
        return JSON.parse(JSON.stringify(this));
    }
    /**
     * @description 插入用户 校验用户名、密码字段合法性
     * @params null
     * @return 
     */
    insertAuth() {
        // 验证title
        if (!this.authTitle()) {
            return "title";
        }
        // 验证内容
        if (!this.authContent()) {
            return "content";
        }
        return true;
    }
    /**description 判断更新字段合法性
     * @return {boolean,string} 返回值为boolean代表成功,字符串代表错误字段
     */
    updateAuth() {
        var result = true;
        var article = Object.assign({}, this);
        _.each(article, (value, key) => {
            switch (key) {
                case "title":
                    this.authTitle() ? result = true : result = key;
                    break;
                case "content":
                    this.authContent() ? result = true : result = key;
                    break;
                default:
                    break;
            }
            if (result !== true) {
                return false;
            }
        });
        return result;
    }

    // title不能为空、字符长度 1-30
    authTitle() {
        if (!_.isString(this.title) || _.size(this.title) < 1 || _.size(this.title) > 30) {
            return false;
        } else {
            return true;
        }
    }

    // 内容为字符串：长度10-10000
    authContent() {
        if (!_.isString(this.content) || _.size(this.content) < 10 || _.size(this.content) > 10000) {
            return false;
        } else {
            return true;
        }
    }

    // 把对象转换成sql更新字符串：name='liu',password='123456'
    updateArticle (article) {
        var art = article || this;
        return {
            title: art.title,
            content: art.content,
            update_date: new Date().toLocaleString()
        }
    }

}

module.exports = article;