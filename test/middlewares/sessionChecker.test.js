'use strict';

const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const sessionChecker = require('../../src/middlewares/sessionChecker');
const ApiError = require('../../src/utils/ApiError');
const HttpStatusCode = require('../../src/constants/HttpStatusCode');
const SessionErrors = require('../../src/constants/SessionErrors');

describe('sessionChecker', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should call next with an ApiError when req.headers.session_id is undefined', () => {
    const req = {
      headers: {},
    };
    const res = {};
    const next = sinon.stub();

    sessionChecker(req, res, next);

    expect(next.calledOnce).to.be.true;
    const error = next.args[0][0];
    expect(error).to.be.instanceOf(ApiError);
    expect(error.message).to.equal(SessionErrors.MISSING_SESSION_ID_ERROR_MESSAGE);
    expect(error.httpStatus).to.equal(HttpStatusCode.BAD_REQUEST);
    expect(error.uiMessage).to.equal(SessionErrors.MISSING_SESSION_ID_UI_ERROR_MESSAGE);
  });

  it('should call next without an error when req.headers.session_id is defined', () => {
    const req = {
      headers: {
        session_id: '123456',
      },
    };
    const res = {};
    const next = sinon.stub();

    sessionChecker(req, res, next);

    expect(next.calledOnce).to.be.true;
    expect(next.args[0][0]).to.be.undefined;
  });
});
