var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var expect = chai.expect;
var should = chai.should();

chai.use(chaiHttp);


// Login //////////////////////////////////////////////
describe('/POST login', () => {
	// Correct username/password grants access
	it('it should POST a login with correct username and password', (done) => {
		let login = {
			username: "testuser",
			password: "password"
		}
	chai.request(server).post('/user').send(login).end((err, res) => {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.should.have.property('message').eql('Logged in successfully!');
		res.body.login.should.have.property('firstname');
		done();
		});
	});

	// Incorrect password blocks access
	it('it should not allow a login with an incorrect password', (done) => {
		let login = {
			username: "testuser",
			password: "incorrect"
		}
	chai.request(server).post('/user').send(login).end((err, res) => {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.should.have.property('errors');
		res.body.errors.should.have.property('password');
		res.body.errors.password.should.have.property('kind').eql('incorrect');
		done();
		});
	});

	// Blank password blocks access
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

	// Non-registered username blocks access
	it('it should not allow a login with a non-registered username', (done) => {
		let login = {
			username: "incorrect",
			password: "password"
		}
	chai.request(server).post('/user').send(login).end((err, res) => {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.should.have.property('errors');
		res.body.errors.should.have.property('username');
		res.body.errors.username.should.have.property('kind').eql('unregistered');
		done();
		});
	})

});


// Search /////////////////////////////////////////////

	// Search does not execute without a term entered

	// Search with matching term returns appropriate match

	// Search without matching term returns nothing