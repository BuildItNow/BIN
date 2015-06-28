var express = require('express');
var app = express();
var path = require('path');

var PATH = "../../demo";
var PORT = 8081;

app.get("/api/*", function(req, res)
{
	res.send({code:0, msg:"", data:{a:"Hello", b:"BIN", method:"GET"}});
});

app.post("/api/*", function(req, res)
{
	res.send({code:0, msg:"", data:{a:"Hello", b:"BIN", method:"POST"}});
});

app.listen(PORT);
console.log('Demo Server Listening '+PORT);