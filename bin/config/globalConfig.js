define(
{
	name        : "Hello BIN Framework",		// Name of the application
	version     : "1.0.0"						// Applicatoin version	
	pageIOAnim  : "rightIO",					// Default page in/out animation
	runtime     : "DEBUG",					    // runtime config
	DEBUG : 
	{
		debug : true,
		useNetLocal : true,
		server : "http://localhost:8081",
		timeout : 20000,
		maxCacheDuration : 20000,
	},	
	RELEASE :
	{
		debug : false,
		useNetLocal : true,
		server : "http://localhost:8081",
		timeout : 20000,
		maxCacheDuration : 1*24*60*60*1000,
	}
});