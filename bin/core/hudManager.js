 define([], 
	function()
	{
		var HUDManager = function()
		{

		}

		HUDManager.extend = bin.extend;

		var Class = HUDManager.prototype;

		Class.init = function()
		{
			var root = $("#HUDContainer");

			this._hudViews = {};

			// Add net
			var elemIndicatorContainer = $("<div id='indicatorHUD' class='bin-hud-wrapper' style='z-index:1;'></div>");
			root.append(elemIndicatorContainer);

			// Add alert
			this._elemAlertContainer = $("<div id='alertHUD' class='bin-hud-wrapper' style='z-index:2;text-align:center;'></div>");
			root.append(this._elemAlertContainer);	
			// Add status
			this._elemStatusContainer = $("<div id='statusHUD' class='bin-hud-wrapper' style='z-index:3;text-align:center;'></div>");
			root.append(this._elemStatusContainer);

			this._alertZIndex = 1;

			this.initComponentConfig();
		
			console.info("HUDManager module initialize");

			var self = this;
			require([this.IndicatorViewPath], function(IndicatorView)
			{
				self._indicator = IndicatorView.create();
				elemIndicatorContainer.append(self._indicator.$());
			});
		}

		Class.initComponentConfig = function()
		{
			this.IndicatorViewPath = bin.componentConfig.indicator || "view!bin/common/indicatorView";
			this.StatusViewPath = bin.componentConfig.status || "view!bin/common/statusView";
			this.SelectViewPath = bin.componentConfig.select || "view!bin/common/selectView";
			this.AlertViewPath = bin.componentConfig.alert || "view!bin/common/alertView";
			this.DatePickerViewPath = bin.componentConfig.datePicker || "view!bin/common/datePickerView";
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
			require([status || this.StatusViewPath], function(StatusView)
			{
				var v = StatusView.create({text:message});
				self._elemStatusContainer.append(v.$()); 

				cb && cb(v);
			});
			
		}
		Class.select = function(options, cb, select)
		{
			var self = this;
			require([select || this.SelectViewPath], function(SelectView)
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
			if(bin.isString(options))
			{
				var message = options;
				options = 
				{
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

			var self = this;
			require([alert || this.AlertViewPath], function(AlertView)
			{
				var v = AlertView.create(options);
				v.$().css("z-index", self._alertZIndex);
				++self._alertZIndex;

				self._elemAlertContainer.append(v.$());

				cb && cb(v);
			});
		}

		Class.confirm = function(message, onYes, onNo, cb)
		{
			var options = 
			{
				title:null, 
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
			require([datePicker || this.DatePickerViewPath], function(DatePickerView)
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
