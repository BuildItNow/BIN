define(
[], 
function()
{
	var NetSendCheckPolicy = function(netManager)
	{
		this._netManager = netManager;
	}

	NetSendCheckPolicy.extend = bin.extend;

	var Class = NetSendCheckPolicy.prototype;

	Class.init = function()
	{
		this._sendings = {};
	}

	Class.check = function(netParams)
	{
		var sendCheck = netParams.options.sendCheck;
		if(!netParams.options.sendCheck || !netParams.api)
		{
			return false;
		}

		var oldNetParams = this._sendings[netParams.api];
		if(!oldNetParams)
		{
			return false;
		}

		switch(sendCheck)
		{
			case "ABORT_ON_REQUESTING":
			{
				return {policy:"ABORT", netParams:oldNetParams};
			}
			break;
			case "REJECT_ON_REQUESTING":
			{
				return {policy:"REJECT", netParams:oldNetParams};
			}
			break;
		}

		return false;
	}

	Class.onBeforeSend = function(netParams)
	{
		if(netParams.options.sendCheck && netParams.api)
		{
			this._sendings[netParams.api] = netParams;
			netParams.userdatas.sendChecking = true;
		}
	}

	Class.onComplete = function(netParams)
	{
		if(!netParams.userdatas.sendChecking)
		{
			return ;
		}

		delete this._sendings[netParams.api];
		delete netParams.userdatas.sendChecking;
	}

	return NetSendCheckPolicy;
});