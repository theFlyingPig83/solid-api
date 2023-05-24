'use strict';

const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const {errorHandler} = require('../../src/middlewares/errorHandler');
const HttpStatusCode = require('../../src/constants/HttpStatusCode');
const ServerErrors = require('../../src/constants/ServerErrors');

describe('errorHandler - Suit Test', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should handle an error without httpStatus property as an internal error', () => {
    const req = {};
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    const err = new Error('An unexpected error occurred');
    const next = sinon.stub();

    errorHandler(err, req, res, next);

    expect(res.status.calledOnceWith(HttpStatusCode.INTERNAL_ERROR)).to.be.true;
    expect(res.json.calledOnceWith({
      error: ServerErrors.INTERNAL_ERROR_MESSAGE,
      uiMessage: ServerErrors.INTERNAL_ERROR_UI_MESSAGE,
    })).to.be.true;
    expect(next.notCalled).to.be.true;
  });

  it('should handle an error with httpStatus property as a specific error', () => {
    const err = {
      httpStatus: HttpStatusCode.BAD_REQUEST,
      message: 'Invalid input',
      uiMessage: 'Invalid input, please try again',
    };
    const req = {};
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    const next = sinon.stub();

    errorHandler(err, req, res, next);

    expect(res.status.calledOnceWith(err.httpStatus)).to.be.true;
    expect(res.json.calledOnceWith({
      error: err.message,
      uiMessage: err.uiMessage,
    })).to.be.true;
    expect(next.notCalled).to.be.true;
  });
});
