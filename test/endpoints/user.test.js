const chaiHttp = require('chai-http');
const chai = require('chai')
const server = require('../../server');
const HttpStatusCode = require('../../src/constants/HttpStatusCode');
const chaiAsPromised = require('chai-as-promised');
const SessionErrors = require('../../src/constants/SessionErrors');
chai.use(chaiHttp);
const expect = chai.expect;
chai.use(chaiAsPromised).should();

const ENDPOINT = '/api/users/'

describe('/GET USERS', () => {
  it('Should reach the API and return an exception for missing session_id', done => {

    chai.request(server)
      .get(ENDPOINT)
      .end((err, res) => {
        expect(res).to.have.status(HttpStatusCode.BAD_REQUEST);
        expect(res.body.error).to.be.equal(SessionErrors.MISSING_SESSION_ID_ERROR_MESSAGE)
        expect(res.body.uiMessage).to.be.equal(SessionErrors.MISSING_SESSION_ID_UI_ERROR_MESSAGE)
        done();
      })
  })
});