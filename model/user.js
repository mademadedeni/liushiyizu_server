const _ = require("lodash");

class user {
    constructor(user) {
        if (user === undefined) {
            return;
        }
        var _this = this;
        var propertys = ["id", "name", "sex", "password", "code", "nickname", "permission", "age", "phone", "email", "address", "avatar", "signature", "createDate", "updateDate"];
        _.each(propertys, function (value) {
            if (user.hasOwnProperty(value)) {
                _this[value] = user[value];
            }
        });

        // this.id = _.toString(user.id);
        // this.name = _.toString(user.name);
        // this.sex = user.sex;
        // this.password = _.toString(user.password);
        // this.code = _.toString(user.code);
        // this.nickname = _.toString(user.nickname);
        // this.permission = user.permission;
        // this.age = user.age;
        // this.phone = _.toString(user.phone);
        // this.email = _.toString(user.email);
        // this.address = _.toString(user.address);
        // this.avatar = _.toString(user.avatar); //肖像，头像
        // this.signature = _.toString(user.signature); //个性签名
        // this.createDate = user.createDate;
        // this.updateDate = user.updateDate;
    }
    /**
     * @description 返回user对象去掉值为undefined的属性
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
        // 用户名不能为空、只能由数字字母下划线中划线、字符长度 3-12、不能有特殊符号
        if (!this.authName()) {
            return "name";
        }
        // 密码不能有空格、长度6-16、不能有汉字
        if (!this.authPassword()) {
            return "password";
        }
        return true;
    }
    /**description 判断更新字段合法性
     * @return {boolean,string} 返回值为boolean代表成功,字符串代表错误字段
     */
    updateAuth() {
        var result = true;
        var user = Object.assign({}, this);
        _.each(user, (value, key) => {
            switch (key) {
                case "name":
                    this.authName() ? result = true : result = key;
                    break;
                case "password":
                    this.authPassword() ? result = true : result = key;
                    break;
                case "sex":
                    this.authSex() ? result = true : result = key;
                    break;
                case "age":
                    this.authAge() ? result = true : result = key;
                    break;
                case "nickname":
                    this.authNickname() ? result = true : result = key;
                    break;
                case "permission":
                    this.authPermission() ? result = true : result = key;
                    break;
                case "phone":
                    this.authPhone() ? result = true : result = key;
                    break;
                case "email":
                    this.authEmail() ? result = true : result = key;
                    break;
                case "address":
                    this.authAddress() ? result = true : result = key;
                    break;
                case "signature":
                    this.authSignature() ? result = true : result = key;
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

    // 用户名不能为空、只能由数字字母下划线中划线、字符长度 3-12
    authName() {
        if (_.isNil(this.name) || !_.isString(this.name) || /[^a-zA-Z0-9_-]/g.test(this.name) || _.size(this.name) < 3 || _.size(this.name) > 12) {
            return false;
        } else {
            return true;
        }
    }

    // 密码不能有空格、长度6-16、不能有汉字
    authPassword() {
        if (_.isNil(this.password) || !_.isString(this.password) || /\s/g.test(this.password) || _.size(this.password) < 6 || _.size(this.password) > 16 || /[^\x00-\xff]/g.test(this.password)) {
            return false;
        } else {
            return true;
        }
    }

    //  性别为数字  0:保密  1：男  2：女
    authSex() {
        if (!_.isInteger(this.sex) || !/^0|1|2$/g.test(this.sex)) {
            return false;
        } else {
            return true;
        }
    }

    //  年龄为数字 范围1-200
    authAge() {
        if (this.age === "" || this.age === null) {
            return true;
        }
        if (_.isNil(this.age) || !_.isInteger(this.age) || this.age < 1 || this.age > 200) {
            return false;
        } else {
            return true;
        }
    }
    // 昵称为字符串,长度1-20
    authNickname() {
        if (this.nickname === "" || this.nickname === null) {
            return true;
        }
        if (_.isNil(this.nickname) || !_.isString(this.nickname) || _.size(this.nickname) < 1 || _.size(this.nickname) > 20) {
            return false;
        } else {
            return true;
        }
    }
    // 权限验证 类型为数字
    authPermission() {
        if (!_.isInteger(this.permission)) {
            return false;
        } else {
            return true;
        }
    }
    // 手机号验证 长度11 首字母1
    authPhone() {
        if (this.phone === null || this.phone == "") {
            return true;
        }
        if (!/^1[0-9]{10}/.test(this.phone)) {
            return false;
        } else {
            return true;
        }
    }
    // 邮箱验证
    authEmail() {
        if (this.email === null || this.email === "") {
            return true;
        }
        if (!/^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/.test(this.email)) {
            return false;
        } else {
            return true;
        }
    }
    // 地址 长度1-30
    authAddress() {
        if (this.address === null || this.address === "") {
            return true;
        }
        if (!_.isString(this.address) || _.size(this.address) < 1 || _.size(this.address) > 30) {
            return false;
        } else {
            return true;
        }
    }
    // 个性签名 长度5-300
    authSignature() {
        if (this.signature === null || this.signature === "") {
            return true;
        }
        if (!_.isString(this.signature) || _.size(this.signature) < 5 || _.size(this.signature) > 300) {
            return false;
        } else {
            return true;
        }
    }

    // 把对象转换成sql更新字符串：name=liu,password=123456
    updateToString(user) {
        var result = [];

        _.each(user ? user : this, function (value, key) {
            if (key == "age" && value === "") {
                result.push(key + '= NULL');
                return;
            }
            if (typeof value === "string") {
                result.push(key + '=' + `'${value}'`);
            } else {
                result.push(key + '=' + value);
            }
        });
        return result.join(",");
    }

}

module.exports = user;