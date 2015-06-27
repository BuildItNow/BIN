define([], function() 
{
	var Class = {};
	
	Class.apiByFunction = function(success)
	{
		bin.netManager.doAPI({api:"/api/byFunction", success:success, data:{a:10, b:"中国"}});
	}
	
	Class.apiByData = function(success)
	{
		bin.netManager.doAPI({api:"/api/byData", success:success});
	}

	Class.apiByFile = function(success)
	{
		bin.netManager.doAPI({api:"/api/byFile", success:success, type:"POST", data:{a:10, b:"Hello"}});
	}

	return Class;
});