const _ = require("lodash");
const utils = require("../utils/utils.js");

class travels {
    constructor(travels) {
        if (travels === undefined) {
            return;
        }
        var _this = this;
        var propertys = ["id", "userId", "title", "content", "money", "label", "status", "createDate", "updateDate", "permission"];
        _.each(propertys, function (value) {
            if (travels.hasOwnProperty(value)) {
                _this[value] = travels[value];
            }
        });
    }
    /**
     * @description 返回travels对象去掉值为undefined的属性
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
        // 验证金钱
        if (!this.authMoney()) {
            return "money";
        }
        // 验证标签
        if (!this.authLabel()) {
            return "label";
        }
        // 验证状态
        if (!this.authStatus()) {
            return "status";
        }
        return true;
    }
    /**description 判断更新字段合法性
     * @return {boolean,string} 返回值为boolean代表成功,字符串代表错误字段
     */
    updateAuth() {
        var result = true;
        var travels = Object.assign({}, this);
        _.each(travels, (value, key) => {
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

    // title不能为空、字符长度 1-50
    authTitle() {
        if (!_.isString(this.title) || _.size(this.title) < 1 || _.size(this.title) > 50) {
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
    // 数字、小数<=两位
    authMoney() {
        if (!_.isNumber(this.money) || /^[0-9]+\.*[0-9]{3,}/.test(this.money)) {
            return false;
        } else {
            return true;
        }
    }

    // 字符串、字数<30
    authLabel() {
        if (!_.isString(this.label) || _.size(this.label) < 30) {
            return false;
        } else {
            return true;
        }
    }

    // 数字、0||1
    authStatus() {
        if (!_.isNumber(this.status) || /[01]{1}/.test(this.status)) {
            return false;
        } else {
            return true;
        }
    }

    // 把对象转换成sql更新字符串：name='liu',password='123456'
    updatetravels(travels) {
        var travel = travels || this;
        return {
            title: travel.title,
            content: travel.content,
            money:travel.money,
            label:travel.label,
            status:travel.status,
            update_date: utils.dateTime(),
            permission:travel.permission
        }
    }

}

module.exports = travels;