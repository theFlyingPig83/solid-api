const chaiHttp = require('chai-http');
const chai = require('chai')
const server = require('../../server');
const HttpStatusCode = require('../../src/constants/HttpStatusCode');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiHttp);
const expect = chai.expect;
chai.use(chaiAsPromised).should();

const ENDPOINT = '/api/users/'

describe('/GET USERS', () => {
  it('Should reach the API and return an array', done => {

    chai.request(server)
      .get(ENDPOINT)
      .end((err, res) => {
        expect(res).to.have.status(HttpStatusCode.SUCCESS);
        expect(res.body).to.be.an('array')
        done();
      })
  })
});