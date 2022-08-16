const express = require('express');
var cors = require('cors')
const app = express();
require('dotenv').config()
const https = require('https');
var querystring = require('querystring');
var os = require("os");
var fs = require('fs');
var app_hostname = os.hostname();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
     res.set('Cache-Control', 'no-store')
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.options('*', cors())

const port =8080;

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

 app.use('/', express.static(__dirname + '/dist/consumer-manifest'))
app.get('/callback',(req,res)=>{
  res.sendFile(path.join(__dirname, '/dist/consumer-manifest', 'index.html'));
})
app.get('*',(req,res) =>{
  res.sendFile(path.join(__dirname,'dist/consumer-manifest/index.html'));
});

app.listen(port, () => console.log(`Listening on port ${port}`)); 
