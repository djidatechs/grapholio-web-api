var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var CompilerRouter = require('./routes/compiler');

var app = express();
app.use(cors({
    origins: ['https://grapholio.djidax.com/application',"https://grapholio-web.netlify.app/application"]
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/compiler', CompilerRouter);

module.exports = app;
