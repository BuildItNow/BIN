define(
	function()
	{
		var cls = {};

		cls.rem2px           = function(rem)
	    {
	    	return rem*cls.rem;
	    }

	    cls.px2rem           = function(px)
	    {
	    	return px/cls.rem;
	    }

	    var onDisplayMetricsChanged = function()
	    {
	    	cls.rem              = bin.app.rem();
			cls.clientWidth  	 = bin.app.width();
		    cls.clientHeight     = bin.app.height();
		    cls.navHeight        = cls.rem2px(1.9);
		    cls.navClientHeight  = cls.clientHeight-cls.navHeight;
		    cls.navClientWidth   = cls.clientWidth;
	    }

	    if(bin.window)
	    {
	    	onDisplayMetricsChanged();
	   	}

	   	Backbone.on("DISPLAY_METRICS_CHANGED", onDisplayMetricsChanged);

	    return cls;
	}
);