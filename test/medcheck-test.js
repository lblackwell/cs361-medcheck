var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var expect = chai.expect;
var should = chai.should();

chai.use(chaiHttp);

// Check that login posts

// Check that a correct username/password grants access

// Check that an incorrect password blocks access

// Check that a blank password blocks access
describe('/POST login', () => {
	it('it should not POST a login without password entered', (done) => {
		let login = {
			username: "testuser"
		}
	chai.request(server).post('/user').send(login).end((err, res) => {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.should.have.property('errors');
		res.body.errors.should.have.property('password');
		res.body.errors.password.should.have.property('kind').eql('required');
		done();
	});
	});
});

// Check that a non-registered username blocks access