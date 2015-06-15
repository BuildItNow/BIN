define(
["underscore", "backbone", "bin/common/extend", "bin/util/lsUtil", "bin/util/ssUtil"],
function(_, Backbone, extend, lsUtil, ssUtil)
{
	var USER_IDENTIFY = "BIN_USER_IDENTIFY";

	var DataCenter = function()
	{

	}

	DataCenter.extend = extend;

	var Class = DataCenter.prototype;

	Class.init = function()
	{
		this._userIdentify = window.localStorage[USER_IDENTIFY];
		this._onUserIdentifyChanged();

		console.info("DataCenter module initialize");
	}
	
	Class.setUserValue = function(key, value, seprate)
	{
		if(!this._userIdentify)
		{
			return ;
		}

		if(seprate)
		{
			lsUtil.save(this._uvPrefix+key, value);

			return ;
		}

		var ud = this.getUserData();
		ud[key] = value;

		this.setUserData(ud);
	}

	Class.getUserValue = function(key, def, seprate)
	{
		if(!this._userIdentify)
		{
			return null;
		}

		var ret = null;
		if(seprate)
		{
			ret = lsUtil.load(this._uvPrefix+key);
		}
		else
		{
			ret = this.getUserData()[key]
		}

		return ret === undefined || ret === null ? def : ret;
	}

	Class.getUserData = function()
	{
		if(!this._userIdentify)
		{
			return null;
		}

		var ret = lsUtil.load(this._udName);
	
		return ret || {};
	}

	Class.setUserData = function(ud)
	{
		if(!this._userIdentify)
		{
			return ;
		}

		if(ud)
		{
			var oud = this.getUserData();
			ud = _.extend(oud, ud);
		}

		lsUtil.save(this._udName, ud);
	}

	Class.setUserSessionValue = function(key, value, seprate)
	{
		if(!this._userIdentify)
		{
			return ;
		}

		if(seprate)
		{
			ssUtil.save(this._usvPrefix+key, value);

			return ;
		}

		var usd = this.getUserSessionData();
		usd[key] = value;

		this.setUserSessionData(usd);
	}

	Class.getUserSessionValue = function(key, def, seprate)
	{
		if(!this._userIdentify)
		{
			return null;
		}

		var ret = null;
		if(seprate)
		{
			ret = ssUtil.load(this._usvPrefix+key);
		}
		else
		{
			ret = this.getUserSessionData()[key]
		}

		return ret === undefined || ret === null ? def : ret;
	}

	Class.setUserSessionData = function(usd)
	{
		if(!this._userIdentify)
		{
			return ;
		}

		if(usd)
		{
			var ousd = this.getUserSessionData();
			usd = _.extend(ousd, usd);
		}
		
		ssUtil.save(this._usdName, usd);
	}

	Class.getUserSessionData = function()
	{
		if(!this._userIdentify)
		{
			return null;
		}

		var ret = ssUtil.load(this._usdName);
		return ret ? ret : {};
	}

	Class.getUserIdentify = function()
	{
		return this._userIdentify;
	}

	Class.setUserIdentify = function(userIdentify)
	{
		window.localStorage[USER_IDENTIFY] = userIdentify;
		this._userIdentify = userIdentify;

		this._onUserIdentifyChanged();
	}

	Class._onUserIdentifyChanged = function()
	{
		if(this._userIdentify)
		{
			this._udName  = "BIN_"+this._userIdentify+"_UD";
			this._usdName = "BIN_"+this._userIdentify+"_USD";
			this._uvPrefix = "BIN_"+this._userIdentify+"_UV_";
			this._usvPrefix = "BIN_"+this._userIdentify+"_USV_";
		}
		else
		{
			this._udName  = null;
			this._usdName = null;
			this._uvPrefix = null;
			this._usvPrefix = null;
		}
	}
	
	_.extend(Class, Backbone.Events);

	return DataCenter;
}
);