'use strict';

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../database/sequelize');
const ApiError = require('../utils/ApiError');
const UsersErrors = require('../constants/UsersErrors');
class User extends Model {
  static associate(models) {
    // define association here
  }

  static async createUsers(data){
    try {
      const rows = await User.bulkCreate(data)
      return rows
    } catch (error) {
      throw new ApiError(UsersErrors.FAILED_TO_CREATE_ERROR_MESSAGE, UsersErrors.FAILED_TO_CREATE_ERROR_UI_MESSAGE, __filename, error)
    }
  }
}

User.init(
  { name: DataTypes.STRING, city: DataTypes.STRING, country: DataTypes.STRING, favorite_sport: DataTypes.STRING },
  { sequelize, modelName: 'User' }
);

module.exports = User