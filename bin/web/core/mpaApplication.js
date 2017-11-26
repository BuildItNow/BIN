define(["bin/web/core/webApplication", "fastclick"], function(Application, fastclick)
{
	fastclick.notNeeded = function(layer) 
	{
		'use strict';
		var metaViewport;
		var chromeVersion;

		// Devices that don't support touch don't need FastClick
		if (typeof window.ontouchstart === 'undefined') 
		{
			return true;
		}

		// Chrome version - zero for other browsers
		chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];

		if (chromeVersion) 
		{
			if (deviceIsAndroid) 
			{
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport)
				{
					// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) 
					{
						//patch here
						return false;
					}
					// Chrome 32 and above with width=device-width or less don't need FastClick
					if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) 
					{
						//patch here
						return false;
					}
				}

				// Chrome desktop doesn't need FastClick (issue #15)
			} 
			else 
			{
				//patch here
				return false;
			}
		}

		// IE10 with -ms-touch-action: none, which disables double-tap-to-zoom (issue #97)
		if (layer.style.msTouchAction === 'none') 
		{
			return true;
		}

		return false;
	};

	var Class = {};

	Class.init = function()
	{
		fastclick.attach(document.body);

		this.fixWindow();

        this._naviController = new bin.core.NavigationController();
        this._naviController.init();

        bin.naviController = this._naviController;

        Application.prototype.init.apply(this); 
	}

	Class.fixWindow = function()
	{
		this._elemWindow = $("#window");
		var elemWindow = this._elemWindow;

		elemWindow.css("position","absolute");
		elemWindow.css("overflow","hidden");
		elemWindow.css("display", "block");
        //this.$().css("transform", "scale(0.5)");
        //this.$().css("transform-origin", "top left");
				
		if(bin.globalConfig.width && bin.globalConfig.height)
		{
			if(bin.globalConfig.left)
			{
				elemWindow.css("left", bin.globalConfig.left+"px");
			}
			else
			{
				elemWindow.css("left", "0rem");
			}

			if(bin.globalConfig.top)
			{
				elemWindow.css("top", bin.globalConfig.top+"px");
			}
			else
			{
				elemWindow.css("top", "0rem");
			}

			if(bin.globalConfig.width === "fixed" || bin.globalConfig.height === "fixed")
			{
				var elemRoot = document.documentElement;
				this._width  = elemRoot.clientWidth;
               	this._height = elemRoot.clientHeight;
			}
			else
			{
				this._width  = bin.globalConfig.width;//*2;
				this._height = bin.globalConfig.height;//*2;
			}

			elemWindow.css("width", this._width + "px");
			elemWindow.css("height", this._height + "px");

            this._fixed = true;
		}
        else
        {
            elemWindow.css("left","0rem");
		    elemWindow.css("top","0rem");
        }
	}

	Class.navHeight = function()
	{
		return this.rem2px(2.2);
	}

	Class.navClientHeight = function()
	{
		return this.clientHeight()-this.navHeight();
	}

	Class.onResize = function()
	{
		var elemRoot = document.documentElement;
        if(!this._fixed)
        {
            this._width  = elemRoot.clientWidth;
            this._height = elemRoot.clientHeight; 
            this._elemWindow.css("width", this._width+"px");
            this._elemWindow.css("height", this._height+"px");
		}	

		var standard = 320;
        var unit     = 20;
        if(bin.globalConfig.remConfig)
        {
        	if(bin.globalConfig.remConfig.unit)
        	{
        		unit = bin.globalConfig.remConfig.unit;
        	}

        	if(bin.globalConfig.remConfig.standard)
        	{
        		standard = bin.globalConfig.remConfig.standard;
        	}
        }

        elemRoot.style.fontSize = this._width/standard*unit+"px";
	}

	return Application.extend(Class);
});
