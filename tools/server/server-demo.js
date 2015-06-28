var express = require('express');
var app = express();
var path = require('path');

var PATH = "../../demo";
var PORT = 8081;

app.get("/api/abortRequest", function(req, res)
{
	setTimeout(function()
	{
		res.send({code:0, msg:"", data:{name:"abortRequest", method:"GET"}});
	}, 2000);
});

var rejectRequestID = 0;
app.get("/api/rejectRequest", function(req, res)
{
	setTimeout(function()
	{
		res.send({code:0, msg:"", data:{id:rejectRequestID++, method:"GET"}});
	}, 2000);
});

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