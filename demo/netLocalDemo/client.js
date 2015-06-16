define([], function() 
{
	var Class = {};
	
	Class.apiByFunction = function(success)
	{
		bin.netManager.doAPI({api:"/api/byFunction", success:success});
	}
	
	Class.apiByData = function(success)
	{
		bin.netManager.doAPI({api:"/api/byData", success:success});
	}

	Class.apiByFile = function(success)
	{
		bin.netManager.doAPI({api:"/api/byFile", success:success, type:"POST"});
	}

	return Class;
});