define(["bin/core/util"], function(util)
{
	var DEFAULT_NET_OPTIONS = {loading:"MODEL", silent:false};
	var Net  = function()
	{

	}

	var Class = Net.prototype;

	Class.init = function()
	{
		var self = this;
		if(bin.runtimeConfig.useNetLocal)
		{
			require(["bin/core/netPolicy/netDebugPolicy"], function(NetDebugPolicy)
			{
				self._debugPolicy = new NetDebugPolicy(self);
				self._debugPolicy.init();
			});
		}
		
		this._callbackPolicy = new Net.CallbackPolicy(this);
		this._callbackPolicy.init();

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

	Class.setSendCheckPolicy = function(policy)
	{
		this._sendCheckPolicy = policy;
	}

	Class.doAPIEx = function(params)
	{
		var self = this;
		var p = new Promise(function(resolve, reject)
			{
				params.success = function(netData, textStatus, xhr, params)
				{
					resolve(netData/*, textStatus, xhr, params*/);
				}

				params.error = function(xhr, textStatus, params)
				{
					reject(xhr/*, textStatus, params*/);
				}

				self.doAPI(params);
			});

		return p;
	}

	Class.doAPI = function(params)
	{
		if(this._callbackPolicy && this._callbackPolicy.before(params) === false)
		{
			if(params.error)
			{
				setTimeout(function()
				{
					params.error({status:0, statusText:"reject"}, "reject:CallbackPolicy.before", params);
				}, 0);
			}
			return ;
		}

		var netParams = this._genNetParams(params);
		if(!netParams)
		{
			if(params.error)
			{
				setTimeout(function()
				{
					params.error({status:0, statusText:"invalid"}, "invalid:_genNetParams", params);
				}, 0);
			}
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
						if(netParams.callbacks.error)
						{
							setTimeout(function()
							{
								netParams.callbacks.error({status:0, statusText:"reject"}, "reject:SendCheckPolicy.check", netParams);
							}, 0);
						}
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

				this._beforeSend(null, netParams);

				this._debugPolicy.getData(checkResult, netParams, function(data)
				{
					self._success(data, "success", null, netParams);
					self._complete(null, "success", netParams);
				},
				function(error)
				{
					self._error(error, "error", netParams);
					self._complete(null, "error", netParams);
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

		if(params.userdatas)	// It's generated, just return self
		{
			return params;
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

		params.options   = _.extend(util.clone(DEFAULT_NET_OPTIONS), params.options);	
		params.callbacks = _.pick(params, ["success", "complete", "beforeSend", "error"]);

		params.success = function(netData, textStatus, xhr)
		{
			return self._success(netData, textStatus, xhr, params);
		}

		params.error = function(xhr, textStatus)
		{
			return self._error(xhr, textStatus, params);
		}

		params.complete = function(xhr, textStatus)
		{
			return self._complete(xhr, textStatus, params);
		}

		params.beforeSend = function(xhr)
		{
			return self._beforeSend(xhr, params);
		}

		return params;
	}

	Class._success = function(data, textStatus, xhr, netParams)
	{
		if(xhr && data)
		{
			if(typeof data === "string")
			{
				var ct = xhr.getResponseHeader("Content-Type");
				if(ct && ct.indexOf("/json") > 0)
				{
					data = JSON.parse(data);
				}
			}
		}

		return this._callbackPolicy.success(data, textStatus, xhr, netParams);
	}

	Class._error = function(xhr, textStatus, netParams)
	{
		return this._callbackPolicy.error(xhr, textStatus, netParams);
	}

	Class._complete = function(xhr, textStatus, netParams)
	{
		var r = this._callbackPolicy.complete(xhr, textStatus, netParams);

		this._sendCheckPolicy.onComplete(netParams);

		return r;
	}

	Class._beforeSend = function(xhr, netParams)
	{
		this._sendCheckPolicy.onBeforeSend(netParams);
		
		return this._callbackPolicy.beforeSend(xhr, netParams);
	}
	
	return Net;
});

