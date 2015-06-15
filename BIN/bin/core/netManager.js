(function()
{
	var deps = ["jquery", "underscore", "bin/util/osUtil", "bin/core/netPolicy/netCallbackPolicy"];
	if(bin.runtimeConfig.useNetLocal)
	{
		deps = ["jquery", "underscore", "bin/util/osUtil", "bin/core/netPolicy/netCallbackPolicy", "bin/core/netPolicy/netDebugPolicy"];
	}
	define(
	deps,
	function($, _, osUtil, NetCallbackPolicy, NetDebugPolicy)
	{
		var DEFAULT_NET_OPTIONS = {loading:"model"};
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

			// Try debug policy
			if(this._debugPolicy)
			{
				var checkResult = this._debugPolicy.check(netParams);
				if(checkResult)
				{
					netParams.userdatas.from = "debug";

					this._beforeSend(netParams);

					this._debugPolicy.doDebug(checkResult, netParams, function(data)
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

			}

			// Try send-check policy	
			{

			}					


			this.ajax(netParams);
		}

		Class.ajax = function(netParams)
		{
			$.ajax(netParams);
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
			this._callbackPolicy.success(data, netParams);
		}

		Class._error = function(error, netParams)
		{
			if(bin.runtimeConfig.debug)
			{
				console.error("API["+netParams.api+"] Error "+error.status+" "+error.statusText);
			}

			this._callbackPolicy.error(error, netParams);

			if(error.status === 0)
			{
				Notification.show
				({
					type: "error",
					message: "网络连接失败，请检查您的网络"
				});
			}
			else
			{
				Notification.show
				({
					type: "error",
					message: "网络错误，错误代码 "+error.status
				});

			}
		}

		Class._complete = function(netParams)
		{
			// do post work
			this._callbackPolicy.complete(netParams);
		}

		Class._beforeSend = function(netParams)
		{
			this._callbackPolicy.beforeSend(netParams);
		}

		Class._doDebugFunc = function(func, netParams)
		{
			var data = func(netParams);

			this._doDebugData(data, netParams);
		}

		Class._doDebugFile = function(file, netParams)
		{
			var self = this;
			var params = {};
			params.url = file;
			params.success = function(data)
			{
				self._doDebugData(data, netParams);
			}
			params.error = function(error)
			{
				console.info("ERROR : Load net debug file ["+file+"] fail");
				netParams.error(error);
			}

			$.ajax(params);
		}

		Class._doDebugData = function(data, netParams, error)
		{
			var netData = {code:0, data:osUtil.clone(data, true)};

			netParams.beforeSend();
			osUtil.delayCall(
			function()
			{
				if(error)
				{
					netParams.error(error);
				}
				else
				{
					netParams.success(netData);
				}
				netParams.complete();
			}, 500
			);
		}

		Class._tryDebug = function(netParams)
		{
			if(!debugConfig)
			{
				return false;
			}

			var api = netParams.api;

			var apiDebugConfig = debugConfig[api]; 
			if(!apiDebugConfig)
			{
				return false;
			}
			netParams.userdatas.from = "debug";

			// Check options
			if(apiDebugConfig.options)
			{
				var reqMethod = netParams.type;
				if(!reqMethod && (!apiDebugConfig.options.method || apiDebugConfig.options.method === "GET"))
				{
					// GET
				}
				else if(reqMethod && reqMethod === apiDebugConfig.options.method)
				{

				}
				else if(reqMethod && !apiDebugConfig.options.method)
				{
					console.WARNING("API ["+api+"] method not configed in debugNetConfig");
				}
				else
				{
					this._doDebugData(null, netParams, {status:400, statusText:"Client error"});
					return true;
				}
			}

			var data = apiDebugConfig.data;
			if(typeof(data) === "string")
			{
				if(data.substr(0, 5) === "file!")
				{
					this._doDebugFile(data.substr(5), netParams);		
				}
				else
				{
					this._doDebugData(data, netParams);
				}
			}
			else if(typeof(data) === "function")
			{
				this._doDebugFunc(data, netParams);
			}
			else
			{
				this._doDebugData(data, netParams);
			}

			return true;
		}
		
		return Net;
	});
}
)();

