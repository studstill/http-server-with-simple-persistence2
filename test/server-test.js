'use strict';

var chai = require('chai');
var expect = require('chai').expect;
var chaiHttp = require('chai-http');
var fs = require('fs');
var startServer = require('../server.js').startServer;

chai.use(chaiHttp);

describe('server.js', function() {

  it('should have a statusCode of 200 for "/" request', function(done) {
    chai.request('localhost:3000')
      .get('/')
      .then(function(response) {
        expect(response.statusCode).to.eql(200);
        done();
      });
  });

  it('should respond with JSON object listing files in directory', function(done) {
    chai.request('localhost:3000')
      .get('/')
      .then(function(response) {
        expect(typeof(response.body)).to.equal('object');
        done();
      });
  });

  it('should return the contents of the data folder on a ' +
      'GET request to "/data"', function(done) {
      chai.request('localhost:3000')
        .get('/')
        .then(function(response) {
          // Retrieve and compare the first index of each check
          expect(fs.readdirSync('./data')[0]).to.eql(JSON.parse(response.text)[0]);
          done();
        });
  });

  it('should save a new file on "POST request ONLY if path is "/data"', function(done) {
    chai.request('localhost:3000')
      .post('/somethingElse')
      .send({ name: 'Jason'})
      .then(function(response) {
        expect(response.statusCode).to.eql(404);
        done();
      });
  });


  it('should save a new file on "POST request', function(done) {
    // Check that the number of files in the data directory changed
    var files = fs.readdirSync('./data');
    var numFiles = files.length;
    chai.request('localhost:3000')
      .post('/data')
      .send({'username':'Joe'})
      .then(function(response) {
        var newFiles = fs.readdirSync('./data');
        var newNumFiles = newFiles.length;
        expect(numFiles).to.not.eql(newNumFiles);
        done();
      });
  });

  it('should update a file with a "PUT" request', function(done) {
    // Check that the number of files in the data directory changed
    var files = fs.readFileSync('./data/joe.json', 'utf8');
    chai.request('localhost:3000')
      .put('/joe')
      .send({'username':'Joe', 'email':'joe@joe.com'})
      .then(function(response) {
        var newFiles = fs.readFileSync('./data/joe.json', 'utf8');
        expect(files).to.not.eql(newFiles);
        done();
      });
  });

  it('should delete a file on a "DELETE" request', function(done) {
    // Check that the number of files in the data directory changed
    var files = fs.readdirSync('./data');
    var numFiles = files.length;
    chai.request('localhost:3000')
      .delete('/joe')
      .then(function(response) {
        var newFiles = fs.readdirSync('./data');
        var newNumFiles = newFiles.length;
        expect(numFiles).to.not.eql(newNumFiles);
        done();
      });
  });

});
