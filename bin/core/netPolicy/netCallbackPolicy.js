define(
	[],
	function()
	{
		var NetCallbackPolicy = function(netManager)
		{
			this._netManager = netManager;
		}

		var Class = NetCallbackPolicy.prototype;

		Class.init = function()
		{

		}

		Class.beforeSend = function(netParams)
		{
			var options = netParams.options;
			if(options.loading)
			{
				netParams.userdatas.indicatorID = bin.hudManager.startIndicator({model:options.loading === "MODEL"});
			}

			if(netParams.callbacks.beforeSend)
			{
				netParams.callbacks.beforeSend(netParams);
			}
		}

		Class.success = function(data, netParams)
		{
			if(netParams.callbacks.success)
			{
				netParams.callbacks.success(data, netParams);
			}
		}

		Class.error = function(error, netParams)
		{
			if(bin.runtimeConfig.debug)
			{
				console.error("API["+netParams.api+"] Error "+error.status+" "+error.statusText);
			}

			if(netParams.callbacks.error)
			{
				netParams.callbacks.error(error, netParams);
			}
		}

		Class.complete = function(netParams)
		{
			if(netParams.callbacks.complete)
			{
				netParams.callbacks.complete(netParams);
			}

			if(netParams.userdatas.indicatorID)
			{
				bin.hudManager.stopIndicator(netParams.userdatas.indicatorID);
			}
		}

		return NetCallbackPolicy;
	}
);