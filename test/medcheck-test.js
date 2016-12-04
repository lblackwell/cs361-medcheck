var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var expect = chai.expect;
var should = chai.should();

chai.use(chaiHttp);


// Login //////////////////////////////////////////////
describe('/POST login', () => {

	// Correct username/password grants access
	it('should POST a login with correct username and password', (done) => {
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
	it('should not allow a login with an incorrect password', (done) => {
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
	it('should not POST a login without password entered', (done) => {
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

	// Blank username blocks access
	it('should not POST a login without username entered', (done) => {
		let login = {
			password: "password"
		}
	chai.request(server).post('/user').send(login).end((err, res) => {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.should.have.property('errors');
		res.body.errors.should.have.property('username');
		res.body.errors.username.should.have.property('kind').eql('required');
		done();
		});
	});

	// Non-registered username blocks access
	it('should not allow a login with a non-registered username', (done) => {
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
describe('/GET search', () => {

	// Search does not execute without a term entered
	it('should not GET search results without a search term entered', (done) => {
		let search = {}
	chai.request(server).get('/search').send(search).end((err, res) => {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.should.have.property('errors');
		res.body.errors.should.have.property('term');
		res.body.errors.term.should.have.property('kind').eql('required');
		done();
		});
	});

	// Search with matching term returns appropriate match
	it('should GET search results with a matching search term', (done) => {
		let search = {
			term: "testdrug"
		}
	chai.request(server).get('/search').send(search).end((err, res) => {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.should.have.property('message').eql('1 result found.');
		res.body.search.should.have.property('drugname');
		done();
		});
	});

	// Search without matching term returns nothing
	it('should not GET search results without matching search term', (done) => {
		let search = {
			term: "nonexistent drug"
		}
	chai.request(server).get('/search').send(search).end((err, res) => {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.should.have.property('errors');
		res.body.errors.should.have.property('term');
		res.body.errors.term.should.have.property('kind').eql('not found');
		done();
		});
	});
});


// Submit new side effect //////////////////////////////
describe('/POST effect', () => {

	// New side effect should not be submitted without a medication name
	it('should not POST new side effect without a medication name entered', (done) => {
		let newEffect = {
			effect: "headache",
			severity: 1
		}
	chai.request(server).post('/effect').send(newEffect).end((err, res) => {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.should.have.property('errors');
		res.body.errors.should.have.property('medication');
		res.body.errors.medication.should.have.property('kind').eql('required');
		done();
		});
	});

	// New side effect should not be submitted without a description
	it('should not POST new side effect without an effect description', (done) => {
		let newEffect = {
			medication: "testmedication",
			severity: 1
		}
	chai.request(server).post('/effect').send(newEffect).end((err, res) => {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.should.have.property('errors');
		res.body.errors.should.have.property('effect');
		res.body.errors.effect.should.have.property('kind').eql('required');
		done();
		});
	});

	// Side effect should only be submitted once per medication
	it('should not POST new side effect if it already exists for that medication', (done) => {
		let newEffect = {
			medication: "testmedication",
			effect: "testeffect",
			severity: 1
		}
	chai.request(server).post('/effect').send(newEffect).end((err, res) => {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.should.have.property('errors');
		res.body.errors.should.have.property('effect');
		res.body.errors.effect.should.have.property('kind').eql('already exists');
		done();
		});
	});

	// Side effect should not be submitted for an unlisted medication
	it('should not POST new side effect for an unlisted medication', (done) => {
		let newEffect = {
			effect: "headache",
			medication: "nonexistent",
			severity: 1
		}
	chai.request(server).post('/effect').send(newEffect).end((err, res) => {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.should.have.property('errors');
		res.body.errors.should.have.property('medication');
		res.body.errors.medication.should.have.property('kind').eql('not listed');
		done();
		});
	});
});