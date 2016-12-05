var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var mustache = require('mustache');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Promise = require('es6-promise').Promise;
var routes = require('./routes')

var pg = require('pg');

// create a config to configure both pooling behavior
// and client options
// note: all config is optional and the environment variables
// will be read if the config is not present
var config = {
  user: 'postgres', //env var: PGUSER
  database: 'medcheck', //env var: PGDATABASE
  password: 'password', //env var: PGPASSWORD
  host: '0.0.0.0', // Server hosting the postgres database
  //port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};


//this initializes a connection pool
//it will keep idle connections open for a 30 seconds
//and set a limit of maximum 10 idle clients
var pool = new pg.Pool(config);

// to run a query we can acquire a client from the pool,
// run a query on the client, and then return the client to the pool
pool.connect(function(err, client, done) {
  if (err) {
    return console.error('error fetching client from pool', err);
  }
  client.query('CREATE TABLE IF NOT EXISTS med_user (id SERIAL PRIMARY KEY, username VARCHAR(40), password VARCHAR(40), first_name VARCHAR(40), last_name VARCHAR(40), email VARCHAR(40))', function(err, result) {
    //call `done()` to release the client back to the pool
    done();

    if (err) {
      return console.error('error running query', err);
    }
  });

  client.query('CREATE TABLE IF NOT EXISTS medications (id SERIAL PRIMARY KEY, name VARCHAR(40), recall BOOLEAN)', function(err, result) {
    //call `done()` to release the client back to the pool
    done();

    if (err) {
      return console.error('error running query', err);
    }
  });



});

var engines = require('consolidate');

var index = require('./routes/index'),
  login = require('./routes/login');
var app = express();

app.set('views', __dirname + '/views');
app.engine('html', engines.mustache);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

app.route('/login')
  .get(function(req, res) {
    res.sendfile('./views/login.html');
  });

app.route('/registration')
  .get(function(req, res) {
    res.sendfile('./views/registration.html');
  });

app.route('/add')
  .post(function(req, res) {
    pool.connect(function(err, client, done) {
      if (err) {
        return console.error('error fetching client from pool', err);
      }
      client.query("INSERT INTO med_user (username, first_name, last_name, email, password) VALUES($1, $2, $3, $4, $5)", [req.body.username, req.body.first_name, req.body.last_name, req.body.email, req.body.password], function(err, result) {
        //call `done()` to release the client back to the pool
        done();

        if (err) {
          return console.error('error running query', err);
        }
        
        res.sendfile('./views/login.html');
      });
    });
    
  });


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//add user to database
// app.route('/add').post(function(req, res, next) {
//   console.log("YOOOO");
//   // to run a query we can acquire a client from the pool,
//   // run a query on the client, and then return the client to the pool
//   pool.connect(function(err, client, done) {
//     if (err) {
//       return console.error('error fetching client from pool', err);
//     }
//     client.query("INSERT INTO med_user SET ?", req.body, function(err, result) {
//       //call `done()` to release the client back to the pool
//       done();

//       if (err) {
//         return console.error('error running query', err);
//       }
//       console.log(result.rows[0].number);
//       //output: 1
//     });
//   });



// });

app.get('/search', function(req, res, next) {

  // to run a query we can acquire a client from the pool,
  // run a query on the client, and then return the client to the pool
  pool.connect(function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * FROM medications WHERE id = ?', req.body, function(err, result) {
      //call `done()` to release the client back to the pool
      done();

      if (err) {
        return console.error('error running query', err);
      }
      console.log(result);
    });
  });



});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
