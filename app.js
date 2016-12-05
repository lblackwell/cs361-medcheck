var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var mustache = require('mustache');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var pool = mySQL.createPool({
  host  : 'localhost',
  user  : 'student',
  password: 'default',
  database: 'student'
})

var engines = require('consolidate');

var index = require('./routes/index'), login = require('./routes/login');
var app = express();

app.set('views', __dirname + '/views');
app.engine('html', engines.mustache);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/", index);
app.use("/login", login);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//add user to database
app.post('/addUser', function(req, res, next){
  var context = {};
  pool.query("INSERT INTO med_user SET ?", req.body, function(err, result){
    if(err){
      next(err);
      return;
    }
      context.results = rows;
      res.send(rows);
    });
});

app.get('/searchMedication', function(req, res, next){
  var context = {};
    pool.query('SELECT * FROM med_medication WHERE id = ?', req.body, function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      context.results = JSON.stringify(rows);
      res.type('json');
      res.send(context.results);
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
