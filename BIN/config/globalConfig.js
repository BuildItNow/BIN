define(
{
	name : "Hello BIN Framework",
	runtime : "DEBUG",
	application : "application/application",
	pageIOAnim  : "rightIO",
	DEBUG : 
	{
		debug : true,
		useNetLocal : true,
		server : "http://localhost:8000"
	},
	RELEASE :
	{
		debug : false,
		useNetLocal : true,
		server : "http://localhost:8000"
	}
});