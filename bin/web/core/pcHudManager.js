 define(["bin/core/hudManager", bin.componentConfig.indicator || "view!bin/web/common/pcIndicatorView"], function(Super, IndicatorView)
	{
		var Class = {};

		Class.init = function()
		{
			var rootElem = $("<div style='position:fixed' class='bin-HUD-container'></div>")
			$("body").append(rootElem);

			this._hudViews = {};

			// Add net
			var elemIndicatorContainer = $("<div id='indicatorHUD' class='bin-hud-wrapper' style='z-index:1;'></div>");
			rootElem.append(elemIndicatorContainer);

			this._indicator = IndicatorView.create();
			elemIndicatorContainer.append(this._indicator.$());

			// Add alert
			this._elemAlertContainer = $("<div id='alertHUD' class='bin-hud-wrapper' style='z-index:2;text-align:center;'></div>");
			rootElem.append(this._elemAlertContainer);	

			// Add status
			this._elemStatusContainer = $("<div id='statusHUD' class='bin-hud-wrapper' style='z-index:3;text-align:center;'></div>");
			rootElem.append(this._elemStatusContainer);

			this._alertZIndex = 1;

			this.initComponentConfig();
		
			console.info("HUDManager module initialize");
		}

		Class.initComponentConfig = function()
		{
			Super.prototype.initComponentConfig.call(this);

			this.IndicatorViewPath = bin.componentConfig.indicator || "view!bin/web/common/pcIndicatorView";
			this.StatusViewPath = bin.componentConfig.status || "view!bin/web/common/pcStatusView";
			this.SelectViewPath = bin.componentConfig.select || "view!bin/web/common/pcSelectView";
			this.AlertViewPath = bin.componentConfig.alert || "view!bin/web/common/pcAlertView";
		}

		Class.alert = function(options, cb, alert)
		{
			if(bin.isString(options))
			{
				var message = options;
				options = 
				{
					title: {text:"信息"},
					message: {text:message},
					buttons: [
						{
							text: "确定",
							onClick: cb
						}
					]
				}

				cb = null;
			}

			Super.prototype.alert.call(this, options, cb, alert);
		}

		Class.confirm = function(message, onYes, onNo, cb)
		{
			var options = 
			{
				title:{text:"信息"}, 
				message:{text:message}, 
				buttons:[
					{
						text:"确定", 
						onClick:function(view, text)
						{
							return onYes && onYes(view, text);
						}
					},
					{
						text:"取消", 
						onClick:function(view, text)
						{
							return onNo && onNo(view, text);
						}
					}
				]
			};

			return this.alert(options, cb);
		}

		Class.alertError = function(message, title)
		{
			title = title || "错误";
			
			return Super.prototype.alertError.call(this, message, title);
		}

		Class.alertInfo = function(message, title)
		{
			title = title || "信息";
			
			return Super.prototype.alertInfo.call(this, message, title);
		}

		Class.dialog = function(view, options, cb)
		{
			require([view], function(View)
			{
				var view = View.create(options);
				cb && cb(view);
			});
		}

		return Super.extend(Class);
	}
);
