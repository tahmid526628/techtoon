var createError = require('http-errors');
var express = require('express');
var path = require('path');
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session')
const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const multer = require('multer')
const flash = require('connect-flash')
const mongo = require('mongodb')
const mongoose = require('mongoose')
const db = mongoose.connection // a database variable to cntrl the database


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const membersRouter = require('./routes/members')
const aboutRouter = require('./routes/about')
const contactRouter = require('./routes/contact')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//handle file uploads
app.use(multer({dest: './uploads'}).any())

//handle express sessions  ==should be before passport handling
app.use(session({
  secret: "secret",
  saveUninitialized: true,
  resave: true
}))

//passport
app.use(passport.initialize())
app.use(passport.session())



//flash module using
app.use(flash())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/members', membersRouter,)
app.use('/about', aboutRouter)
app.use('/contact', contactRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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


// we can also use the following instead of passing object to layout.jade
// to confirming the user is logged in or not
// app.get('*', (req, res, next) => {
//   res.locals.user = req.user || null
//   next()
// })

module.exports = app;
