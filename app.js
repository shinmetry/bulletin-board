var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var session = require('express-session'); 
var passport = require('passport');
var Post = require('./models/post');
const fs = require('fs');

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.HEROKU_URL ? process.env.HEROKU_URL + 'auth/google/callback' : "http://localhost:8000/auth/google/callback"
}, function (accessToken, refreshToken, profile, done) {
  process.nextTick(function () {
     done(null, profile);
  });
}));

var index = require('./routes/index');
var login = require('./routes/login');
var logout = require('./routes/logout');

var app = express();
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.GOOGLE_CLIENT_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/login', login);
app.use('/logout', logout);

app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['email', 'profile']
  }),
  function (req, res) {});

app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login'
  }),
  function (req, res) {
    res.redirect('/');
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
