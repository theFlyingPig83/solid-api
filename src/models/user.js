'use strict';

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../database/sequelize');
class User extends Model {
  static associate(models) {
    // define association here
  }

  static async createUsers(data){
    try {
      const rows = await User.bulkCreate(data)
      return rows
    } catch (error) {
      console.log('[LOG] - MODEL USER - Failed to create users: ', error)
      throw new Error('Failed to create users')
    }
  }
}

User.init(
  { name: DataTypes.STRING, city: DataTypes.STRING, country: DataTypes.STRING, favorite_sport: DataTypes.STRING },
  { sequelize, modelName: 'User' }
);

module.exports = User