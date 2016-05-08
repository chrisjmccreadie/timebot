var should = require('should');
var request = require('supertest');
var server = require('../../../app');

describe('controllers', function() {

  describe('timebot_task', function() {



    describe('GET /task', function() {

      it('should return a default string', function(done) {

        request(server)
          .get('/task')
          .set('Accept', 'application/json')
          .set('id', '100')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);

            res.error.should.eql(false);

            done();
          });
      });


      it('should return an errror string', function(done) {
        request(server)
          .get('/task')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(400)
          .end(function(err, res) {
            should.not.exist(err);
            res.error.should.not.eql(true);
            done();
          });
      });


    });


    describe('PUT /task', function() {

      it('should add a task and return a default string', function(done) {

        request(server)
          .put('/task')
          .set('Accept', 'application/json')
          .set('name', 'A task')
          .set('submitterid', '12345')
          .set('Content-Type', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            //console.log(err)
            //console.log(res)
            should.not.exist(err);
            res.error.should.eql(false);
            done();
          });
      });
            
      it('should not add a task and return a default string missing name paramter', function(done) {

        request(server)
          .put('/task')
          .set('Accept', 'application/json')
          .set('submitterid', '12345')
          .set('Content-Type', 'application/json')
          .expect('Content-Type', /json/)
          .expect(400)
          .end(function(err, res) {
            //console.log(res)
            should.not.exist(err);
            res.error.should.not.eql(true);
            //res.body.should.eql({"message":"pmessage","taskid":"taskid"});
            done();
          });
      });

    });


  });

});
