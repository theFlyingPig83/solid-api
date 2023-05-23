'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }
  }
  User.init({
    name: DataTypes.STRING,
    city: DataTypes.STRING,
    country: DataTypes.STRING,
    favorite_sport: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};