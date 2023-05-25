'use strict';

const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const controller = require('../../src/controllers/fileController');
const UsersCSVHandler = require('../../src/utils/usersCSVHandler');
const User = require('../../src/models/user');
const FileErrors = require('../../src/constants/FileErrors');
const mocks = {
  validParsedUsers: require('../mocks/valid-parsed-users'),
  validUserList: require('../mocks/valid-user-list')
}
describe('File Controller - Suite Tests', () => {
  let res = {}
  let next = {};
  const req = {
    file: {
      path: '/path/to/uploaded.csv',
    },
    headers: {
      session_id: '123456',
    },
  };

  beforeEach(()=>{
    res = { send: sinon.stub() };
    next = sinon.stub()
  })
  
  afterEach(() => {
    sinon.restore();
  });

  it('should create users from uploaded CSV and return the result', async () => {
    
    const usersCSVHandlerStub = sinon.stub(UsersCSVHandler, 'parseUsers').resolves(mocks.validParsedUsers)
    const next = sinon.stub();
    const createUsersStub = sinon.stub(User, 'createUsers').resolves(mocks.validUserList);

    await controller.create(req, res, next);

    expect(createUsersStub.calledOnceWith(mocks.validParsedUsers, req.headers.session_id)).to.be.true;
    expect(usersCSVHandlerStub.calledOnceWith(req.file.path)).to.be.true;
    expect(res.send.calledOnceWith(mocks.validUserList)).to.be.true;
    expect(next.notCalled).to.be.true;
  });

  it('should call next with error when an exception occurs', async () => {
    
    const errorMessage = FileErrors.FILE_FIELDS_ERROR_MESSAGE;
    const parseUsersStub = sinon.stub(UsersCSVHandler, 'parseUsers').throws(new Error(errorMessage));

    await controller.create(req, res, next);

    expect(parseUsersStub.calledOnceWith(req.file.path)).to.be.true;
    expect(res.send.notCalled).to.be.true;
    expect(next.calledOnceWith(sinon.match.instanceOf(Error))).to.be.true;
  });

  it('should call next with error when User.createUsers throws an error', async () => {

    sinon.stub(UsersCSVHandler, 'parseUsers').resolves(mocks.validParsedUsers)
    const createUsersStub = sinon.stub(User, 'createUsers').throws(new Error('MOCK ERROR'));
    await controller.create(req, res, next);
    expect(createUsersStub.calledOnceWith(mocks.validParsedUsers, req.headers.session_id)).to.be.true;
    expect(res.send.notCalled).to.be.true;

  });
});
