define(["bin/web/core/application"], function(Application)
{
	var Class = {};

	Class.init = function()
	{
		var self = this;

		var elemRoot = document.documentElement;
		this._width  = elemRoot.clientWidth;
        this._height = elemRoot.clientHeight; 

        Application.prototype.init.apply(this);

		this._hudManager = new bin.core.HUDManager();
		this._hudManager.init();
	}

	Class.navHeight = function()
	{
		return this.rem2px(1.9);
	}
	
	Class.navClientHeight  = function()
	{
		return this.clientHeight()-this.navHeight();
	}
	
	Class.navClientWidth = function()
	{
		return this.clientWidth();
	}

	Class.onResize = function()
	{
		var elemRoot = document.documentElement;
        if(bin.globalConfig.width !== "fixed" && bin.globalConfig.height !== "fixed")
        {
            this._width  = elemRoot.clientWidth;
            this._height = elemRoot.clientHeight; 
		}		
        elemRoot.style.fontSize = this._width/640*40+"px";
	}

	Class.run = function()
	{
		Application.prototype.run.apply(this);
	}

	return Application.extend(Class);
});