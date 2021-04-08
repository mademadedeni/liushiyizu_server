const {
    Sequelize,
    DataTypes
} = require('sequelize');
var config = require('../config.js');

const sequelize = new Sequelize(config.sql.database, config.sql.user, config.sql.password, {
    host: config.sql.host,
    port: config.sql.port,
    dialect: 'mysql'
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.')
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err)
    })

module.exports = {
    sequelize,
    DataTypes
};