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

	    cls.rem              = parseFloat(document.documentElement.style.fontSize);
		cls.clientWidth  	 = document.body.offsetWidth;
	    cls.clientHeight     = document.body.offsetHeight;;
	    cls.navHeight        = cls.rem2px(1.9);
	    cls.navClientHeight  = cls.clientHeight-cls.navHeight;
	    cls.navClientWidth   = cls.clientWidth;

	    return cls;
	}
);