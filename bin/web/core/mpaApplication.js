define(["bin/web/core/webApplication", "bin/util/fastclickUtil"], function(Application, fastclickUtil)
{
	var Class = {};

	Class.init = function()
	{
		fastclickUtil.attach(document.body);

		this.fixWindow();

        Application.prototype.init.apply(this);

		this._hudManager = new bin.core.HUDManager();
		this._hudManager.init();
		bin.hudManager = this._hudManager;
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
        elemRoot.style.fontSize = this._width/640*40+"px";
	}

	Class.run = function()
	{
		var view = bin.queryParams["binView"];
		if(view)
		{	
			$("#binMainView").attr("data-bin-view", view);
		}

		Application.prototype.run.apply(this);
	}

	return Application.extend(Class);
});