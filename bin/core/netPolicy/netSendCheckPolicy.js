define(
[], 
function()
{
	var NetSendCheckPolicy = function(netManager)
	{
		this._netManager = netManager;
	}

	var Class = NetSendCheckPolicy.prototype;

	Class.init = function()
	{
		this._sendings = {};
	}

	Class.check = function(netParams)
	{
		// var oldNetParams = this._sendings[netParams.api]; 
		// if(oldNetParams)
		// {
		// 	switch(netParams.options.sendCheck)
		// 	{
		// 		case "CANCEL_ON_REQUESTING":
		// 		{
		// 			return {policy:"CANCEL", netParams:oldNetParams};
		// 		}
		// 		break;
		// 		case "REJECT_ON_REQUESTING":
		// 		{
		// 			return {policy:"REJECT", netParams:oldNetParams};
		// 		}
		// 		break;
		// 	}
		// }

		return false;
	}

	Class.onBeforeSend = function(netParams)
	{
		// if(!netParams.options.sendCheck)
		// {
		// 	return ;
		// }

		// var sendCheckData = {key:this._url2key(netParams.url), checking:true};
		// this._sendings[sendCheckData.key] = netParams;

		// netParams._sendCheckData = sendCheckData;
	}

	Class.onComplete = function(netParams)
	{
		// if(!netParams._sendCheckData.checking)
		// {
		// 	return ;
		// }

		// this._sendings[netParams.key] = null;
		// netParams._sendCheckData.checking = false;
	}

	return NetSendCheckPolicy;
});