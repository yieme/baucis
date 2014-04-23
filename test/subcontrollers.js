// __Dependencies__
var expect = require('expect.js');
var request = require('request');
var baucis = require('..');

var fixtures = require('./fixtures');

describe('Subcontrollers', function () {
  // __Test Hooks__
  before(fixtures.subcontroller.init);
  beforeEach(fixtures.subcontroller.create);
  after(fixtures.subcontroller.deinit);

  // __Tests__
  it("should not overwrite parent controller's request property", function (done) {
    var options = {
      url: 'http://localhost:8012/api/users?sort=name',
      json: true
    };
    request.get(options, function (error, response, body) {
      if (error) return done(error);
      expect(response.statusCode).to.be(200);
      expect(body).to.have.property('length', 2);
      expect(body[0]).to.have.property('name', 'Alice');
      done();
    });
  });


  it("should use subcontroller middleware", function (done) {
    var options = {
      url: 'http://localhost:8012/api/users',
      json: true
    };
    request.get(options, function (error, response, body) {
      if (error) return done(error);
      expect(response.statusCode).to.be(200);
      expect(body).to.have.property('length', 2);
      expect(body[0]).to.have.property('name', 'Alice');

      var options = {
        url: 'http://localhost:8012/api/users/' + body[0]._id + "/tasks",
        json: true
      };
      request.get(options, function (error, response, body) {
        if (error) return done(error);
        expect(response.statusCode).to.be(200);
        expect(body[0]).to.have.property('name', 'Changed by Middleware');
        done();
      });

    });
  });
});
