define([], function() 
{
	var Class = {};
	
	Class.testAPI = function(success)
	{
		bin.netManager.doAPI({api:"/api/testAPI", success:success, type:"GET"});
	}
	return Class;
});