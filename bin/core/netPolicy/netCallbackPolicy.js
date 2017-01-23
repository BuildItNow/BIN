define(
	[],
	function()
	{
		var NetCallbackPolicy = function(netManager)
		{
			this._netManager = netManager;
		}

		NetCallbackPolicy.extend = bin.extend;

		var Class = NetCallbackPolicy.prototype;

		Class.init = function()
		{

		}

		Class.before = function(params)
		{

		}

		Class.beforeSend = function(xhr, netParams)
		{
			var options = netParams.options;
			if(options.loading)
			{
				netParams.userdatas.indicatorID = bin.hudManager.startIndicator({model:options.loading === "MODEL"});
			}

			if(netParams.callbacks.beforeSend)
			{
				return netParams.callbacks.beforeSend(xhr, netParams);
			}
		}

		Class.success = function(data, textStatus, xhr, netParams)
		{
			if(netParams.callbacks.success)
			{
				return netParams.callbacks.success(data, textStatus, xhr, netParams);
			}
		}

		Class.error = function(xhr, textStatus, netParams)
		{
			if(bin.runtimeConfig.debug)
			{
				console.error("API["+netParams.api+"] Error "+xhr.status+" "+xhr.statusText);
			}

			var status = "";

			if(xhr.status === 0)
			{
				if(xhr.statusText === "abort")
				{
					netParams.userdatas.abort = true;
				}
				else if(xhr.statusText === "timeout")
				{
					netParams.userdatas.timeout = true;
					status = "网络连接超时";
				}
				else
				{
					status = "网络连接失败，请检查您的网络";
				}
			}
			else
			{
				status = "网络错误，错误代码 "+xhr.status;
			}

			if(status && !netParams.options.silent)
			{
				bin.hudManager.showStatus(status);
			}

			if(netParams.callbacks.error)
			{
				return netParams.callbacks.error(xhr, textStatus, netParams);
			}
		}

		Class.complete = function(xhr, textStatus, netParams)
		{
			var r = undefined;
			if(netParams.callbacks.complete)
			{
				r = netParams.callbacks.complete(xhr, textStatus, netParams);
			}

			if(netParams.userdatas.indicatorID)
			{
				bin.hudManager.stopIndicator(netParams.userdatas.indicatorID);
			}

			return r;
		}

		return NetCallbackPolicy;
	}
);