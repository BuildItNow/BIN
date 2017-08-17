 define(["layerui"], function()
	{
		var HUDManager = function()
		{

		}

		var Class = HUDManager.prototype;

		Class.init = function()
		{
			// var root = $("#HUDContainer");

			// this._hudViews = {};

			// // Add net
			// var elemIndicatorContainer = $("<div id='indicatorHUD' style='z-index:1;position:absolute;background-color:transparent;pointer-events:none;width:100%;height:100%'></div>");
			// root.append(elemIndicatorContainer);

			// // Add alert
			// this._elemAlertContainer = $("<div id='alertHUD'       style='z-index:2;position:absolute;background-color:transparent;pointer-events:none;width:100%;height:100%;text-align:center;'></div>");
			// root.append(this._elemAlertContainer);	
			// // Add status
			// this._elemStatusContainer = $("<div id='statusHUD'      style='z-index:3;position:absolute;background-color:transparent;pointer-events:none;width:100%;height:100%;text-align:center;'></div>");
			// root.append(this._elemStatusContainer);

			// this._alertZIndex = 1;
		
			// console.info("HUDManager module initialize");

			// var self = this;
			// require([bin.componentConfig.indicator || "view!bin/common/indicatorView"], function(IndicatorView)
			// {
			// 	self._indicator = IndicatorView.create();
			// 	elemIndicatorContainer.append(self._indicator.$());
			// });

 			this._indicator = {id:-1,count:0};
		}

		Class.startIndicator = function(options)
		{
			if(this._indicator.id < 0)
			{
				this._indicator.id = layer.load(1, options);
				this._indicator.count = 1;
			}
			else
			{
				++this._indicator.count;
			}

			return this._indicator;
		}

		Class.stopIndicator = function()
		{
			if(this._indicator.id > 0)
			{
				if(--this._indicator.count === 0)
				{
					layer.close(this._indicator.id);
					this._indicator.id = -1;
				}
			}
		}

		Class.showStatus = function(message)
		{
			layer.msg(message);			
		}

		Class.alert = function(message, options, onYes)
		{
			layer.alert(message, options, onYes);
		}

		Class.confirm = function(message, options, onYes, onNo)
		{
			layer.confirm(message, options, onYes, onNo);
		}

		Class.dialog = function(view, options, cb)
		{
			require([view], function(View)
			{
				var view = View.create(options);
				cb && cb(view);
			});
		}

		return HUDManager;
	}
);