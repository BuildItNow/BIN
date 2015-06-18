var express = require('express');
var app = express();
var path = require('path');

var PATH = "../../demo";
var PORT = 8080;

app.use(express.static(path.resolve(PATH)));

app.get('/', function(req, res) 
{
	res.redirect('/index.html');
});

app.listen(PORT);
console.log('Listening '+PORT);