const chaiHttp = require('chai-http');
const chai = require('chai')
const server = require('../../server');
const HttpStatusCode = require('../../src/Enums/HttpStatusCode');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiHttp);
const expect = chai.expect;
chai.use(chaiAsPromised).should();

const ENDPOINT = '/api/users/'

describe('/POST FILES', () => {
  it('Should reach the API a sucessfull response code', done => {

    chai.request(server)
      .get(ENDPOINT)
      .end((err, res) => {
        expect(res).to.have.status(HttpStatusCode.SUCCESS);
        done();
      })
  })

  it('Should return 404 response code', done => {

    chai.request(server)
      .get(ENDPOINT+'/teste')
      .end((err, res) => {
        expect(res).to.have.status(HttpStatusCode.NOT_FOUND);
        done();
      })
  })
});