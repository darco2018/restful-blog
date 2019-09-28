const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');
// var bodyParser = require("body-parser");

// ROUTERS
const blogsRouter = require('./routes/blogs.js');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
// express.json & express/encoded are only for POST & PUT as you send data object to server
app.use(express.json()); // for application/json   -> recognizes incoming to server Request Object as JSON Object
app.use(cookieParser());

// extended true allows for rich objects to be sent & arrays to be encoded into urls
// so if false 1) you can't post "nested object" eg person[name] blog[content];
// but will not filter '?' from query string  ?name=bob  will be { '?name': 'bob'}
// express.urlencoded recognizes incoming Request Object as string or array
app.use(express.urlencoded({ extended: true })); // for application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method')); // in url: _method=PUT/DELETE
app.use(expressSanitizer());

// body-parser ALTERNATIVE to express.json/urlencoded
// app.use(bodyParser.urlencoded({ extended: 'true' })); // const requestBodyStr = JSON.stringify(req.body);

app.use('/blogs', blogsRouter);

app.get('/', (req, res) => {
  res.render('landing');
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
