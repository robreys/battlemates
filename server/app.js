var express = require('express');
var app = express();
var mongoose = require('mongoose');
var sockMod = require('./socket/module')(app);
mongoose.connect('mongodb://localhost/battlemates');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', sockMod.begin);