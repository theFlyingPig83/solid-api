'use strict';

const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const { Model } = require('sequelize');
const User = require('../../src/models/user'); 
const ApiError = require('../../src/utils/ApiError');
const UsersErrors = require('../../src/constants/UsersErrors');
const HttpStatusCode = require('../../src/constants/HttpStatusCode');

describe('User Model Suite Tests', () => {

  describe('addSessionIdToUser method', () => {
    it('should add session_id to user', () => {
      const user = { name: 'John Doe' };
      const sessionId = '123456';
      const result = User.addSessionIdToUser(user, sessionId);
      expect(result).to.have.property('session_id', sessionId);
    });
  });

  describe('createUsers method', () => {
    it('should create users with session ID', async () => {
      const data = [
        { name: 'John Doe' },
        { name: 'Jane Smith' }
      ];
      const sessionId = '123456';

      const formattedUsers = data.map(user => User.addSessionIdToUser(user, sessionId));
      const bulkCreateStub = sinon.stub(User, 'bulkCreate').resolves(formattedUsers);

      const rows = await User.createUsers(data, sessionId);

      expect(bulkCreateStub.calledOnceWith(formattedUsers)).to.be.true;
      expect(rows).to.deep.equal(formattedUsers);

      bulkCreateStub.restore();
    });

    it('should throw an ApiError when failed to create users', async () => {
      const data = [
        { name: 'John Doe' },
        { name: 'Jane Smith' }
      ];
      const sessionId = '123456';
      const errorMessage = UsersErrors.FAILED_TO_CREATE_ERROR_MESSAGE;
      const bulkCreateStub = sinon.stub(User, 'bulkCreate').throws(new Error(errorMessage));

      try {
        await User.createUsers(data, sessionId);
        expect.fail('Expected an ApiError to be thrown');
      } catch (error) {
        expect(error).to.be.an.instanceOf(ApiError);
        expect(error.message).to.equal(UsersErrors.FAILED_TO_CREATE_ERROR_MESSAGE);
        expect(error.uiMessage).to.equal(UsersErrors.FAILED_TO_CREATE_ERROR_UI_MESSAGE);
        expect(error.httpStatus).to.equal(HttpStatusCode.INTERNAL_ERROR);
      }

      bulkCreateStub.restore();
    });
  });

  describe('listAll method', () => {
    it('should list all users with session and query filtering', async () => {
      const scopeStub = sinon.stub(Model, 'scope').returnsThis();
      const findAllStub = sinon.stub(User, 'findAll').resolves([]);

      const query = 'John';
      const sessionId = '123456';

      const rows = await User.listAll({ query, sessionId });

      expect(scopeStub.calledWith(
        { method: ['bySession', sessionId] },
        { method: ['findByQuery', query] }
      )).to.be.true;
      expect(findAllStub.calledOnce).to.be.true;
      expect(rows).to.deep.equal([]);

      scopeStub.restore();
      findAllStub.restore();
    });

    it('should throw an ApiError when failed to list users', async () => {
      const scopeStub = sinon.stub(Model, 'scope').returnsThis();
      const errorMessage = UsersErrors.FAILED_TO_LIST_ERROR_MESSAGE;

      const findAllStub = sinon.stub(User, 'findAll').throws(new Error(errorMessage));

      const query = 'John';
      const sessionId = '123456';

      try {
        await User.listAll({ query, sessionId });
        expect.fail('Expected an ApiError to be thrown');
      } catch (error) {
        expect(error).to.be.an.instanceOf(ApiError);
        expect(error.message).to.equal(UsersErrors.FAILED_TO_LIST_ERROR_MESSAGE);
        expect(error.uiMessage).to.equal(UsersErrors.FAILED_TO_LIST_ERROR_UI_MESSAGE);
      }

      scopeStub.restore();
      findAllStub.restore();
    });
  });
});