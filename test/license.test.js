const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = require("chai").expect;
const should = chai.should();
const app = require("../app");
const LicenseModel = require("../models/license");

chai.use(chaiHttp);
before(async function () {
    await LicenseModel.sync();
    //remove LICENSE-001 if exists
    await LicenseModel.destroy({
        where: {
            code: "LIC-001",
        }
    });
});
describe('License CRUD', function () {
    it('should create a license', function (done) {
        chai.request(app)
            .post('/api/v1/license')
            .send({
                code: "LIC-001",
                external_id: "EXT-001",
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body.data).to.have.property("code");
                expect(res.body.data).to.have.property("external_id");
                expect(res.body.data.code).to.equal("LIC-001");
                expect(res.body.data.external_id).to.equal("EXT-001");
                done();
            });
    });
    it('should get all licenses', function (done) {
        chai.request(app)
            .get('/api/v1/license')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property("data");
                expect(res.body.data).to.be.an('array');
                expect(res.body.data.length).to.have.greaterThan(0);
                done();
            });
    });

    it('should update a license', function (done) {
        chai.request(app)
            .put('/api/v1/license')
            .send({
                code: "LIC-001",
                external_id: "EXT-002",
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property("data");
                done();
            });
    });
    it('should delete a license', function (done) {
        chai.request(app)
            .delete('/api/v1/license/LIC-001')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property("data");
                done();
            });
    });

});