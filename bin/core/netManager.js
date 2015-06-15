(function()
{
	var deps = ["jquery", "underscore", "bin/util/osUtil", "bin/core/netPolicy/netCallbackPolicy", "bin/core/netPolicy/netCachePolicy", "bin/core/netPolicy/netSendCheckPolicy"];
	if(bin.runtimeConfig.useNetLocal)
	{
		deps = ["jquery", "underscore", "bin/util/osUtil", "bin/core/netPolicy/netCallbackPolicy", "bin/core/netPolicy/netCachePolicy", "bin/core/netPolicy/netSendCheckPolicy", "bin/core/netPolicy/netDebugPolicy"];
	}
	define(
	deps,
	function($, _, osUtil, NetCallbackPolicy, NetCachePolicy, NetSendCheckPolicy, NetDebugPolicy)
	{
		var DEFAULT_NET_OPTIONS = {loading:"MODEL"};
		var Net  = function()
		{

		}

		var Class = Net.prototype;

		Class.init = function()
		{

			if(NetDebugPolicy)
			{
				this._debugPolicy = new NetDebugPolicy(this);
				this._debugPolicy.init();
			}
			
			this._callbackPolicy = new NetCallbackPolicy(this);
			this._callbackPolicy.init();

			this._cachePolicy = new NetCachePolicy(this);
			this._cachePolicy.init();

			this._sendCheckPolicy = new NetSendCheckPolicy(this);
			this._sendCheckPolicy.init();

			console.info("Net module initialize");
		}

		Class.doAPI = function(params)
		{
			if(!params.url && !params.api)
			{
				return ;
			}

			if(!params.url)
			{
				params.url = bin.runtimeConfig.server+params.api;
			}

			var self = this;

			var netParams = this._genNetParams(params);

			// Try send-check policy
			if(netParams.options.sendCheck)	
			{
				var checkResult = this._sendCheckPolicy.check(netParams);
				if(checkResult)
				{
					switch(checkResult.policy)
					{
						case "CANCEL":
						{
							this._sendCheckPolicy.onComplete(checkResult.netParams);

							if(checkResult.netParams.userdatas.request)
							{
								checkResult.netParams.userdatas.request.abort();
							}

							// Clear the old request call backs
							checkResult.netParams.callbacks = {}; 
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
			if(netParams.options.cache)
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

		Class._genNetParams = function(params)
		{
			var self = this;

			params.userdatas = {};
			params.options   = _.extend(osUtil.clone(DEFAULT_NET_OPTIONS), params.options);	
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
			if(netParams.options.cache && netParams.userdatas.from === "NET")
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

			if(netParams.options.sendCheck)
			{
				this._sendCheckPolicy.onComplete(netParams);
			}
		}

		Class._beforeSend = function(netParams)
		{
			if(netParams.options.sendCheck)
			{
				this._sendCheckPolicy.onBeforeSend(netParams);
			}

			this._callbackPolicy.beforeSend(netParams);
		}
		
		return Net;
	});
}
)();

