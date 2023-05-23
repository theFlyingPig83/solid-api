const FileErrors = require('../src/constants/FileErrors')
const UsersCSVHandler = require('../src/utils/usersCSVHandler')
const chai = require('chai')
const expect = chai.expect;

describe('users CSV Handler Suite Tests', () => {
  it('Should throw an error for invalid files', async () => {
    const filePath = './test/mocks/emptyFile-invalid.csv'
    const rejection = new Error(FileErrors.FILE_LENGTH_ERROR_MESSAGE)
    try {
      await UsersCSVHandler.parseUsers(filePath);
      expect.fail('Expected an error to be thrown');
    } catch (error) {
      expect(error).to.deep.equal(rejection);
    }
   })

   it('Should throw an error for a file with invalid header', async () => {
    const filePath = './test/mocks/invalid-header.csv'
    const rejection = new Error(FileErrors.FILE_FIELDS_ERROR_MESSAGE)
    try {
      await UsersCSVHandler.parseUsers(filePath);
      expect.fail('Expected an error to be thrown');
    } catch (error) {
      expect(error).to.deep.equal(rejection);
    }
   })

   it('The parsed CSV should has the expected JSON structure', async () => {
    const filePath = './test/mocks/valid.csv'
    const result = await UsersCSVHandler.parseUsers(filePath)
    const expected = [
      {
        "name": "John Doe",
        "city": "New York",
        "country": "USA",
        "favoriteSport": "Basketball"
      },
      {
        "name": "Jane Smith",
        "city": "London",
        "country": "UK",
        "favoriteSport": "Football"
      },
      {
        "name": "Mike Johnson",
        "city": "Paris",
        "country": "France",
        "favoriteSport": "Tennis"
      },
      {
        "name": "Karen Lee",
        "city": "Tokyo",
        "country": "Japan",
        "favoriteSport": "Swimming"
      },
      {
        "name": "Tom Brown",
        "city": "Sydney",
        "country": "Australia",
        "favoriteSport": "Running"
      },
      {
        "name": "Emma Wilson",
        "city": "Berlin",
        "country": "Germany",
        "favoriteSport": "Basketball"
      },
    ]
    expect(result).to.deep.equal(expected);
   })

})
