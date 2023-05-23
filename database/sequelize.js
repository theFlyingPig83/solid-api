const { Sequelize } = require('sequelize');
const env = process.env.DEFINES || 'dev'
const configs = require('config.json')[env]

const sequelize = new Sequelize(configs.database, configs.username, configs.password, configs);

module.exports = sequelize;