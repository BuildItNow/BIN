define([], function() 
{
	var Class = {};
	
	Class.abortRequest = function(success, error)
	{
		bin.netManager.doAPI({api:"/api/abortRequest", success:success, error:error, type:"GET", data:{a:10, b:"Hello"}, options:{loading:true, sendCheck:"ABORT_ON_REQUESTING"}});
	}

	Class.rejectRequest = function(success)
	{
		bin.netManager.doAPI({api:"/api/rejectRequest", success:success, type:"GET", data:{a:10, b:"Hello"}, options:{loading:true, sendCheck:"REJECT_ON_REQUESTING"}});
	}

	return Class;
});