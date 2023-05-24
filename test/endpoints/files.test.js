const chaiHttp = require('chai-http');
const chai = require('chai')
const server = require('../../server');
const HttpStatusCode = require('../../src/constants/HttpStatusCode');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiHttp);
const expect = chai.expect;
chai.use(chaiAsPromised).should();

const ENDPOINT = '/api/files/'

describe('/POST FILES', () => {

  it('Should return a error message and a ui error message', done => {
    chai.request(server)
      .post(ENDPOINT)
      .end((err, res) => {
        expect(res).to.have.status(HttpStatusCode.BAD_REQUEST);
        expect(res.body).to.have.property('error')
        expect(res.body).to.have.property('uiMessage')
        done();
      })
  })

  it('Should return a bad request status code', done => {
    chai.request(server)
      .post(ENDPOINT)
      .end((err, res) => {
        expect(res).to.have.status(HttpStatusCode.BAD_REQUEST);
        done();
      })
  })

  it('Should return 404 response code', done => {

    chai.request(server)
      .get(ENDPOINT+'/teste')
      .set('session_id', 'mocked-id')
      .end((err, res) => {
        expect(res).to.have.status(HttpStatusCode.NOT_FOUND);
        done();
      })
  })
});