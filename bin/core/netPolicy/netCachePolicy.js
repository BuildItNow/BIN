define(
["bin/util/osUtil"], 
function(osUtil)
{
	var NetCachePolicy = function(netManager)
	{
		this._netManager = netManager;
	}

	var Class = NetCachePolicy.prototype;

	Class.init = function()
	{
		this._cacheDatas = {};
	}

	Class.check = function(netParams)
	{
		if(!netParams.options.cache)
		{
			return false;
		}

		if(!(!netParams.type || netParams.type.toUpperCase() === "GET"))	// Must be GET
		{
			return false;
		} 

		netParams.userdatas.canCache = true;

		return this._cacheDatas[netParams.userdatas.urlKey];
	}

	Class.getData = function(checkResult, netParams, success, error)
	{
		osUtil.nextTick(function(){success(checkResult);});
	}

	Class.setData = function(netParams, data)
	{
		if(!netParams.userdatas.canCache)
		{
			return ;
		}

		this._cacheDatas[netParams.userdatas.urlKey] = data;
	}

	return NetCachePolicy;
});