define(
["bin/util/lsUtil", "bin/util/ssUtil"],
function(lsUtil, ssUtil)
{
	// Global : Always
	// Global Session : APP Runtime
	// User : Always
	// User Session : User Login Runtime
	var DataCenter = function()
	{

	}

	DataCenter.extend = bin.extend;

	var Class = DataCenter.prototype;

	Class.init = function()
	{
		this._globalSession = {};	
	}

	Class.onUserLogin = function(identify)
	{
		this._userSession = {}

		this._userIdentify = identify;
		this._uvPrefix = identify+"_UV_";
	}

	Class.onUserLogout = function()
	{
		delete this._userSession;
		this._uvPrefix = null;
		this._userIdentify = null;
	}

	Class.isUserLogin = function(identify)
	{
		return identify ? this._userIdentify === identify : !!this._userSession;
	}
	
	Class.setUserValue = function(key, value)
	{
		if(!this._uvPrefix)
		{
			return ;
		}

		lsUtil.save(this._uvPrefix+key, value);
	}

	Class.getUserValue = function(key, def)
	{
		if(!this._uvPrefix)
		{
			return null;
		}

		var ret = lsUtil.load(this._uvPrefix+key);
		return ret === null || ret === undefined ? def : ret;
	}

	Class.setUserSessionValue = function(key, value)
	{
		if(this._userSession)
		{
			this._userSession[key] = value;
		}
	}

	Class.getUserSessionValue = function(key, def)
	{
		var ret = null;
		if(this._userSession)
		{
			ret = this._userSession[key];
		}
		return ret === null || ret === undefined ? def : ret;
	}

	Class.setGlobalValue = function(key, value)
	{
		lsUtil.save("BIN_"+key, value);
	}

	Class.getGlobalValue = function(key, def)
	{
		var ret = lsUtil.load("BIN_"+key);
		return ret === null || ret === undefined ? def : ret;
	}

	Class.setGlobalSessionValue = function(key, value)
	{
		this._globalSession[key] = value;
	}

	Class.getGlobalSessionValue = function(key, def)
	{
		var ret = this._globalSession[key];
		return ret === null || ret === undefined ? def : ret;
	}
	
	if(typeof Backbone !== "undefined")
	{
		_.extend(Class, Backbone.Events);
	}

	return DataCenter;
}
);