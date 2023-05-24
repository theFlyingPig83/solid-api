'use strict';

const { Model, DataTypes, Op } = require('sequelize');
const sequelize = require('../../database/sequelize');
const ApiError = require('../utils/ApiError');
const UsersErrors = require('../constants/UsersErrors');
class User extends Model {
  static associate(models) {
    // define association here
  }

  static addSessionIdToUser(user, sessionId){
    user.session_id = sessionId
    return user
  }

  static async createUsers(data, sessionId) {
    try {

      const formattedUsers = data.map(user => this.addSessionIdToUser(user, sessionId))

      const rows =  await User.bulkCreate(formattedUsers)
      return rows
    } catch (error) {
      throw new ApiError(UsersErrors.FAILED_TO_CREATE_ERROR_MESSAGE, UsersErrors.FAILED_TO_CREATE_ERROR_UI_MESSAGE, __filename, error)
    }
  }

  static async listAll({ query, sessionId }) {
    try {
      const rows = await User.scope(
        { method: ['bySession', sessionId] },
        { method: ['findByQuery', query] }
      ).findAll();
      return rows
    } catch (error) {
      throw new ApiError(UsersErrors.FAILED_TO_CREATE_ERROR_MESSAGE, UsersErrors.FAILED_TO_CREATE_ERROR_UI_MESSAGE, __filename, error)
    }
  }
}

User.init(
  {
    name: DataTypes.STRING,
    city: DataTypes.STRING,
    country: DataTypes.STRING,
    favorite_sport: DataTypes.STRING,
    session_id: DataTypes.UUID,
  },
  {
    sequelize,
    modelName: 'User',
    scopes: {
      bySession: (sessionId) => {
        return { where: { session_id: sessionId } }
      },

      findByQuery: (query) => {
        if (query) {
          return {
            where: {
              [Op.or]: {
                name: {
                  [Op.like]: `%${query}%`,
                },
                city: {
                  [Op.like]: `%${query}%`,
                },
                country: {
                  [Op.like]: `%${query}%`,
                },
                favorite_sport: {
                  [Op.like]: `%${query}%`,
                },
              },
            },
          }
        }
        return {}
      }
    },
  }
);

module.exports = User