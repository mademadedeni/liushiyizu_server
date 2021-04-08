const {
    sequelize,
    DataTypes
} = require('../lib/connection.js');

const user = require("./users.js");

const secret = sequelize.define('secret', {
    id: {
        type: DataTypes.UUID,
        defaultValue: sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
        comment: "主键"
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "标题"
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "内容"
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: "user外键",
        references: {
            // 这是对另一个模型的参考
            model: user,

            // 这是引用模型的列名
            key: 'id'
        }
    }
}, {
    tableName: 'secret'
});

module.exports = secret;