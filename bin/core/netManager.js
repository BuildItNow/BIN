define(function()
{
	var DEFAULT_NET_OPTIONS = {loading:"MODEL", silent:false};
	var Net  = function()
	{

	}

	var Class = Net.prototype;

	Class.init = function()
	{
		if(bin.runtimeConfig.useNetLocal)
		{
			this._debugPolicy = new Net.DebugPolicy(this);
			this._debugPolicy.init();
		}
		
		this._callbackPolicy = new Net.CallbackPolicy(this);
		this._callbackPolicy.init();

		this._cachePolicy = new Net.CachePolicy(this);
		this._cachePolicy.init();

		this._sendCheckPolicy = new Net.SendCheckPolicy(this);
		this._sendCheckPolicy.init();

		console.info("Net module initialize");
	}

	Class.setDebugPolicy = function(policy)
	{
		this._debugPolicy = policy;
	}

	Class.setCallbackPolicy = function(policy)
	{
		this._callbackPolicy = policy;
	}

	Class.setCachePolicy = function(policy)
	{
		this._cachePolicy = policy;
	}

	Class.setSendCheckPolicy = function(policy)
	{
		this._sendCheckPolicy = policy;
	}

	Class.doAPI = function(params)
	{
		var netParams = this._genNetParams(params);
		if(!netParams)
		{
			return ;
		}

		var self = this;

		// Try send-check policy
		{
			var checkResult = this._sendCheckPolicy.check(netParams);
			if(checkResult)
			{
				switch(checkResult.policy)
				{
					case "ABORT":
					{
						this._sendCheckPolicy.onComplete(checkResult.netParams);

						if(checkResult.netParams.userdatas.request)
						{
							checkResult.netParams.userdatas.request.abort();
						}
					}
					break;
					case "REJECT":
					{
						return ;
					}
					break;
				}
			}
		}	

		// Try debug policy
		if(this._debugPolicy)
		{
			var checkResult = this._debugPolicy.check(netParams);
			if(checkResult)
			{
				netParams.userdatas.from = "DEBUG";

				this._beforeSend(netParams);

				this._debugPolicy.getData(checkResult, netParams, function(data)
				{
					self._success(data, netParams);
					self._complete(netParams);
				},
				function(error)
				{
					self._error(error, netParams);
					self._complete(netParams);
				});

				return ;
			}
		}

		// Try cache policy
		{
			var checkResult = this._cachePolicy.check(netParams);
			if(checkResult)
			{
				netParams.userdatas.from = "CACHE";

				this._beforeSend(netParams);

				this._cachePolicy.getData(checkResult, netParams, function(data)
				{
					self._success(data, netParams);
					self._complete(netParams);
				},
				function(error)
				{
					self._error(error, netParams);
					self._complete(netParams);
				});

				return ;
			}

		}

		netParams.userdatas.from = "NET";
		netParams.userdatas.request = this.ajax(netParams);
	}

	Class.ajax = function(netParams)
	{
		return $.ajax(netParams);
	}

	Class._genUrlKey = function(url, data)
	{
		if(data)
		{
			var pairs = [];
			for(var key in data)
            {
                pairs.push(key+"="+data[key]);    
            }

            return url+(url.indexOf('?')<0 ? "?" : "&")+pairs.join("&");
		}
		else
		{
			return url;
		}
	}

	Class._genNetParams = function(params)
	{
		if(!params.url && !params.api)
		{
			return null;
		}

		params.userdatas = {};
		
		if(!params.url)
		{
			params.url = bin.runtimeConfig.server+params.api;
		}

		if(!params.type || params.type.toUpperCase() === "GET")
		{
			params.userdatas.urlKey = this._genUrlKey(params.url, params.data);
		}
		else
		{
			params.userdatas.urlKey = this._genUrlKey(params.url);
		}

		if(params.timeout === undefined)
		{
			params.timeout = bin.runtimeConfig.timeout;
		}

		var self = this;

		params.options   = _.extend(bin.util.osUtil.clone(DEFAULT_NET_OPTIONS), params.options);	
		params.callbacks = _.pick(params, ["success", "complete", "beforeSend", "error"]);

		params.success = function(netData)
		{
			self._success(netData, params);
		}

		params.error = function(error)
		{
			self._error(error, params);
		}

		params.complete = function()
		{
			self._complete(params);
		}

		params.beforeSend = function()
		{
			self._beforeSend(params);
		}

		return params;
	}

	Class._success = function(data, netParams)
	{
		if(netParams.userdatas.from === "NET")
		{
			this._cachePolicy.setData(netParams, data);
		}

		this._callbackPolicy.success(data, netParams);
	}

	Class._error = function(error, netParams)
	{
		this._callbackPolicy.error(error, netParams);
	}

	Class._complete = function(netParams)
	{
		this._callbackPolicy.complete(netParams);

		this._sendCheckPolicy.onComplete(netParams);
	}

	Class._beforeSend = function(netParams)
	{
		this._sendCheckPolicy.onBeforeSend(netParams);
		
		this._callbackPolicy.beforeSend(netParams);
	}
	
	return Net;
});

