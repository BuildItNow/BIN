define(
["bin/core/dataCenter"], 
function(DataCenter)
{
	// NORMAL

	// DURATION

	// SESSION

	// USER_SESSION : TODO : Add user login and logout event handle
	
	var NetCachePolicy = function(netManager)
	{
		this._netManager = netManager;
	}

	NetCachePolicy.extend = bin.extend;

	var Class = NetCachePolicy.prototype;

	Class.init = function()
	{
		this._cacheDataCenter = new DataCenter();
		this._cacheDataCenter.init();
	}

	Class.check = function(netParams)
	{
		var cache = netParams.options.cache;
		if(!cache)
		{
			return false;
		}

		// Don't cache POST request
		if(!(!netParams.type || netParams.type.toUpperCase() === "GET"))	
		{
			return false;
		} 

		netParams.userdatas.canCache = true;

		if(cache === "NORMAL" || cache === "DURATION")
		{
			var ret = this._cacheDataCenter.getGlobalValue(netParams.userdatas.urlKey);
			if(!ret)
			{
				return false;
			}

			if((_.now()-ret.time) > ret.duration)
			{
				this._cacheDataCenter.setGlobalValue(netParams.userdatas.urlKey, null);

				return false;
			}

			return ret;
		}
		else if(cache === "SESSION")
		{
			return this._cacheDataCenter.getGlobalSessionValue(netParams.userdatas.urlKey);
		}
		else if(cache === "USER_SESSION")
		{
			return this._cacheDataCenter.getUserSessionValue(netParams.userdatas.urlKey);
		}

		return false;
	}

	Class.getData = function(checkResult, netParams, success, error)
	{
		setTimeout(function(){success(checkResult.data);}, 0);
	}

	Class.setData = function(netParams, data)
	{
		if(!netParams.userdatas.canCache)
		{
			return ;
		}

		// {time, data, duration}
		var cache = netParams.options.cache;
		if(cache === "NORMAL")
		{
			this._cacheDataCenter.setGlobalValue(netParams.userdatas.urlKey, {time:_.now(), data:data, duration:bin.runtimeConfig.maxCacheDuration});
		}
		else if(cache === "DURATION")
		{
			this._cacheDataCenter.setGlobalValue(netParams.userdatas.urlKey, {time:_.now(), data:data, duration:netParams.options.cacheDuration});
		}
		else if(cache === "SESSION")
		{
			this._cacheDataCenter.setGlobalSessionValue(netParams.userdatas.urlKey, {time:_.now(), data:data});
		}
		else if(cache === "USER_SESSION")
		{
			this._cacheDataCenter.setUserSessionValue(netParams.userdatas.urlKey, {time:_.now(), data:data});
		}
	}

	return NetCachePolicy;
});