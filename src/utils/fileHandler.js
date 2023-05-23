const { readFile } = require('fs/promises')
const FileErrors = require('../constants/FileErrors')
const { join } = require('path')
const User = require('../models/user')

const DEFAULT_OPTION = {
  fields: ["name", "city", "country", "favorite_sport"]
}

class FileHandler {
  static async csvToJson(filePath) {
    const content = await FileHandler.getFileContent(filePath)
    const validation = FileHandler.isValid(content)
    if (!validation.valid) throw new Error(validation.error)
    return FileHandler.parseCSVToJSON(content)
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
        error: FileErrors.FILE_FIELDS_ERROR_MESSAGE,
        valid: false
      }
    }

    const isContentLengthAccepted = fileWithoutHeader.length > 0

    if (!isContentLengthAccepted) {
      return {
        error: FileErrors.FILE_LENGTH_ERROR_MESSAGE,
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
      return new User(user)
    })
    
    return users
  }
}

module.exports = FileHandler