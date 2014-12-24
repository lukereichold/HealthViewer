/**
 * Module dependencies.
 */

var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var csrf = require('lusca').csrf();
var methodOverride = require('method-override');

var _ = require('lodash');
var MongoStore = require('connect-mongo')(session);
var flash = require('express-flash');
var path = require('path');
var mongoose = require('mongoose');
var expressValidator = require('express-validator');
var connectAssets = require('connect-assets');

/**
 * Controllers (route handlers).
 */

var homeController = require('./controllers/home');
var generateController = require('./controllers/generate');
var viewerController = require('./controllers/viewer');

/**
 * API keys.
 */

var secrets = require('./config/secrets');

/**
 * Create Express server.
 */

var app = express();

/**
 * Connect to MongoDB.
 */

mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
});

/**
 * CSRF whitelist.
 */

var csrfExclude = ['/url1', '/url2'];

/**
 * Express configuration.
 */

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(compress());
app.use(connectAssets({
  paths: [path.join(__dirname, 'public/css'), path.join(__dirname, 'public/js')]
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secrets.sessionSecret,
  store: new MongoStore({ url: secrets.db, auto_reconnect: true })
}));
app.use(flash());
app.use(function(req, res, next) {
  // CSRF protection.
  if (_.contains(csrfExclude, req.path)) return next();
  csrf(req, res, next);
});

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

/**
 * Main routes.
 */

app.get('/', homeController.index);
app.get('/generate', generateController.getGenerate);
app.post('/generate', generateController.generateID);
app.get('/viewer', viewerController.getViewer);
app.post('/viewer', viewerController.postData);

/**
 * 500 Error Handler.
 */

app.use(errorHandler());

/**
 * Start Express server.
 */

app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;