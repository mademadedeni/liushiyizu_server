const {
    sequelize,
    DataTypes
} = require('../lib/connection.js');

const users = sequelize.define('users', {
    id: {
        type: DataTypes.UUID,
        defaultValue: sequelize.UUIDV4,
        primaryKey: true,
        comment: '主键'
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '姓名'
    },
    gender: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '性别'
    },
    age: DataTypes.INTEGER,
}, {
    tableName: 'users'
});

module.exports = users;