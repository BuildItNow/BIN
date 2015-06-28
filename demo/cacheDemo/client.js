define([], function() 
{
	var Class = {};
	
	Class.cacheNormal = function(success)
	{
		bin.netManager.doAPI({api:"/api/cacheNormal", success:success, type:"GET", data:{a:10, b:"Hello"}, options:{cache:"NORMAL"}});
	}

	Class.cacheDuration = function(success)
	{
		bin.netManager.doAPI({api:"/api/cacheDuration", success:success, type:"GET", data:{a:10, b:"Hello"}, options:{cache:"DURATION", cacheDuration:10000}});
	}

	Class.cacheSession = function(success)
	{
		bin.netManager.doAPI({api:"/api/cacheSession", success:success, type:"GET", data:{a:10, b:"Hello"}, options:{cache:"SESSION"}});
	}

	Class.cacheUserSession = function(success)
	{
		bin.netManager.doAPI({api:"/api/cacheUserSession", success:success, type:"GET", data:{a:10, b:"Hello"}, options:{cache:"USER_SESSION"}});
	}

	return Class;
});