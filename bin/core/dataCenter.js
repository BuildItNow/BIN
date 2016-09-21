define(
[],
function()
{
	var COMPRESS = true;

	var lsUtil = {};
	lsUtil.save = function(name, data)
    {
    	if(COMPRESS)
    	{
    		name = LZString.compress(name);
    	}

        if(data === null || data === undefined)
        {
            window.localStorage.removeItem(name);
            return ;
        }

        data = JSON.stringify(data);
        
        if(COMPRESS && data)
        {
        	data = LZString.compress(data);
        }

        window.localStorage[name] = data;
    }
        
    lsUtil.load = function(name)
    {
    	if(COMPRESS)
    	{
    		name = LZString.compress(name);
    	}

        var ret = window.localStorage[name];

        if(COMPRESS && ret)
        {
        	ret = LZString.decompress(ret);
        }

        return ret ? JSON.parse(ret) : null;
    }

    lsUtil.clear = function(name)
    {
    	if(COMPRESS)
    	{
    		name = LZString.compress(name);
    	}

        window.localStorage.removeItem(name);
    }

    var ssUtil = {};
	ssUtil.save = function(name, data)
    {
    	if(data === null || data === undefined)
        {
            window.sessionStorage.removeItem(name);
            return ;
        }
        
        window.sessionStorage[name] = JSON.stringify(data);
    }
        
    ssUtil.load = function(name)
    {
    	var ret = window.sessionStorage[name];

    	return ret ? JSON.parse(ret) : null;
    }

    ssUtil.clear = function(name)
    {
    	window.sessionStorage.removeItem(name);
    }

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
		this._uvPrefix = bin.globalConfig.appID+"u-"+identify+"-";
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
		lsUtil.save(bin.globalConfig.appID+"g-"+key, value);
	}

	Class.getGlobalValue = function(key, def)
	{
		var ret = lsUtil.load(bin.globalConfig.appID+"g-"+key);
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
	
	_.extend(Class, Backbone.Events);
	
	return DataCenter;
}
);