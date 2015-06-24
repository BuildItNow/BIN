 define(["bin/common/indicatorView", "bin/common/alertView"], 
	function(IndicatorView, AlertView)
	{
		var HUDManager = function()
		{

		}

		var Class = HUDManager.prototype;

		Class.init = function()
		{
			var root = $("#HUDContainer");

			// Add net
			var elemIndicatorContainer = $("<div id='indicatorHUD' style='z-index:1;position:absolute;background-color:transparent;pointer-events:none;width:100%;height:100%'></div>");
			root.append(elemIndicatorContainer);
			// Add alert
			
			this._elemAlertContainer = $("<div id='alertHUD'     style='z-index:2;position:absolute;background-color:transparent;pointer-events:none;width:100%;height:100%;text-align:center;'></div>");
			root.append(this._elemAlertContainer);
           	
			// Add status

			this._indicator = new IndicatorView();
			elemIndicatorContainer.append(this._indicator.$());
		}

		Class.startIndicator = function(options)
		{
			return this._indicator.start(options);
		}

		Class.stopIndicator = function(indicatorID)
		{
			this._indicator.stop(indicatorID);
		}

		Class.alert = function(options)
		{
			var v = new AlertView(options);
			this._elemAlertContainer.append(v.$());

			return v;
		}

		Class.alertError = function(options)
		{
			if(options.title)
			{
				options.title.color = "red";
			}
			else
			{
				options.message.color = "red";
			}

			return this.alert(options);
		}

		Class.alertInfo = function(message, title)
		{
			var options = {title:(title ? {text:title} : null), message:{text:message}, buttons:[{text:"确定", onClick:function(v){v.close()}}]};

			return this.alert(options);
		} 

		return HUDManager;
	}
);