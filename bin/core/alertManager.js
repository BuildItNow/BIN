define([
		"bin/common/extend", "bin/core/alertView"
		], 
	function(extend, AlertView)
	{
		var AlertManager = function()
		{

		}

		AlertManager.extend = extend;

		var Class = AlertManager.prototype;
		
		Class.init = function()
		{
			var root = $("#HUDContainer");
			this._elemAlertContainer = $("<div id='alertHUD' style='position:absolute;background-color:transparent;pointer-events:none;z-index:2;width:100%;height:100%;text-align:center;'></div>");
            root.append(this._elemAlertContainer);
            this._alertZIndex = 1; 

            console.info("AlertManager module initialize");
		}

		Class.alert = function(options)
		{
			var v = new AlertView(options);
			v.$().css("z-index", this._alertZIndex);
			this._elemAlertContainer.append(v.$());

			++this._alertZIndex;
			
			return v;
		}

		Class.error = function(options)
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

		Class.info = function(message, title)
		{
			var options = {title:(title ? {text:title} : null), message:{text:message}, buttons:[{text:"确定", onClick:function(v){v.close()}}]};

			return this.alert(options);
		}

		return AlertManager;
	});