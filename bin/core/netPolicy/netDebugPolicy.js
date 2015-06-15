define(
	["bin/config/netLocalConfig", "bin/util/osUtil"],
	function(config, osUtil)
	{
		var NetDebugPolicy = function(netManager)
		{
			this._netManager = netManager;
		}

		var Class = NetDebugPolicy.prototype;

		Class.init = function()
		{

		}

		Class.check = function(netParams)
		{
			return config[netParams.api];
		}

		Class.getData = function(checkResult, netParams, success, error)
		{
			var apiDebugConfig = checkResult; 
			
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
					osUtil.nextTick(function(){error({status:400, statusText:"Client error"})});
					
					return ;
				}
			}

			var data = apiDebugConfig.data;
			if(typeof(data) === "string")
			{
				if(data.substr(0, 5) === "file!")
				{
					this._doDebugFile(data.substr(5), netParams, success, error);		
				}
				else
				{
					this._doDebugData(data, netParams, success, error);
				}
			}
			else if(typeof(data) === "function")
			{
				this._doDebugFunc(data, netParams, success, error);
			}
			else
			{
				this._doDebugData(data, netParams, success, error);
			}
		}

		Class._doDebugFunc = function(func, netParams, success, error)
		{
			var data = func(netParams);

			this._doDebugData(data, netParams, success, error);
		}

		Class._doDebugFile = function(file, netParams, success, error)
		{
			var self = this;
			var params = {url:file};
			params.success = function(data)
			{
				self._doDebugData(data, netParams, success, error);
			}
			params.error = function(error)
			{
				error(error);
			}

			this._netManager.ajax(params);
		}

		Class._doDebugData = function(data, netParams, success, error)
		{
			var netData = {code:0, data:osUtil.clone(data, true)};

			osUtil.delayCall(
			function()
			{
				success(netData);
			}, 500
			);
		}


		return NetDebugPolicy;
	}
);