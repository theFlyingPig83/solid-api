'use strict';

const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const payloadChecker = require('../../src/middlewares/payloadChecker');
const ApiError = require('../../src/utils/ApiError');
const HttpStatusCode = require('../../src/constants/HttpStatusCode');
const PayloadErrors = require('../../src/constants/PayloadErrors');

describe('payloadChecker - Suit Test', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should call next with an ApiError when req.file is undefined', () => {
    const req = {};
    const res = {};
    const next = sinon.stub();

    payloadChecker(req, res, next);

    expect(next.calledOnce).to.be.true;
    const error = next.args[0][0];
    expect(error).to.be.instanceOf(ApiError);
    expect(error.message).to.equal(PayloadErrors.MISSING_CSV_ERROR_MESSAGE);
    expect(error.httpStatus).to.equal(HttpStatusCode.BAD_REQUEST);
    expect(error.uiMessage).to.equal(PayloadErrors.MISSING_CSV_ERROR_UI_MESSAGE);
  });

  it('should call next without an error when req.file is defined', () => {
    const req = {
      file: {},
    };
    const res = {};
    const next = sinon.stub();

    payloadChecker(req, res, next);

    expect(next.calledOnce).to.be.true;
    expect(next.args[0][0]).to.be.undefined;
  });
});
