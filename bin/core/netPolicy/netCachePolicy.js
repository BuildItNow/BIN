define(
[], 
function()
{
	var NetCachePolicy = function(netManager)
	{
		this._netManager = netManager;
	}

	var Class = NetCachePolicy.prototype;

	Class.init = function()
	{

	}

	Class.check = function(netParams)
	{
		return false;
	}

	Class.getData = function(checkResult, netParams, success, error)
	{

	}

	Class.setData = function(netParams, data)
	{

	}

	return NetCachePolicy;
});