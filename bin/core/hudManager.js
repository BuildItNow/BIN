 define([], 
	function()
	{
		var HUDManager = function()
		{

		}

		var Class = HUDManager.prototype;

		Class.init = function()
		{
			var root = $("#HUDContainer");

			this._hudViews = {};

			// Add net
			var elemIndicatorContainer = $("<div id='indicatorHUD' style='z-index:1;position:absolute;background-color:transparent;pointer-events:none;width:100%;height:100%'></div>");
			root.append(elemIndicatorContainer);

			// Add alert
			this._elemAlertContainer = $("<div id='alertHUD'       style='z-index:2;position:absolute;background-color:transparent;pointer-events:none;width:100%;height:100%;text-align:center;'></div>");
			root.append(this._elemAlertContainer);	
			// Add status
			this._elemStatusContainer = $("<div id='statusHUD'      style='z-index:3;position:absolute;background-color:transparent;pointer-events:none;width:100%;height:100%;text-align:center;'></div>");
			root.append(this._elemStatusContainer);

			this._alertZIndex = 1;
		
			console.info("HUDManager module initialize");

			var self = this;
			require([bin.componentConfig.indicator || "view!bin/common/indicatorView"], function(IndicatorView)
			{
				self._indicator = IndicatorView.create();
				elemIndicatorContainer.append(self._indicator.$());
			});
		}

		Class.startIndicator = function(options)
		{
			return this._indicator ? this._indicator.start(options) : null;
		}

		Class.stopIndicator = function(indicatorID)
		{
			this._indicator && this._indicator.stop(indicatorID);
		}

		Class.showStatus = function(message, cb, status)
		{
			var self = this;
			require([status || bin.componentConfig.status || "view!bin/common/statusView"], function(StatusView)
			{
				var v = StatusView.create({text:message});
				self._elemStatusContainer.append(v.$()); 

				cb && cb(v);
			});
			
		}
		Class.select = function(options, cb, select)
		{
			var self = this;
			require([select || bin.componentConfig.select || "view!bin/common/selectView"], function(SelectView)
			{
				var v = SelectView.create(options);
				v.$().css("z-index", self._alertZIndex);
				++self._alertZIndex;
				
				self._elemAlertContainer.append(v.$());

				cb && cb(v);
			});
			
		}
		Class.alert = function(options, cb, alert)
		{
			var self = this;
			require([alert || bin.componentConfig.alert || "view!bin/common/alertView"], function(AlertView)
			{
				var v = AlertView.create(options);
				v.$().css("z-index", self._alertZIndex);
				++self._alertZIndex;

				self._elemAlertContainer.append(v.$());

				cb && cb(v);
			});
		}

		Class.alertError = function(message, title)
		{
			var options = {title:(title ? {text:title} : null), message:{text:message}, buttons:[{text:"确定"}]};

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
			var options = {title:(title ? {text:title} : null), message:{text:message}, buttons:[{text:"确定"}]};

			return this.alert(options);
		}

		Class.datePicker = function(options, cb, datePicker)
		{
			var self = this;
			require([datePicker || bin.componentConfig.datePicker || "view!bin/common/datePickerView"], function(DatePickerView)
			{
				if(typeof options === "function")
				{
					options = {onPick:options};
				}
				
				var v = DatePickerView.create(options);
				v.$().css("z-index", self._alertZIndex);
				++self._alertZIndex;
				
				self._elemAlertContainer.append(v.$());

				cb && cb(v);
			});

			
		} 

		Class.onCreateHUDView = function(view)
		{
			var hudid = view.hudid;
			if(this._hudViews[hudid])
			{
				return ;
			}

			this._hudViews[hudid] = view;
		}

		Class.onRemoveHUDView = function(view)
		{
			this._hudViews[view.hudid] = null;
			delete this._hudViews[view.hudid];
		}

		Class.onDeviceBack = function()
		{
			if(this._indicator && this._indicator.running())
			{
				this._indicator.reset();

				return true;
			}

			if(this._elemAlertContainer[0].children.length >  0)
			{ 
				var elem  = this._elemAlertContainer[0].children[this._elemAlertContainer[0].children.length-1];
				var hudid = elem.getAttribute("data-hudid");
				var view  = this._hudViews[hudid];
				if(view)
				{
					view.remove();
				}

				return true;
			}

			return false;
		}

		return HUDManager;
	}
);