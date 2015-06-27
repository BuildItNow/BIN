define([], function() 
{
	var Class = {};
	
	Class.testAPI = function(success)
	{
		bin.netManager.doAPI({api:"/api/testAPI", success:success, type:"GET", data:{a:10, b:"Hello"}});
	}
	return Class;
});