define(
	["underscore", "bin/util/osUtil"],
	function(_, osUtil)
	{
		var Indicator = function()
		{

		}

		var Class = Indicator.prototype;
		Class.init = function()
		{
			var root = $("#HUDContainer");
			//this._loadingHUD = $("<div id='netLoadingHUD' style='position:absolute;background-color:transparent;pointer-events:none;z-index:10000000000000;width:100%;height:100%'><div id='HUDView'><div></div></div></div>");
			this._loadingHUD = $("<div id='netLoadingHUD' style='position:absolute;background-color:transparent;pointer-events:none;z-index:1;width:100%;height:100%'><div id='HUDView' class='bin-indicator active'><div></div></div></div>");
			
			root.append(this._loadingHUD);
			this._loadingIcon = this._loadingHUD.find('#HUDView');
			this._loadingIcon.hide();
			
			this._lc = 0;
			this._mc  = 0;
			this._lv = 1;
		}

		Class.show = function(options)
		{
			if(!options)
			{
				options = {};
			}
			else
			{
				options = osUtil.clone(options, true);
			}
			this._incLoading(options.model);
			options._lv = this._lv;

			return options;
		}

		Class.stop = function(id)
		{
			if(!id)
			{
				this.reset();

				return ;
			}

			if(id._lv < this._lv)
			{
				return ;
			}

			this._decLoading(id.model);
		}

		Class.reset = function()
		{
			this._loadingIcon.hide();
			this._loadingHUD.css("pointer-events", "none");
			this._lc = 0;
			this._mc = 0;
			
			++this._lv;
		}
			
		Class._incLoading = function(model) 
		{
			if(this._incLoadingCount() == 1)
			{
				this._loadingIcon.show();
			}

			if(model)
			{
				if(this._incModelCount() == 1)
				{
					this._loadingHUD.css("pointer-events", "auto");
				}
			}
		}

		Class._decLoading = function(model) 
		{
			if(this._decLoadingCount() == 0)
			{
				this._loadingIcon.hide();
			}

			if(model)
			{
				if(this._decModelCount() == 0)
				{
					this._loadingHUD.css("pointer-events", "none");
				}
			}
		}

		Class._incLoadingCount = function()
		{
			++this._lc;
			return this._lc;
		}

		Class._decLoadingCount = function()
		{
			--this._lc;
			this._lc = Math.max(this._lc, 0);
			
			return this._lc;
		}

		Class._incModelCount = function()
		{
			++this._mc;
			
			return this._mc;
		}

		Class._decModelCount = function()
		{
			--this._mc;
			this._mc = Math.max(this._mc, 0);
			
			return this._mc;
		}

		var inst = new Indicator();
		inst.init();
		return inst;
	}
);