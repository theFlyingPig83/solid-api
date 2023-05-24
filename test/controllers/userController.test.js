'use strict';

const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const controller = require('../../src/controllers/userController');
const User = require('../../src/models/user');
const HttpStatusCode = require('../../src/constants/HttpStatusCode');
const UsersErrors = require('../../src/constants/UsersErrors');
const mocks = {
  validParsedUsers: require('../mocks/valid-parsed-users'),
  validUserList: require('../mocks/valid-user-list')
}

describe('User Controller - Suite Tests', () => {
  const req = {
    query: {
      q: 'John',
    },
    headers: {
      session_id: '123456',
    },
  };

  afterEach(() => {
    sinon.restore();
  });

  it('should return a list of users based on query and session ID', async () => {

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    const next = sinon.stub();

    const listAllStub = sinon.stub(User, 'listAll').resolves(mocks.validUserList);

    await controller.list(req, res, next);

    expect(listAllStub.calledOnceWith({ query: req.query.q, sessionId: req.headers.session_id })).to.be.true;
    expect(res.status.calledOnceWith(HttpStatusCode.SUCCESS)).to.be.true;
    expect(res.json.calledOnceWith(mocks.validUserList)).to.be.true;
    expect(next.notCalled).to.be.true;
  });

  it('should call next with error when an exception occurs', async () => {
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    const next = sinon.stub();

    const errorMessage = UsersErrors.FAILED_TO_LIST_ERROR_MESSAGE;
    const listAllStub = sinon.stub(User, 'listAll').throws(new Error(errorMessage));

    await controller.list(req, res, next);

    expect(listAllStub.calledOnceWith({ query: req.query.q, sessionId: req.headers.session_id })).to.be.true;
    expect(res.status.notCalled).to.be.true;
    expect(res.json.notCalled).to.be.true;
  });
});
