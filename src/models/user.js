'use strict';

const { Model, DataTypes, Op } = require('sequelize');
const sequelize = require('../../database/sequelize');
const ApiError = require('../utils/ApiError');
const UsersErrors = require('../constants/UsersErrors');
const HttpStatusCode = require('../constants/HttpStatusCode');
const MAXIMUM_RETURN = 50;
class User extends Model {
  static associate(models) {
    // define association here
  }

  static addSessionIdToUser(user, sessionId) {
    user.session_id = sessionId
    return user
  }

  static async saveInBatches(data) {
    const filesLength = data.length;
    const batchSize = 300
    const NumberOfbatches = Math.ceil(filesLength / batchSize);
    let promiseBatch = []

    for (let i = 0; i < NumberOfbatches; i++) {
      const begin = i * batchSize;
      const end = Math.min((i + 1) * batchSize, filesLength);
      const currentBatch = data.slice(begin, end);
      promiseBatch.push(User.bulkCreate(currentBatch));
    }
    const results = await Promise.all(promiseBatch)
    return results.flat().splice(0, MAXIMUM_RETURN);
  }

  static async createUsers(data, sessionId) {
    const transaction = await sequelize.transaction();
    try {
      const formattedUsers = data.map(user => this.addSessionIdToUser(user, sessionId))
      const rows = await this.saveInBatches(formattedUsers)
      await transaction.commit();
      return rows
    } catch (error) {
      await transaction.rollback();
      throw new ApiError(UsersErrors.FAILED_TO_CREATE_ERROR_MESSAGE, HttpStatusCode.INTERNAL_ERROR, UsersErrors.FAILED_TO_CREATE_ERROR_UI_MESSAGE, __filename, error)
    }
  }

  static async listAll({ query, sessionId }) {
    try {
      const rows = await User.scope(
        { method: ['default'] },
        { method: ['bySession', sessionId] },
        { method: ['findByQuery', query] }
      ).findAll();
      return rows
    } catch (error) {
      throw new ApiError(UsersErrors.FAILED_TO_LIST_ERROR_MESSAGE, HttpStatusCode.INTERNAL_ERROR, UsersErrors.FAILED_TO_LIST_ERROR_UI_MESSAGE, __filename, error)
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
      default: () => {
        return {
          limit: MAXIMUM_RETURN,
        }
      },
      bySession: (sessionId) => {
        return { where: { session_id: sessionId } }
      },

      findByQuery: (query) => {
        if (query) {
          return {
            where: {
              [Op.or]: {
                name: {
                  [Op.iLike]: `%${query}%`,
                },
                city: {
                  [Op.iLike]: `%${query}%`,
                },
                country: {
                  [Op.iLike]: `%${query}%`,
                },
                favorite_sport: {
                  [Op.iLike]: `%${query}%`,
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