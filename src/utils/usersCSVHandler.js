const { readFile } = require('fs/promises')
const FileErrors = require('../constants/FileErrors')
const { join } = require('path')
const User = require('../models/user')
const ApiError = require('./ApiError')
const HttpStatusCode = require('../constants/HttpStatusCode')

const DEFAULT_OPTION = {
  fields: ["name", "city", "country", "favorite_sport"]
}

class UsersCSVHandler {
  static async parseUsers(filePath) {
    const content = await UsersCSVHandler.getFileContent(filePath)
    const validation = UsersCSVHandler.isValid(content)
    if (!validation.valid) throw new ApiError(validation.message, HttpStatusCode.BAD_REQUEST, validation.uiMessage, validation.__filename)
    return UsersCSVHandler.parseCSVToJSON(content)
  }

  static async getFileContent(filePath) {
    // const filename = join(__dirname, filePath)
    const filename = filePath
    return (await readFile(filename)).toString("utf8").replace(/\r/g, '')
  }

  static isValid(csvString, options = DEFAULT_OPTION) {
    const [header, ...fileWithoutHeader] = csvString.split('\n')
    const isHeaderValid = header === options.fields.join(',')
    if (!isHeaderValid) {
      return {
        message: FileErrors.FILE_FIELDS_ERROR_MESSAGE,
        uiMessage: FileErrors.FILE_FIELDS_ERROR_UI_MESSAGE,
        __filename,
        valid: false
      }
    }

    const isContentLengthAccepted = fileWithoutHeader.length > 0

    if (!isContentLengthAccepted) {
      return {
        message: FileErrors.FILE_LENGTH_ERROR_MESSAGE,
        uiMessage: FileErrors.FILE_LENGTH_ERROR_UI_MESSAGE,
        __filename,
        valid: false
      }
    }

    return { valid: true }
  }

  static parseCSVToJSON(csvString) {
    const lines = csvString.split('\n')
    const firstLine = lines.shift()
    const header = firstLine.split(',')

    const users = lines.map(line => {
      const columns = line.split(',')
      let user = {}
      for (const index in columns) {
        user[header[index]] = columns[index]
      }
      return user
    })

    return users
  }
}

module.exports = UsersCSVHandler